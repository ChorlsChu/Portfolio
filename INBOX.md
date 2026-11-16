# Bug report inbox

The endpoint the Sifu Moveset Editor posts to, plus a GitHub-gated admin page for
reading the reports.

| | URL |
| --- | --- |
| Report intake | `https://charlestiudev.qzz.io/api/inbox/report` |
| Inbox | `https://charlestiudev.qzz.io/admin/reports` |
| OAuth callback (register this on the GitHub app) | `https://charlestiudev.qzz.io/api/admin/auth/callback` |

## Signing in

Open `/admin` and press **Sign in with GitHub**. Only the account listed in
`ADMIN_GITHUB_ALLOW` is accepted; everyone else gets a 404, as does every inbox page
without a session.

The session lasts a year, so this is a once-a-year click. There is no password, no
unlock link and no expiry ritual - the credential is your GitHub account, which is
also the recovery path: **there is nothing to reset, you just sign in again**.

## Configuration

Workers & Pages -> `charlestiuportfolio` -> Settings -> Variables and Secrets:

| Name | Type | Value |
| --- | --- | --- |
| `GITHUB_CLIENT_ID` | text | from the GitHub OAuth app |
| `GITHUB_CLIENT_SECRET` | secret | from the GitHub OAuth app |
| `ADMIN_GITHUB_ALLOW` | text | your GitHub login or numeric id (comma-separated for more) |

The OAuth app lives at GitHub -> Settings -> Developer settings -> OAuth Apps, with
the callback URL above and the site root as its homepage. Registering it needs no
command line and no payment method.

`ADMIN_GITHUB_ALLOW` takes either form - the handle is what you know, the numeric id
survives a rename - and comparison is case-insensitive. If any of the three is
missing the admin area fails closed: it shows a setup notice instead of a login form.

Pushes to `main` deploy through Cloudflare's git integration; the build command
`npx @opennextjs/cloudflare build` is configured in the dashboard, not here.

## Verifying

| Check | Expect |
| --- | --- |
| `GET /` | 200 |
| `GET /admin` | 200 with the sign-in button |
| `GET /admin/reports` without a session | 404 |
| `GET /api/inbox/report` | 405 - the route exists and wants POST |
| `POST /api/inbox/report` with a malformed body | 400, not 500 |
| After signing in | 200 list, your login in the header, sign-out button |
| `POST /admin/logout` | 303, and `/admin/reports` 404s again |
| `settings` table | `admin_session_key`, `ip_salt` |

## Locked out?

Sign in again - that is the whole recovery. If GitHub signs you in and you still get
a 404, `ADMIN_GITHUB_ALLOW` does not match that account; fix the variable and the next
deploy picks it up.

To sign every browser out at once, delete the session key. The next request mints a
new one, so cookies already issued stop verifying:

```sql
DELETE FROM settings WHERE key = 'admin_session_key';
```

The session cookie is `login.issuedAt.HMAC-SHA256(admin_session_key,
"inbox-session-v2:<login>:<issuedAt>")`, scoped to `/admin`, `HttpOnly`, `Secure`,
`SameSite=Strict`. The timestamp is signed, so it cannot be edited to extend a login;
365 days after issuance the cookie is refused even if the browser kept it.

## Local development

```bash
npx wrangler d1 migrations apply DB --local
npx next dev -p 3123
```

Add the three variables to `.dev.vars` (gitignored). GitHub allows one callback per
OAuth app, so local sign-in needs a second app pointed at
`http://localhost:3123/api/admin/auth/callback` - or `http://localhost:8791` when
running `npx opennextjs-cloudflare preview`, which is the real Worker in `workerd`.

To exercise the flow without GitHub at all, point `GITHUB_OAUTH_BASE` and
`GITHUB_API_BASE` at a local stand-in that answers `POST /login/oauth/access_token`
and `GET /user`. Both are unset in production.

Two Windows notes: the origin check compares hosts exactly, so browse `localhost`
rather than `127.0.0.1` when posting forms, and only one preview may run at a time -
two `wrangler dev` sessions sharing `.wrangler\state` hang every request.

## Intake

`POST /api/inbox/report`, JSON, no client auth - the app ships as an exe, so nothing
baked into it can be secret. Defence is server-side:

- three fixed-window counters per report: 5/day per client id, 20/day per hashed IP,
  200/day globally;
- a hidden `website` field - a bot that fills it gets a fake success and writes
  nothing;
- caps: 1 MB request, 256K characters of log, 8K characters of body;
- only a salted truncated hash of the reporter IP is stored, never the address;
- retention 180 days, purged opportunistically as reports arrive.

The editor redacts before anything leaves the machine: `C:\Users\<name>` becomes
`<user>`, and the content/output roots become `<path>`.
