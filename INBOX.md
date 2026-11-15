# Bug report inbox

Endpoint for reports sent by the Sifu Moveset Editor's **Report a bug** dialog, plus a
password-style admin page for reading them.

- Intake: `POST /api/inbox/report` (JSON, no client auth - see *Abuse model*)
- Admin: `/admin/reports`, unlocked by a tokenised link (`/admin/unlock?k=...`)
- Storage: Cloudflare D1 binding `DB`, migration in `migrations/`
- Retention: 180 days, purged opportunistically as reports arrive

## Setup

`scripts/inbox-setup.ps1` does the whole thing, and is safe to re-run: with no
switches it only reports, and it never rotates unless asked.

```powershell
.\scripts\inbox-setup.ps1                  # status, changes nothing
.\scripts\inbox-setup.ps1 -Setup           # migrate the database, create ADMIN_TOKEN
.\scripts\inbox-setup.ps1 -Setup -Rotate   # ...then claim an unlock link, printed once
```

`-Rotate` refuses when a rotated link is already stored, because replacing it would
invalidate the link you saved. To replace one anyway - or to recover when the link is
lost - pass `-BreakGlass -Force`, followed by `-Token <ADMIN_TOKEN>` when the secret
value is not at hand.

The printed link is a one-time credential: it is shown once, stored only as a SHA-256,
and never written to disk unless you pass `-SaveLink <path>`.

## Deploying

Deployments come from Cloudflare's git integration on `main`, so a push is a deploy.
Only the first item below fails the build; the rest fail closed at runtime (the admin
area says "not set up" rather than opening).

1. **Create the database.** Cloudflare dashboard -> Storage & Databases -> D1 ->
   Create database -> `portfolio-inbox`. Copy the id it gives you.
2. **Paste that id into `wrangler.jsonc`**, replacing the placeholder. While the
   placeholder is present the build succeeds and the deploy fails with
   `binding DB of type d1 must have a valid database_id specified [code: 10021]`.
3. **Apply the migration** to the remote database. `-Setup` does this. By hand:
   - `npx wrangler d1 migrations apply DB --remote` (needs `npx wrangler login`), or
   - open the database in the dashboard -> Console and run the contents of
     `migrations/0001_inbox.sql`.

   The migration is idempotent, so re-running it is safe.
4. **Set the bootstrap token.** `wrangler secret put` takes the secret *name*; the
   value is supplied afterwards. When the shell has no terminal - a redirected or
   agent shell - the prompt aborts with "cannot be run in a non-interactive context",
   so pipe the value instead:

   ```powershell
   '<token>' | npx wrangler secret put ADMIN_TOKEN
   ```

   Or dashboard -> Workers & Pages -> `charlestiuportfolio` -> Settings -> Variables
   and Secrets -> add an encrypted `ADMIN_TOKEN` with a long random value. Then open
   `/admin/unlock?k=<that value>` once and immediately press **Rotate link** - from
   then on the rotated link supersedes the env value.

## Verifying a deployment

| Check | Expect |
| --- | --- |
| `GET /` | 200 - a 1101 or 500 here means the Worker itself is failing |
| `GET /api/inbox/report` | 405 - the route exists and wants POST |
| `GET /admin` before setup | 200 with "Inbox is not set up yet" |
| `GET /admin` after setup, no cookie | 404 |
| `GET /admin/unlock?k=<current>` | 303 to `/admin/reports` |
| `GET /admin/reports` with that cookie | 200, header chip shows link age |
| `npx wrangler secret list` | contains `ADMIN_TOKEN` (names only, never values) |
| `npx wrangler d1 execute DB --remote --command "SELECT name FROM sqlite_master WHERE type='table'"` | `reports`, `report_notes`, `rate_limits`, `settings` |

### Build command

Cloudflare runs `npx @opennextjs/cloudflare build` (configured in the dashboard, not in
`package.json`). The app is on Next.js 16, which OpenNext supports, so no flags are
needed. If a future Next upgrade lands outside its support window,
`@opennextjs/cloudflare` fails the build on purpose — upgrade rather than reaching for
`--dangerouslyUseUnsupportedNextVersion`.

## Unlocking and rotating

The credential is a 256-bit token in a URL. Only its SHA-256 is stored, so the link
cannot be recovered from a database dump - it is shown exactly once, when rotated.

| Setting | Key in `settings` | Meaning |
| --- | --- | --- |
| Rotated token hash | `admin_token_hash` | Set by **Rotate link**; supersedes `ADMIN_TOKEN` |
| Token expiry | `admin_token_expires_at` | 30 days; the header chip counts down |
| Session key | `admin_session_key` | HMAC key for the session cookie |
| IP salt | `ip_salt` | Salt for the hashed reporter IP |

The session cookie is `HMAC-SHA256(admin_session_key, "inbox-session-v1")`, scoped to
`/admin`, `HttpOnly`, `Secure`, `SameSite=Strict`. Because it uses a separate stable
key, rotating the unlock link does **not** sign the browser out.

**Break-glass** (lost link, or the 30-day expiry hit): delete the `admin_token_hash`
row and the `ADMIN_TOKEN` env value starts working again.

```sql
DELETE FROM settings WHERE key IN ('admin_token_hash', 'admin_token_expires_at');
```

## Abuse model

The app ships as an exe, so no key baked into it can be secret. Defence is server-side:

- three fixed-window counters per report: 5/day per client id, 20/day per hashed IP,
  200/day globally (counters live in `rate_limits` and expire);
- a hidden `website` field - a bot that fills it gets a fake success and writes nothing;
- hard caps: 1 MB request, 256K characters of log, 8K characters of body;
- only a salted truncated hash of the reporter IP is stored, never the address;
- the unlock route rate-limits attempts to 10/hour per IP and answers a wrong key with
  the same 404 as a route that does not exist.

## Local development

```bash
npx wrangler d1 migrations apply DB --local   # once
npx next dev -p 3123                          # .dev.vars supplies ADMIN_TOKEN
```

`npx opennextjs-cloudflare preview --port 8791` runs the real Worker in `workerd`,
which is the closest local analogue to production. The script targets that runtime
with `-Local`, for example:

```powershell
.\scripts\inbox-setup.ps1 -Local -Rotate -Token local-dev-only-token-do-not-ship
```

Two Windows notes: `-Local` defaults the site to `http://localhost:8791` because the
origin check compares hosts exactly, and only one preview may run at a time - two
`wrangler dev` sessions sharing `.wrangler\state` hang every request, including `/`.
Local D1 state also lives under `.wrangler\state` keyed by `database_id`, so changing
that id starts from an empty database.

The editor redacts before anything leaves the machine: `C:\Users\<name>` becomes
`<user>`, and the content/output roots become `<path>`.
