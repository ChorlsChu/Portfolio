import { NextResponse } from "next/server";
import {
  COOKIE_NAME,
  SESSION_TTL_DAYS,
  sessionCookieOptions,
  sessionCookieValue,
  adminConfigured,
  verifyUnlockToken,
} from "@/lib/inbox/admin-auth";
import { getDb } from "@/lib/inbox/db";
import { clientIp, isHttps, notFoundResponse } from "@/lib/inbox/http";
import { bumpBucket, hashIp } from "@/lib/inbox/limits";

/**
 * Unlock handshake: `/admin/unlock?k=<token>`.
 *
 * A correct token buys a session cookie and a 303 that strips the token from the
 * address bar. A wrong one is indistinguishable from a URL that does not exist,
 * and attempts are rate limited so the token cannot be ground down.
 */

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  if (!(await adminConfigured())) {
    return new Response("Admin area is not configured.", {
      status: 503,
      headers: { "cache-control": "no-store" },
    });
  }

  const url = new URL(request.url);
  const key = url.searchParams.get("k") ?? "";
  if (!key) return notFoundResponse();

  const db = await getDb();
  const ipHash = await hashIp(clientIp(request));
  const hour = Math.floor(Date.now() / 3_600_000);
  const attempts = await bumpBucket(db, `u:${ipHash}:${hour}`, 10, 7_200);
  if (!attempts.allowed) {
    return new Response("Too many attempts.", {
      status: 429,
      headers: { "cache-control": "no-store", "retry-after": "3600" },
    });
  }

  if (!(await verifyUnlockToken(key))) return notFoundResponse();

  const response = NextResponse.redirect(new URL("/admin/reports", url), 303);
  response.cookies.set(COOKIE_NAME, await sessionCookieValue(), {
    ...sessionCookieOptions,
    secure: isHttps(request),
    maxAge: SESSION_TTL_DAYS * 86_400,
  });
  response.headers.set("cache-control", "private, no-store");
  response.headers.set("referrer-policy", "no-referrer");
  return response;
}
