import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ensureSetting } from "./db";
import { readEnv } from "./env";

/**
 * Admin authentication: "Sign in with GitHub".
 *
 * There is no password and no durable user-held credential to lose. GitHub proves
 * the identity, the Worker checks that account against ADMIN_GITHUB_ALLOW, and the
 * result is an HMAC session cookie. Nothing expires monthly, nothing has to be
 * saved somewhere, and there is no reset flow to get locked out of.
 *
 * The cookie is `login.issuedAt.signature`. The timestamp rides in clear text so
 * the cookie can expire on its own even if a browser keeps it forever, and the
 * signature covers it so it cannot be edited. Rotating the `admin_session_key`
 * setting - or bumping SESSION_VERSION - signs every open browser out at once.
 */

const COOKIE_NAME = "sifu_inbox";
const SESSION_KEY = "admin_session_key";
const SESSION_VERSION = "inbox-session-v2";

export const SESSION_TTL_DAYS = 365;

export type GithubAllowConfig = {
  clientId: string;
  clientSecret: string;
  /** Lowercased GitHub logins and numeric ids, from ADMIN_GITHUB_ALLOW. */
  allowed: string[];
};

export async function authConfig(): Promise<GithubAllowConfig> {
  const [clientId, clientSecret, allow] = await Promise.all([
    readEnv("GITHUB_CLIENT_ID"),
    readEnv("GITHUB_CLIENT_SECRET"),
    readEnv("ADMIN_GITHUB_ALLOW"),
  ]);

  const allowed = allow
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);

  return { clientId, clientSecret, allowed };
}

/** True when every variable the sign-in flow needs is present. */
export async function adminConfigured(): Promise<boolean> {
  const { clientId, clientSecret, allowed } = await authConfig();
  return Boolean(clientId && clientSecret && allowed.length > 0);
}

/** Constant-time comparison of two equal-purpose strings. */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

/** A fresh 256-bit URL-safe random string, used for the OAuth state value. */
export function randomToken(): string {
  return Buffer.from(crypto.getRandomValues(new Uint8Array(32)))
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function hmacHex(keyBase64: string, message: string): Promise<string> {
  const key = Buffer.from(keyBase64, "base64");
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(message));
  return toHex(new Uint8Array(signature));
}

/**
 * Stable key for the session cookie, created on first use.
 *
 * Delete this row to revoke every signed-in browser: the next request mints a new
 * key, so old cookies stop verifying.
 */
async function sessionKey(): Promise<string> {
  return ensureSetting(SESSION_KEY, () =>
    Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString("base64"),
  );
}

export async function sessionCookieValue(login: string, issuedAt: number): Promise<string> {
  const message = `${SESSION_VERSION}:${login.toLowerCase()}:${issuedAt}`;
  const signature = await hmacHex(await sessionKey(), message);
  return `${login}.${issuedAt}.${signature}`;
}

export type AdminSession = { login: string; issuedAt: number };

function splitSession(raw: string): { login: string; issuedAt: number } | null {
  // GitHub logins cannot contain a dot and the signature is hex, so three parts
  // is unambiguous.
  const parts = raw.split(".");
  if (parts.length !== 3) return null;

  const issuedAt = Number(parts[1]);
  if (!parts[0] || !Number.isSafeInteger(issuedAt)) return null;

  return { login: parts[0], issuedAt };
}

/** The session carried by this request, or null. */
export async function readSession(): Promise<AdminSession | null> {
  const jar = await cookies();
  const raw = jar.get(COOKIE_NAME)?.value;
  if (!raw) return null;

  const parsed = splitSession(raw);
  if (!parsed) return null;
  if (Date.now() - parsed.issuedAt > SESSION_TTL_DAYS * 86_400_000) return null;

  const expected = await sessionCookieValue(parsed.login, parsed.issuedAt);
  return timingSafeEqual(raw, expected) ? parsed : null;
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "strict" as const,
  path: "/admin",
};

/**
 * Page guard. No valid session means the admin area does not exist, so report
 * pages 404 before any data is queried. Returns the session for the chrome.
 */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await readSession();
  if (!session) notFound();
  return session;
}

/** Route-handler variant: returns a 404 response instead of throwing. */
export async function adminGate(): Promise<Response | null> {
  if (await readSession()) return null;
  return new Response("Not found", { status: 404, headers: { "cache-control": "no-store" } });
}

export { COOKIE_NAME };
