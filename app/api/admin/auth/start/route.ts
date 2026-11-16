import { NextResponse } from "next/server";
import { adminConfigured, authConfig, randomToken } from "@/lib/inbox/admin-auth";
import { STATE_COOKIE } from "@/lib/inbox/github";
import { isHttps, notFoundResponse } from "@/lib/inbox/http";

/**
 * Step 1 of the handshake: park a random state value in a short-lived cookie and
 * send the browser to GitHub.
 *
 * The state is what makes the callback trustworthy - it proves the callback came
 * from a flow this browser started, so a link someone else crafts cannot sign you
 * in as them.
 */

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  if (!(await adminConfigured())) return notFoundResponse();

  const url = new URL(request.url);
  const { clientId } = await authConfig();
  const state = randomToken();

  const authorize = new URL("https://github.com/login/oauth/authorize");
  authorize.searchParams.set("client_id", clientId);
  authorize.searchParams.set("redirect_uri", new URL("/api/admin/auth/callback", url).toString());
  authorize.searchParams.set("scope", "read:user");
  authorize.searchParams.set("state", state);
  authorize.searchParams.set("allow_signup", "false");

  const response = NextResponse.redirect(authorize.toString(), 302);
  response.cookies.set(STATE_COOKIE, state, {
    httpOnly: true,
    // Lax, not Strict: the return from GitHub is a cross-site top-level navigation,
    // and a Strict cookie would not be sent on it.
    sameSite: "lax",
    secure: isHttps(request),
    path: "/api/admin/auth",
    maxAge: 600,
  });
  response.headers.set("cache-control", "private, no-store");
  response.headers.set("referrer-policy", "no-referrer");
  return response;
}
