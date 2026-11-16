import { NextResponse } from "next/server";
import { COOKIE_NAME, adminGate, sessionCookieOptions } from "@/lib/inbox/admin-auth";
import { sameOrigin } from "@/lib/inbox/http";

/** Clears the session cookie. Signing in again is one click; nothing is revoked. */
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  const denied = await adminGate();
  if (denied) return denied;
  if (!sameOrigin(request)) return new Response("Forbidden", { status: 403 });

  const response = NextResponse.redirect(new URL("/", request.url), 303);
  response.cookies.set(COOKIE_NAME, "", { ...sessionCookieOptions, maxAge: 0 });
  response.headers.set("cache-control", "private, no-store");
  return response;
}
