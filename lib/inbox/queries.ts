import { KEEP_DAYS, REPORT_STATUSES, type D1, type ReportRow, type ReportSummary, getDb } from "./db";
import { dayKey } from "./limits";

/**
 * Queries used by the admin pages. Kept in one module so every read goes through
 * the same parameter binding and the same status whitelist.
 */

export type ListFilters = {
  status?: string;
  type?: string;
  q?: string;
  page?: number;
};

export const PAGE_SIZE = 50;

export function normalizeStatus(value: string | undefined): string | undefined {
  if (!value || value === "all") return undefined;
  return (REPORT_STATUSES as readonly string[]).includes(value) ? value : undefined;
}

export function normalizeType(value: string | undefined): string | undefined {
  return value === "bug" || value === "crash" || value === "feature" ? value : undefined;
}

/** LIKE with the wildcard characters escaped, so "100%" is a literal search. */
function likePattern(query: string): string {
  return `%${query.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
}

export async function listReports(filters: ListFilters): Promise<{ rows: ReportSummary[]; total: number }> {
  const db = await getDb();
  const where: string[] = [];
  const params: unknown[] = [];

  if (filters.status) {
    where.push("status = ?");
    params.push(filters.status);
  }
  if (filters.type) {
    where.push("type = ?");
    params.push(filters.type);
  }
  if (filters.q) {
    where.push("(title LIKE ? ESCAPE '\\' OR body LIKE ? ESCAPE '\\')");
    params.push(likePattern(filters.q), likePattern(filters.q));
  }

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const page = Math.max(1, filters.page ?? 1);
  const offset = (page - 1) * PAGE_SIZE;

  const [list, count] = await Promise.all([
    db
      .prepare(
        `SELECT id, created_at, type, status, title, version, log_bytes, unclean_exit
         FROM reports ${whereSql}
         ORDER BY created_at DESC
         LIMIT ? OFFSET ?`,
      )
      .bind(...params, PAGE_SIZE, offset)
      .all<ReportSummary>(),
    db.prepare(`SELECT COUNT(*) AS n FROM reports ${whereSql}`).bind(...params).first<{ n: number }>(),
  ]);

  return { rows: list.results ?? [], total: count?.n ?? 0 };
}

export async function getReport(id: string): Promise<ReportRow | null> {
  const db = await getDb();
  return db.prepare("SELECT * FROM reports WHERE id = ?").bind(id).first<ReportRow>();
}

export type StatusCounts = Record<string, number>;

export async function statusCounts(): Promise<StatusCounts> {
  const db = await getDb();
  const result = await db
    .prepare("SELECT status, COUNT(*) AS n FROM reports GROUP BY status")
    .bind()
    .all<{ status: string; n: number }>();
  const counts: StatusCounts = {};
  for (const row of result.results ?? []) counts[row.status] = row.n;
  return counts;
}

/** Reports received today (UTC), read from the same counter the endpoint bumps. */
export async function todayCount(): Promise<number> {
  const db = await getDb();
  const row = await db
    .prepare("SELECT count FROM rate_limits WHERE bucket = ?")
    .bind(`g:${dayKey()}`)
    .first<{ count: number }>();
  return row?.count ?? 0;
}

export type Note = { id: number; created_at: number; body: string };

export async function listNotes(reportId: string): Promise<Note[]> {
  const db = await getDb();
  const result = await db
    .prepare("SELECT id, created_at, body FROM report_notes WHERE report_id = ? ORDER BY created_at ASC")
    .bind(reportId)
    .all<Note>();
  return result.results ?? [];
}

export async function addNote(reportId: string, body: string): Promise<void> {
  const db = await getDb();
  await db
    .prepare("INSERT INTO report_notes (report_id, created_at, body) VALUES (?, ?, ?)")
    .bind(reportId, Date.now(), body.slice(0, 4000))
    .run();
}

export async function setStatus(reportId: string, status: string): Promise<void> {
  if (!(REPORT_STATUSES as readonly string[]).includes(status)) return;
  const db = await getDb();
  await db.prepare("UPDATE reports SET status = ? WHERE id = ?").bind(status, reportId).run();
}

export async function deleteReport(reportId: string): Promise<void> {
  const db = await getDb();
  await db.batch([
    db.prepare("DELETE FROM report_notes WHERE report_id = ?").bind(reportId),
    db.prepare("DELETE FROM reports WHERE id = ?").bind(reportId),
  ]);
}

/** Deletes reports past the retention window. Returns how many went. */
export async function purgeOldReports(): Promise<number> {
  const db = await getDb();
  const cutoff = Date.now() - KEEP_DAYS * 86_400_000;
  const stale = await db
    .prepare("SELECT COUNT(*) AS n FROM reports WHERE created_at < ?")
    .bind(cutoff)
    .first<{ n: number }>();

  await db.batch([
    db.prepare("DELETE FROM reports WHERE created_at < ?").bind(cutoff),
    db.prepare("DELETE FROM report_notes WHERE report_id NOT IN (SELECT id FROM reports)").bind(),
    db.prepare("DELETE FROM rate_limits WHERE expires_at < ?").bind(Date.now() - 86_400_000),
  ]);

  return stale?.n ?? 0;
}

/** Short, unambiguous id: 6 characters from a 32-symbol alphabet (no 0/O/1/I). */
const ID_ALPHABET = "23456789abcdefghjkmnpqrstuvwxyz";

export function newReportId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  let id = "";
  for (const byte of bytes) id += ID_ALPHABET[byte % ID_ALPHABET.length];
  return id;
}

/** Report text in the same shape the editor produces, for the .txt download. */
export function reportAsText(report: ReportRow, log: string): string {
  const lines: string[] = [
    "Sifu Moveset Editor - bug report",
    `Id        : ${report.id}`,
    `Received  : ${new Date(report.created_at).toISOString()}`,
    `Type      : ${report.type}`,
    `Status    : ${report.status}`,
    `Version   : ${report.version}`,
    `OS        : ${report.os}${report.arch && !report.os.includes(report.arch) ? ` (${report.arch})` : ""}`,
    `.NET      : ${report.dotnet}`,
    `WebView2  : ${report.webview2}`,
    `Client    : ${report.client}`,
    `Unclean   : ${report.unclean_exit ? "yes" : "no"}`,
  ];
  if (report.contact) lines.push(`Contact   : ${report.contact}`);
  lines.push("", "--- summary ---", report.title, "", "--- what happened ---", report.body);
  if (report.steps) lines.push("", "--- steps to reproduce ---", report.steps);
  if (report.context) lines.push("", "--- context ---", report.context);
  if (report.last_fatal) lines.push("", "--- last fatal ---", report.last_fatal);
  if (log) lines.push("", "--- log ---", log);
  return lines.join("\n");
}

export type { D1 };
