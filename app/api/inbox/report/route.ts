import { gzipBase64 } from "@/lib/inbox/gzip";
import { bumpBucket, dayKey, hashIp, purgeExpiredCounters } from "@/lib/inbox/limits";
import { newReportId, purgeOldReports } from "@/lib/inbox/queries";
import { getDb, waitUntil } from "@/lib/inbox/db";

/**
 * Public report intake for the Sifu Moveset Editor.
 *
 * There is no client authentication, and that is deliberate: the desktop app is
 * distributed as an exe, so any key baked into it is public knowledge. Defence is
 * therefore server-side - strict shape validation, hard size caps, and three
 * independent rate limits - and every field is treated as untrusted text.
 */

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 1024 * 1024;
const MAX_LOG_CHARS = 256 * 1024;

// Why 1 MB when the log is capped at 256K characters: JSON escaping and
// multi-byte characters can roughly triple the wire size of a log full of
// quotes, backslashes or non-Latin text. Rejecting a real report because of an
// encoding detail is worse than parsing an extra few hundred kilobytes.

const LIMITS = {
  clientPerDay: 5,
  ipPerDay: 20,
  globalPerDay: 200,
};

type Payload = Record<string, unknown>;

export async function POST(request: Request): Promise<Response> {
  const contentType = (request.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
  if (contentType !== "application/json") {
    return json({ error: "expected application/json" }, 415);
  }

  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (declaredLength > MAX_BODY_BYTES) {
    return json({ error: "payload too large" }, 413);
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return json({ error: "payload too large" }, 413);
  }

  let payload: Payload;
  try {
    payload = JSON.parse(raw) as Payload;
  } catch {
    return json({ error: "invalid json" }, 400);
  }
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return json({ error: "invalid json" }, 400);
  }

  // Honeypot: the editor never sends this field. Answer like a success so a bot
  // cannot tell the difference, but write nothing.
  if (typeof payload.website === "string" && payload.website.trim().length > 0) {
    return json({ id: newReportId() }, 200);
  }

  const title = str(payload.title, 120).trim();
  const body = str(payload.body, 8000).trim();
  if (title.length < 3 || body.length < 10) {
    return json({ error: "summary and description are required" }, 400);
  }

  const type = ["bug", "crash", "feature"].includes(str(payload.type, 16)) ? str(payload.type, 16) : "bug";
  const contact = str(payload.contact, 200).trim();
  const log = str(payload.log, MAX_LOG_CHARS);

  const ip = clientIp(request);
  const country = (request as unknown as { cf?: { country?: string } }).cf?.country ?? "";
  const clientHeader = str(payload.client, 64);

  const db = await getDb();

  // Global first: the cheapest possible stop for a flood.
  const day = dayKey();
  const global = await bumpBucket(db, `g:${day}`, LIMITS.globalPerDay, 2 * 86_400);
  if (!global.allowed) return tooMany();

  if (/^[a-f0-9]{16,64}$/i.test(clientHeader)) {
    const perClient = await bumpBucket(db, `c:${clientHeader}:${day}`, LIMITS.clientPerDay, 2 * 86_400);
    if (!perClient.allowed) return tooMany();
  }

  const ipHash = await hashIp(ip);
  const perIp = await bumpBucket(db, `i:${ipHash}:${day}`, LIMITS.ipPerDay, 2 * 86_400);
  if (!perIp.allowed) return tooMany();

  const logGz = log ? await gzipBase64(log) : "";
  const logBytes = log ? new TextEncoder().encode(log).length : 0;

  const values = [
    type,
    title,
    body,
    str(payload.steps, 4000),
    contact,
    str(payload.version, 64),
    str(payload.os, 120),
    str(payload.arch, 32),
    str(payload.dotnet, 64),
    str(payload.webview2, 64),
    clientHeader,
    country.slice(0, 8),
    payload.unclean_exit === true ? 1 : 0,
    str(payload.context, 2000),
    str(payload.last_fatal, 4000),
    logGz,
    logBytes,
    ipHash,
  ] as const;

  let id = "";
  for (let attempt = 0; attempt < 3 && !id; attempt += 1) {
    const candidate = newReportId();
    try {
      await db
        .prepare(
          `INSERT INTO reports
             (id, created_at, type, status, title, body, steps, contact, version, os, arch,
              dotnet, webview2, client, country, unclean_exit, context, last_fatal,
              log_gz, log_bytes, ip_hash)
           VALUES (?, ?, ?, 'new', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(candidate, Date.now(), ...values)
        .run();
      id = candidate;
    } catch (error) {
      // A primary-key clash is astronomically unlikely; anything else is real.
      if (!String(error).includes("UNIQUE")) throw error;
    }
  }

  if (!id) return json({ error: "could not store report" }, 500);

  // Retention and counter hygiene ride along with traffic instead of a cron.
  if (Math.random() < 0.05) {
    waitUntil(purgeOldReports().catch(() => undefined));
  }
  if (Math.random() < 0.02) {
    waitUntil(purgeExpiredCounters(db).catch(() => undefined));
  }

  return json({ id }, 200);
}

export async function GET(): Promise<Response> {
  return new Response("Method Not Allowed", { status: 405, headers: { allow: "POST" } });
}

function str(value: unknown, max: number): string {
  return typeof value === "string" ? value.slice(0, max) : "";
}

function clientIp(request: Request): string {
  const direct = request.headers.get("cf-connecting-ip");
  if (direct) return direct;
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() : "unknown";
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function tooMany(): Response {
  return new Response(JSON.stringify({ error: "too many reports, try again tomorrow" }), {
    status: 429,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "retry-after": "3600",
    },
  });
}
