import { type D1, getDb } from "./db";

/**
 * Fixed-window counters backed by a single atomic UPSERT per bucket.
 *
 * SQLite (and therefore D1) evaluates `ON CONFLICT ... DO UPDATE ... RETURNING`
 * as one statement, so two concurrent reports cannot both read "4" and both
 * write "5" - the increment is serialized by the database.
 */
export type LimitResult = { allowed: boolean; count: number; limit: number };

export async function bumpBucket(
  db: D1,
  bucket: string,
  limit: number,
  ttlSeconds: number,
): Promise<LimitResult> {
  const expiresAt = Date.now() + ttlSeconds * 1000;
  const row = await db
    .prepare(
      `INSERT INTO rate_limits (bucket, count, expires_at) VALUES (?, 1, ?)
       ON CONFLICT (bucket) DO UPDATE SET count = count + 1
       RETURNING count`,
    )
    .bind(bucket, expiresAt)
    .first<{ count: number }>();

  const count = row?.count ?? 1;
  return { allowed: count <= limit, count, limit };
}

/** YYYY-MM-DD in UTC: the window boundary does not follow the reporter's clock. */
export function dayKey(now = Date.now()): string {
  return new Date(now).toISOString().slice(0, 10);
}

/**
 * Salted, truncated hash of the reporter's IP. The salt lives in the database
 * so a dump of the reports table alone cannot be brute-forced back to addresses.
 */
export async function hashIp(ip: string): Promise<string> {
  const db = await getDb();
  const saltRow = await db
    .prepare("SELECT value FROM settings WHERE key = 'ip_salt'")
    .bind()
    .first<{ value: string }>();

  let salt = saltRow?.value;
  if (!salt) {
    salt = toHex(crypto.getRandomValues(new Uint8Array(16)));
    await db
      .prepare(
        `INSERT INTO settings (key, value, updated_at) VALUES ('ip_salt', ?, ?)
         ON CONFLICT (key) DO NOTHING`,
      )
      .bind(salt, Date.now())
      .run();
  }

  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${salt}|${ip}`));
  return toHex(new Uint8Array(digest)).slice(0, 24);
}

/** Drops counter rows that expired more than a day ago. */
export async function purgeExpiredCounters(db: D1): Promise<void> {
  const cutoff = Date.now() - 86_400_000;
  await db.prepare("DELETE FROM rate_limits WHERE expires_at < ?").bind(cutoff).run();
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}
