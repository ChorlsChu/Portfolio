import { NextResponse } from "next/server";
import {
  COOKIE_NAME,
  SESSION_TTL_DAYS,
  TOKEN_TTL_DAYS,
  adminGate,
  rotateUnlockToken,
  sessionCookieOptions,
  sessionCookieValue,
} from "@/lib/inbox/admin-auth";
import { isHttps, noStore, sameOrigin } from "@/lib/inbox/http";

/**
 * Issues a new unlock link and shows it exactly once.
 *
 * Only the token's hash is stored, so this page is the single opportunity to copy
 * the URL. Rotating does not touch the session key, so the browser stays signed in.
 */

export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  const denied = await adminGate();
  if (denied) return denied;
  if (!sameOrigin(request)) return new Response("Forbidden", { status: 403 });

  const token = await rotateUnlockToken();
  const base = new URL(request.url);
  const link = `${base.origin}/admin/unlock?k=${encodeURIComponent(token)}`;

  const response = new NextResponse(renderPage(link), {
    status: 200,
    headers: noStore({ "content-type": "text/html; charset=utf-8" }),
  });
  response.cookies.set(COOKIE_NAME, await sessionCookieValue(), {
    ...sessionCookieOptions,
    secure: isHttps(request),
    maxAge: SESSION_TTL_DAYS * 86_400,
  });
  return response;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderPage(link: string): string {
  const safeLink = escapeHtml(link);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>New unlock link</title>
<style>
  :root { color-scheme: dark; }
  body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 24px;
         background: radial-gradient(circle at 20% 0%, rgba(110,160,200,.12), transparent 40%), #081016;
         color: #edf3f7; font: 15px/1.6 system-ui, -apple-system, "Segoe UI", sans-serif; }
  main { width: min(680px, 100%); background: rgba(14,20,27,.98); border: 1px solid rgba(201,166,107,.38);
         border-radius: 14px; padding: 28px; }
  h1 { margin: 0 0 6px; font-size: 20px; color: #c9a66b; letter-spacing: .01em; }
  p { margin: 0 0 18px; color: #9ca9b4; font-size: 13px; }
  .link { display: flex; gap: 8px; margin: 18px 0; }
  input { flex: 1; padding: 11px 12px; border-radius: 8px; border: 1px solid rgba(173,189,201,.25);
          background: #11181f; color: #edf3f7; font: 12px/1.4 ui-monospace, Consolas, monospace; }
  button, a.btn { border: 0; border-radius: 8px; padding: 11px 16px; font: 600 13px/1 system-ui, sans-serif;
          cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; }
  button { background: #c9a66b; color: #081016; }
  a.btn { background: rgba(173,189,201,.12); color: #edf3f7; }
  .row { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
  .note { margin-top: 18px; padding: 12px 14px; border-left: 3px solid #6ea0c8;
          background: rgba(110,160,200,.08); color: #c3ccd4; font-size: 12.5px; border-radius: 0 8px 8px 0; }
  code { color: #c9a66b; }
</style>
</head>
<body>
<main>
  <h1>New unlock link</h1>
  <p>This is shown once. Save it in your password manager now - only its hash is stored.</p>
  <div class="link">
    <input id="url" readonly value="${safeLink}">
    <button id="copy" type="button">Copy</button>
  </div>
  <div class="row">
    <a class="btn" href="/admin/reports">Open inbox</a>
    <a class="btn" href="/admin/reports" id="later">I'll save it later</a>
  </div>
  <div class="note">
    Expires in <code>${TOKEN_TTL_DAYS} days</code>. Your current browser session is unaffected.
    Rotating again replaces this link immediately.
  </div>
</main>
<script>
  document.getElementById("copy").addEventListener("click", async () => {
    const input = document.getElementById("url");
    input.select();
    try { await navigator.clipboard.writeText(input.value); }
    catch { document.execCommand("copy"); }
    document.getElementById("copy").textContent = "Copied";
    setTimeout(() => { document.getElementById("copy").textContent = "Copy"; }, 1500);
  });
</script>
</body>
</html>`;
}
