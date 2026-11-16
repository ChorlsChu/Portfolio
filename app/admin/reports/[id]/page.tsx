import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/inbox/admin-auth";
import { REPORT_STATUSES } from "@/lib/inbox/db";
import { getReport, listNotes } from "@/lib/inbox/queries";
import { removeReport, saveNote, updateStatus } from "../../actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Report",
  robots: { index: false, follow: false },
};

export default async function ReportPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdmin();

  const { id } = await params;
  const query = await searchParams;
  const report = await getReport(id);
  if (!report) notFound();

  // The log is only ever downloaded, never rendered: a 256K-character text blob in a
  // <pre> costs more to paint than it is worth, and the download routes serve it whole.
  const notes = await listNotes(id);

  // Comes back from the status action's redirect, so the confirmation is rendered by
  // an actual GET of the page rather than inferred from a mutation that may have been
  // dropped between D1 and the response.
  const rawUpdated = typeof query.updated === "string" ? query.updated : "";
  const updated = (REPORT_STATUSES as readonly string[]).includes(rawUpdated) ? rawUpdated : "";

  return (
    <>
      {updated ? (
        <div className="notice">
          Status updated to <strong>{updated}</strong>.
        </div>
      ) : null}

      <div className="detail-head">
        <div className="meta-line" style={{ marginBottom: 8 }}>
          <Link href="/admin/reports">← Inbox</Link>
        </div>
        <h1>{report.title}</h1>
        <div className="meta-line">
          <span className={`badge badge-${report.type}`}>{report.type}</span>
          <span className="mono">#{report.id}</span>
          <span>{new Date(report.created_at).toISOString().replace("T", " ").slice(0, 16)} UTC</span>
          {report.version ? <span className="mono">{report.version}</span> : null}
          {report.log_bytes ? <span>{kilobytes(report.log_bytes)} log</span> : null}
          <span className="muted">status: {report.status}</span>
        </div>
      </div>

      <div className="detail-grid">
        <div>
          <section className="card">
            <h2>What happened</h2>
            <div className="prose">{report.body}</div>
          </section>

          {report.steps ? (
            <section className="card">
              <h2>Steps to reproduce</h2>
              <div className="prose">{report.steps}</div>
            </section>
          ) : null}

          {report.context ? (
            <section className="card">
              <h2>Context</h2>
              <div className="prose">{report.context}</div>
            </section>
          ) : null}

          <section className="card">
            <h2>Error log{report.log_bytes ? ` · ${kilobytes(report.log_bytes)}` : ""}</h2>
            {report.log_bytes ? (
              <>
                <div className="form-row" style={{ marginTop: 0 }}>
                  <a className="btn btn-sm" href={`/admin/reports/${report.id}/log`}>
                    Download .log
                  </a>
                  <a className="btn btn-sm" href={`/admin/reports/${report.id}/export`}>
                    Download report .txt
                  </a>
                  <a className="btn btn-sm btn-accent" href={`/admin/reports/${report.id}/zip`}>
                    Download all .zip
                  </a>
                </div>
                <p className="muted" style={{ fontSize: 12, marginTop: 10 }}>
                  The app sends every log file merged into one stream, each one headed with{" "}
                  <span className="mono">----- name -----</span>. The .zip splits them back into
                  separate files and adds the report as text.
                </p>
              </>
            ) : (
              <>
                <p className="muted">This report has no attached log.</p>
                <div className="form-row" style={{ marginTop: 0 }}>
                  <a className="btn btn-sm" href={`/admin/reports/${report.id}/export`}>
                    Download report .txt
                  </a>
                </div>
              </>
            )}
          </section>
        </div>

        <div>
          <section className="card">
            <h2>Environment</h2>
            <dl className="kv">
              <dt>Version</dt>
              <dd className="mono">{report.version || "—"}</dd>
              <dt>OS</dt>
              <dd>
                {report.os || "—"}
                {report.arch && !report.os.includes(report.arch) ? ` (${report.arch})` : ""}
              </dd>
              <dt>.NET</dt>
              <dd>{report.dotnet || "—"}</dd>
              <dt>WebView2</dt>
              <dd>{report.webview2 || "—"}</dd>
              <dt>Client</dt>
              <dd className="mono">{report.client ? report.client.slice(0, 12) : "—"}</dd>
              {report.country ? (
                <>
                  <dt>Country</dt>
                  <dd>{report.country}</dd>
                </>
              ) : null}
              {report.contact ? (
                <>
                  <dt>Contact</dt>
                  <dd>{report.contact}</dd>
                </>
              ) : null}
            </dl>
            {report.unclean_exit ? <div className="callout">Reported from a session that did not shut down cleanly.</div> : null}
            {report.last_fatal ? (
              <div className="callout">
                <strong>Last fatal:</strong> <span className="mono">{report.last_fatal}</span>
              </div>
            ) : null}
          </section>

          <section className="card" id="status">
            <h2>Status</h2>
            <form action={updateStatus} className="form-row" style={{ marginTop: 0 }}>
              <input type="hidden" name="id" value={report.id} />
              {/* key: without it React reuses the <select> DOM node, so a value the
                  browser restored (or a bfcache hit) can outlive the server-rendered
                  one and the control shows a status the database no longer has. */}
              <select key={report.status} name="status" defaultValue={report.status} aria-label="Status">
                {REPORT_STATUSES.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
              <button className="btn btn-accent btn-sm" type="submit">
                Update
              </button>
            </form>
          </section>

          <section className="card" id="notes">
            <h2>Notes</h2>
            {notes.length === 0 ? <p className="muted" style={{ fontSize: 12 }}>No notes yet.</p> : null}
            {notes.map((note) => (
              <div className="note-item" key={note.id}>
                <time>{new Date(note.created_at).toISOString().slice(0, 16).replace("T", " ")}</time>
                <div className="prose">{note.body}</div>
              </div>
            ))}
            <form action={saveNote} style={{ marginTop: 12 }}>
              <input type="hidden" name="id" value={report.id} />
              <textarea name="body" rows={3} placeholder="Reproduced on 1.3, fixed in 1.4…" style={{ width: "100%" }} />
              <div className="form-row">
                <button className="btn btn-sm" type="submit">
                  Add note
                </button>
              </div>
            </form>
          </section>

          <section className="card">
            <details>
              <summary className="muted" style={{ cursor: "pointer", fontSize: 12 }}>
                Delete this report…
              </summary>
              <form action={removeReport} style={{ marginTop: 10 }}>
                <input type="hidden" name="id" value={report.id} />
                <button className="btn btn-danger btn-sm" type="submit">
                  Delete permanently
                </button>
              </form>
            </details>
          </section>
        </div>
      </div>
    </>
  );
}

function kilobytes(bytes: number): string {
  return bytes >= 1024 ? `${Math.round(bytes / 1024)} KB` : `${bytes} B`;
}
