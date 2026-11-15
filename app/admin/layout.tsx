import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { adminConfigured, adminTokenState, requireAdmin, type AdminTokenState } from "@/lib/inbox/admin-auth";
import "./admin.css";

/**
 * Shell for every admin page. The guard runs here, so an unauthenticated visitor
 * gets a 404 before any report data is queried.
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

  await requireAdmin();

  let tokenState: AdminTokenState | null = null;
  try {
    tokenState = await adminTokenState();
  } catch {
    tokenState = null;
  }

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
            {tokenState ? <TokenChip state={tokenState} /> : null}
            <form action="/admin/rotate" method="post">
              <button className="btn" type="submit">
                Rotate link
              </button>
            </form>
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

function TokenChip({ state }: { state: AdminTokenState }) {
  if (state.mode === "bootstrap") {
    return (
      <span className="chip chip-warn" title="Only the ADMIN_TOKEN environment value is in use.">
        unlock link: bootstrap
      </span>
    );
  }
  if (state.expired) {
    return (
      <span className="chip chip-danger" title="The current unlock link stopped working.">
        unlock link expired
      </span>
    );
  }
  return (
    <span className={state.daysLeft !== null && state.daysLeft <= 5 ? "chip chip-warn" : "chip"}>
      unlock link: {state.daysLeft ?? "?"} days left
    </span>
  );
}

function SetupNotice() {
  return (
    <div className="admin-root">
      <div className="admin-shell">
        <div className="setup">
          <h1>Inbox is not set up yet</h1>
          <p className="muted">
            The admin area fails closed until a database binding and an unlock token exist.
          </p>
          <ol>
            <li>
              Create the database: <code>npx wrangler d1 create portfolio-inbox</code>
            </li>
            <li>
              Put its <code>database_id</code> into <code>wrangler.jsonc</code>, then run the migration:{" "}
              <code>npx wrangler d1 migrations apply DB --remote</code>
            </li>
            <li>
              Set the bootstrap token: <code>npx wrangler secret put ADMIN_TOKEN</code>
            </li>
            <li>
              Open <code>/admin/unlock?k=&lt;that token&gt;</code> once, then rotate the link from the inbox header.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
