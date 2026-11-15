import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { deleteSetting, getDb, getSetting, setSetting } from "./db";

/**
 * Admin authentication without Cloudflare Access.
 *
 * The credential is a 256-bit unlock token carried in a URL once
 * (`/admin/unlock?k=...`). A correct token buys an HttpOnly session cookie; the
 * token itself is never stored - only its SHA-256 - so a database dump cannot be
 * turned back into a working link.
 *
 * The session cookie is an HMAC of a separate, stable session key. That split is
 * deliberate: rotating the unlock link retires old links without logging the
 * admin out, and rotating the session key revokes every open browser at once.
 */

const COOKIE_NAME = "sifu_inbox";
const TOKEN_HASH_KEY = "admin_token_hash";
const TOKEN_EXPIRES_KEY = "admin_token_expires_at";
const SESSION_KEY = "admin_session_key";

export const TOKEN_TTL_DAYS = 30;
export const SESSION_TTL_DAYS = 30;

export type AdminTokenState = {
  /** `db` once a token has been rotated; `bootstrap` while only ADMIN_TOKEN is set. */
  mode: "db" | "bootstrap" | "unconfigured";
  expiresAt: number | null;
  expired: boolean;
  daysLeft: number | null;
};

export async function adminTokenState(): Promise<AdminTokenState> {
  const [hash, expiresRaw] = await Promise.all([
    getSetting(TOKEN_HASH_KEY),
    getSetting(TOKEN_EXPIRES_KEY),
  ]);

  if (hash) {
    const expiresAt = expiresRaw ? Number(expiresRaw) : null;
    const expired = expiresAt !== null && expiresAt <= Date.now();
    const daysLeft =
      expiresAt === null ? null : Math.max(0, Math.ceil((expiresAt - Date.now()) / 86_400_000));
    return { mode: "db", expiresAt, expired, daysLeft };
  }

  return {
    mode: (await bootstrapToken()) ? "bootstrap" : "unconfigured",
    expiresAt: null,
    expired: false,
    daysLeft: null,
  };
}

/**
 * The bootstrap token, used only while no rotated token exists.
 *
 * `wrangler secret put` lands the value in the Worker env binding, while
 * `next dev` also exposes .dev.vars through process.env - check both, because
 * neither source is present in every runtime.
 */
async function bootstrapToken(): Promise<string> {
  const fromProcess = (process.env.ADMIN_TOKEN ?? "").trim();
  if (fromProcess) return fromProcess;
  try {
    const { env } = await getCloudflareContext({ async: true });
    return String((env as unknown as { ADMIN_TOKEN?: string }).ADMIN_TOKEN ?? "").trim();
  } catch {
    return "";
  }
}

/** Constant-time comparison of two equal-purpose strings. */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return toHex(new Uint8Array(digest));
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

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function toBase64Url(bytes: Uint8Array): string {
  return Buffer.from(bytes)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/** A fresh 256-bit unlock token, URL-safe. */
export function newUnlockToken(): string {
  return toBase64Url(crypto.getRandomValues(new Uint8Array(32)));
}

/**
 * True when `candidate` is the current unlock token. A rotated token supersedes
 * ADMIN_TOKEN entirely; deleting the stored hash falls back to the env value,
 * which is the documented break-glass path.
 */
export async function verifyUnlockToken(candidate: string): Promise<boolean> {
  if (!candidate) return false;

  const [hash, expiresRaw] = await Promise.all([
    getSetting(TOKEN_HASH_KEY),
    getSetting(TOKEN_EXPIRES_KEY),
  ]);

  if (hash) {
    if (expiresRaw && Number(expiresRaw) <= Date.now()) return false;
    return timingSafeEqual(await sha256Hex(candidate), hash);
  }

  const bootstrap = await bootstrapToken();
  return bootstrap.length > 0 && timingSafeEqual(candidate, bootstrap);
}

async function sessionKey(): Promise<string> {
  const existing = await getSetting(SESSION_KEY);
  if (existing) return existing;
  const created = Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString("base64");
  await setSetting(SESSION_KEY, created);
  return created;
}

/** Issues a session cookie value; the caller decides where to attach it. */
export async function sessionCookieValue(): Promise<string> {
  return hmacHex(await sessionKey(), "inbox-session-v1");
}

export type SessionCookie = {
  name: string;
  value: string;
  maxAge: number;
  path: string;
};

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "strict" as const,
  path: "/admin",
};

/** True when the request carries a session cookie minted by the current key. */
export async function hasValidSession(): Promise<boolean> {
  const jar = await cookies();
  const presented = jar.get(COOKIE_NAME)?.value;
  if (!presented) return false;
  return timingSafeEqual(presented, await sessionCookieValue());
}

/** Page/route guard. No valid session means the admin area does not exist. */
export async function requireAdmin(): Promise<void> {
  if (!(await hasValidSession())) notFound();
}

/** Route-handler variant: returns a 404 response instead of throwing. */
export async function adminGate(): Promise<Response | null> {
  if (await hasValidSession()) return null;
  return new Response("Not found", { status: 404, headers: { "cache-control": "no-store" } });
}

/** True when nothing is configured at all - the admin area must fail closed. */
export async function adminConfigured(): Promise<boolean> {
  const state = await adminTokenState();
  return state.mode !== "unconfigured";
}

/** Mints a new token, stores only its hash + expiry, and returns the token once. */
export async function rotateUnlockToken(): Promise<string> {
  const token = newUnlockToken();
  const expiresAt = Date.now() + TOKEN_TTL_DAYS * 86_400_000;
  const db = await getDb();

  await db.batch([
    db
      .prepare(
        `INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?)
         ON CONFLICT (key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
      )
      .bind(TOKEN_HASH_KEY, await sha256Hex(token), Date.now()),
    db
      .prepare(
        `INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?)
         ON CONFLICT (key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
      )
      .bind(TOKEN_EXPIRES_KEY, String(expiresAt), Date.now()),
  ]);

  return token;
}

/** Break-glass: forget the rotated token so ADMIN_TOKEN works again. */
export async function clearRotatedToken(): Promise<void> {
  await deleteSetting(TOKEN_HASH_KEY);
  await deleteSetting(TOKEN_EXPIRES_KEY);
}

export { COOKIE_NAME };
