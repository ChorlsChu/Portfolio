import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  COOKIE_NAME,
  SESSION_TTL_DAYS,
  adminConfigured,
  authConfig,
  sessionCookieOptions,
  sessionCookieValue,
  timingSafeEqual,
} from "@/lib/inbox/admin-auth";
import { STATE_COOKIE, exchangeCode, isAllowed, type GithubIdentity } from "@/lib/inbox/github";
import { isHttps, notFoundResponse } from "@/lib/inbox/http";

/**
 * Step 2: GitHub sends the browser back here with a code.
 *
 * The code is exchanged server-side (the client secret never reaches the browser),
 * the account is checked against ADMIN_GITHUB_ALLOW, and a session cookie is
 * issued. Anything else - bad state, failed exchange, wrong account - is a 404, so
 * the endpoint reveals nothing about who is allowed.
 */

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  if (!(await adminConfigured())) return notFoundResponse();

  const url = new URL(request.url);
  const jar = await cookies();

  const expectedState = jar.get(STATE_COOKIE)?.value ?? "";
  const state = url.searchParams.get("state") ?? "";
  const code = url.searchParams.get("code") ?? "";

  if (!expectedState || !state || !timingSafeEqual(state, expectedState)) {
    return notFoundResponse();
  }
  if (!code) return notFoundResponse();

  const { clientId, clientSecret, allowed } = await authConfig();
  const redirectUri = new URL("/api/admin/auth/callback", url).toString();

  let identity: GithubIdentity | null = null;
  try {
    identity = await exchangeCode({ code, clientId, clientSecret, redirectUri });
  } catch {
    return new Response("Sign-in could not reach GitHub. Try again in a moment.", {
      status: 502,
      headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
    });
  }

  if (!identity || !isAllowed(identity, allowed)) return notFoundResponse();

  const issuedAt = Date.now();
  const response = NextResponse.redirect(new URL("/admin/reports", url), 303);
  response.cookies.set(COOKIE_NAME, await sessionCookieValue(identity.login, issuedAt), {
    ...sessionCookieOptions,
    secure: isHttps(request),
    maxAge: SESSION_TTL_DAYS * 86_400,
  });
  response.cookies.set(STATE_COOKIE, "", { path: "/api/admin/auth", maxAge: 0 });
  response.headers.set("cache-control", "private, no-store");
  response.headers.set("referrer-policy", "no-referrer");
  return response;
}
