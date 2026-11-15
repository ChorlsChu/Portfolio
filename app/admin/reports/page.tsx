import Link from "next/link";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/inbox/admin-auth";
import {
  PAGE_SIZE,
  listReports,
  normalizeStatus,
  normalizeType,
  statusCounts,
  todayCount,
} from "@/lib/inbox/queries";
import { purgeNow } from "../actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Inbox",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ReportsPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();

  const params = await searchParams;
  const status = normalizeStatus(first(params.status));
  const type = normalizeType(first(params.type));
  const q = (first(params.q) ?? "").trim();
  const page = Math.max(1, Number(first(params.page) ?? "1") || 1);

  const [{ rows, total }, counts, today] = await Promise.all([
    listReports({ status, type, q, page }),
    statusCounts(),
    todayCount(),
  ]);

  const allCount = Object.values(counts).reduce((sum, n) => sum + n, 0);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const purged = first(params.purged);
  const deleted = first(params.deleted);

  return (
    <>
      {purged ? <Banner>Purged {purged} report(s) older than the retention window.</Banner> : null}
      {deleted ? <Banner>Report deleted.</Banner> : null}

      <div className="filters">
        <Pill href={filterHref({ type, q })} active={!status} label="All" count={allCount} />
        <Pill
          href={filterHref({ status: "new", type, q })}
          active={status === "new"}
          label="New"
          count={counts.new ?? 0}
        />
        <Pill
          href={filterHref({ status: "open", type, q })}
          active={status === "open"}
          label="Open"
          count={counts.open ?? 0}
        />
        <Pill
          href={filterHref({ status: "fixed", type, q })}
          active={status === "fixed"}
          label="Fixed"
          count={counts.fixed ?? 0}
        />
        <Pill
          href={filterHref({ status: "spam", type, q })}
          active={status === "spam"}
          label="Spam"
          count={counts.spam ?? 0}
        />

        <span className="muted" style={{ marginLeft: "auto", fontSize: 12 }}>
          today {today} / 200
        </span>
      </div>

      <div className="filters">
        <form method="get" action="/admin/reports">
          <input type="search" name="q" defaultValue={q} placeholder="search title and text" />
          {status ? <input type="hidden" name="status" value={status} /> : null}
          <select name="type" defaultValue={type ?? ""} aria-label="Type">
            <option value="">any type</option>
            <option value="bug">bug</option>
            <option value="crash">crash</option>
            <option value="feature">feature</option>
          </select>
          <button className="btn btn-sm" type="submit">
            Filter
          </button>
          {q || type || status ? (
            <Link className="btn btn-sm" href="/admin/reports">
              Clear
            </Link>
          ) : null}
        </form>

        <form action={purgeNow} style={{ marginLeft: "auto" }}>
          <button className="btn btn-sm" type="submit">
            Purge older than 180 days
          </button>
        </form>
      </div>

      {rows.length === 0 ? (
        <p className="empty">No reports match. New ones will appear here.</p>
      ) : (
        <table className="reports">
          <thead>
            <tr>
              <th style={{ width: 18 }} />
              <th style={{ width: 86 }}>id</th>
              <th style={{ width: 74 }}>age</th>
              <th style={{ width: 88 }}>type</th>
              <th>summary</th>
              <th style={{ width: 70 }}>version</th>
              <th style={{ width: 78 }}>log</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.status === "new" ? <span className="dot" title="unread" /> : null}</td>
                <td className="mono">
                  <Link href={`/admin/reports/${row.id}`}>{row.id}</Link>
                </td>
                <td className="muted" title={new Date(row.created_at).toISOString()}>
                  {timeAgo(row.created_at)}
                </td>
                <td>
                  <span className={`badge badge-${row.type}`}>{row.type}</span>
                </td>
                <td>
                  <Link href={`/admin/reports/${row.id}`}>{row.title}</Link>
                  {row.unclean_exit ? <span className="muted"> &middot; unclean exit</span> : null}
                </td>
                <td className="muted mono">{shortVersion(row.version)}</td>
                <td className="muted mono">{row.log_bytes ? kilobytes(row.log_bytes) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {pages > 1 ? (
        <div className="form-row" style={{ marginTop: 18 }}>
          {page > 1 ? (
            <Link className="btn btn-sm" href={pageHref({ status, type, q, page: page - 1 })}>
              Previous
            </Link>
          ) : null}
          <span className="muted">
            page {page} of {pages} &middot; {total} report(s)
          </span>
          {page < pages ? (
            <Link className="btn btn-sm" href={pageHref({ status, type, q, page: page + 1 })}>
              Next
            </Link>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

function Banner({ children }: { children: React.ReactNode }) {
  return (
    <div className="card" style={{ padding: "10px 14px", fontSize: 13 }}>
      {children}
    </div>
  );
}

function Pill({
  href,
  active,
  label,
  count,
}: {
  href: string;
  active: boolean;
  label: string;
  count: number;
}) {
  return (
    <Link className={active ? "pill active" : "pill"} href={href}>
      {label}
      <span className="count">{count}</span>
    </Link>
  );
}

function filterHref(filters: { status?: string; type?: string; q?: string }): string {
  const search = new URLSearchParams();
  if (filters.status) search.set("status", filters.status);
  if (filters.type) search.set("type", filters.type);
  if (filters.q) search.set("q", filters.q);
  const qs = search.toString();
  return qs ? `/admin/reports?${qs}` : "/admin/reports";
}

function pageHref(filters: { status?: string; type?: string; q?: string; page: number }): string {
  const search = new URLSearchParams();
  if (filters.status) search.set("status", filters.status);
  if (filters.type) search.set("type", filters.type);
  if (filters.q) search.set("q", filters.q);
  if (filters.page > 1) search.set("page", String(filters.page));
  const qs = search.toString();
  return qs ? `/admin/reports?${qs}` : "/admin/reports";
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function shortVersion(version: string): string {
  if (!version) return "—";
  const [base, hash] = version.split("+");
  return hash ? `${base}+${hash.slice(0, 7)}` : base;
}

function kilobytes(bytes: number): string {
  return bytes >= 1024 ? `${Math.round(bytes / 1024)} KB` : `${bytes} B`;
}

function timeAgo(timestamp: number): string {
  const minutes = Math.floor((Date.now() - timestamp) / 60_000);
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d`;
  return new Date(timestamp).toISOString().slice(0, 10);
}
