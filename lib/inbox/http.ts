/** Small request helpers shared by the admin routes. */

export function clientIp(request: Request): string {
  const direct = request.headers.get("cf-connecting-ip");
  if (direct) return direct;
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() : "unknown";
}

/**
 * Cloudflare terminates TLS and sets `x-forwarded-proto`. Local preview runs on
 * plain http, where a Secure cookie would be dropped - so the attribute follows
 * the actual scheme rather than NODE_ENV.
 */
export function isHttps(request: Request): boolean {
  const proto = request.headers.get("x-forwarded-proto");
  if (proto) return proto.split(",")[0].trim() === "https";
  return new URL(request.url).protocol === "https:";
}

/** Rejects cross-site form posts. Same-origin browser submissions carry Origin. */
export function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

export function notFoundResponse(): Response {
  return new Response("Not found", {
    status: 404,
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
  });
}

export function noStore(headers: Record<string, string> = {}): Headers {
  const out = new Headers(headers);
  out.set("cache-control", "private, no-store, max-age=0");
  out.set("referrer-policy", "no-referrer");
  out.set("x-robots-tag", "noindex, nofollow");
  return out;
}
