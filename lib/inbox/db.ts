import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * The slice of D1 this inbox actually uses, declared locally so the project does
 * not need @cloudflare/workers-types just for a handful of methods.
 */
export type D1Statement = {
  bind(...values: unknown[]): D1Statement;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<{ results: T[]; success: boolean }>;
  run(): Promise<{ success: boolean; meta?: { changes?: number } }>;
};

export type D1 = {
  prepare(sql: string): D1Statement;
  batch(statements: D1Statement[]): Promise<unknown>;
};

export type ReportRow = {
  id: string;
  created_at: number;
  type: string;
  status: string;
  title: string;
  body: string;
  steps: string;
  contact: string;
  version: string;
  os: string;
  arch: string;
  dotnet: string;
  webview2: string;
  client: string;
  country: string;
  unclean_exit: number;
  context: string;
  last_fatal: string;
  log_gz: string;
  log_bytes: number;
  ip_hash: string;
};

export type ReportSummary = Pick<
  ReportRow,
  "id" | "created_at" | "type" | "status" | "title" | "version" | "log_bytes" | "unclean_exit"
>;

export const REPORT_STATUSES = ["new", "open", "fixed", "wontfix", "spam"] as const;
export type ReportStatus = (typeof REPORT_STATUSES)[number];

/** Retention: reports older than this are purged opportunistically. */
export const KEEP_DAYS = 180;

export async function getDb(): Promise<D1> {
  const { env } = await getCloudflareContext({ async: true });
  const db = (env as unknown as { DB?: D1 }).DB;
  if (!db) {
    throw new Error(
      'D1 binding "DB" is not configured. Add a d1_databases entry to wrangler.jsonc and redeploy.',
    );
  }
  return db;
}

/** Runs work after the response is sent (purges, counter resets). */
export function waitUntil(promise: Promise<unknown>): void {
  try {
    const { ctx } = getCloudflareContext();
    const ctxWithWaitUntil = ctx as unknown as { waitUntil?: (p: Promise<unknown>) => void };
    if (ctxWithWaitUntil.waitUntil) {
      ctxWithWaitUntil.waitUntil(promise);
      return;
    }
  } catch {
    // No execution context (local route handler during dev): let it run inline.
  }
  void promise;
}

export async function getSetting(key: string): Promise<string | null> {
  const db = await getDb();
  const row = await db
    .prepare("SELECT value FROM settings WHERE key = ?")
    .bind(key)
    .first<{ value: string }>();
  return row?.value ?? null;
}

export async function setSetting(key: string, value: string): Promise<void> {
  const db = await getDb();
  await db
    .prepare(
      `INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?)
       ON CONFLICT (key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
    )
    .bind(key, value, Date.now())
    .run();
}

export async function deleteSetting(key: string): Promise<void> {
  const db = await getDb();
  await db.prepare("DELETE FROM settings WHERE key = ?").bind(key).run();
}

/** Reads a setting, creating it with `make()` the first time. */
export async function ensureSetting(key: string, make: () => string): Promise<string> {
  const existing = await getSetting(key);
  if (existing) return existing;
  const created = make();
  await setSetting(key, created);
  return created;
}
