import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { adminConfigured, readSession } from "@/lib/inbox/admin-auth";
import "./admin.css";

/**
 * Shell for every admin page.
 *
 * The guard itself lives in the pages and route handlers (`requireAdmin` /
 * `adminGate`), so an unauthenticated visitor gets a 404 before any report data is
 * queried. This layout only decides whether to draw the signed-in chrome: when
 * there is no session it steps aside, which is what lets `/admin` render the
 * sign-in page instead of a 404.
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Inbox",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  // Never let a database error turn into an open page: only a positive "yes,
  // this deployment is configured" continues past this point.
  let configured = false;
  try {
    configured = await adminConfigured();
  } catch {
    configured = false;
  }

  if (!configured) return <SetupNotice />;

  const session = await readSession();
  if (!session) return <>{children}</>;

  return (
    <div className="admin-root">
      <div className="admin-shell">
        <header className="admin-top">
          <div>
            <Link href="/admin/reports" className="admin-brand">
              Inbox
            </Link>
            <div className="admin-sub">Sifu Moveset Editor &middot; bug reports</div>
          </div>
          <div className="admin-actions">
            <span className="chip" title="Signed in with GitHub">
              {session.login}
            </span>
            <form action="/admin/logout" method="post">
              <button className="btn" type="submit">
                Sign out
              </button>
            </form>
            <Link href="/" className="btn">
              Site
            </Link>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}

function SetupNotice() {
  return (
    <div className="admin-root">
      <div className="admin-shell">
        <div className="setup">
          <h1>Inbox is not set up yet</h1>
          <p className="muted">
            The admin area fails closed until the database binding and the sign-in variables exist.
          </p>
          <ol>
            <li>
              Create the D1 database and put its <code>database_id</code> into <code>wrangler.jsonc</code>, then
              run the migration: <code>npx wrangler d1 migrations apply DB --remote</code>
            </li>
            <li>
              Register a GitHub OAuth app with the callback{" "}
              <code>https://charlestiudev.qzz.io/api/admin/auth/callback</code>
            </li>
            <li>
              Add three Worker variables: <code>GITHUB_CLIENT_ID</code>,{" "}
              <code>GITHUB_CLIENT_SECRET</code> (secret) and <code>ADMIN_GITHUB_ALLOW</code>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
