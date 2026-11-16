import { redirect } from "next/navigation";
import { readSession } from "@/lib/inbox/admin-auth";

/**
 * The only public page under /admin: the sign-in screen.
 *
 * Everything else 404s without a session, so this is the single door. It renders
 * without the inbox chrome (the layout steps aside when there is no session).
 */

export const dynamic = "force-dynamic";

export default async function AdminIndex() {
  if (await readSession()) redirect("/admin/reports");

  return (
    <div className="admin-root">
      <div className="admin-shell">
        <div className="setup">
          <h1>Inbox</h1>
          <p className="muted">Bug reports from the Sifu Moveset Editor. Sign in to read them.</p>
          <p>
            <a className="btn btn-accent" href="/api/admin/auth/start">
              Sign in with GitHub
            </a>
          </p>
          <p className="muted">
            Only the account listed in <code>ADMIN_GITHUB_ALLOW</code> is accepted. The session lasts a
            year, so this is a once-a-year click.
          </p>
        </div>
      </div>
    </div>
  );
}
