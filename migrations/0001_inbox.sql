-- Sifu Moveset Editor bug inbox.
--
-- Design notes that matter later:
--  * log_gz is base64(gzip(text)), not a BLOB column: D1's BLOB round-trip is
--    needlessly fiddly, and the 33% base64 overhead on ~26 KB is irrelevant.
--  * ip_hash is a salted SHA-256 of the reporter's address. The raw IP is never
--    stored, so a database leak does not expose where reports came from.
--  * rate_limits rows expire; nothing here is a permanent counter.

CREATE TABLE IF NOT EXISTS reports (
  id            TEXT PRIMARY KEY,
  created_at    INTEGER NOT NULL,
  type          TEXT NOT NULL DEFAULT 'bug',
  status        TEXT NOT NULL DEFAULT 'new',
  title         TEXT NOT NULL,
  body          TEXT NOT NULL,
  steps         TEXT NOT NULL DEFAULT '',
  contact       TEXT NOT NULL DEFAULT '',
  version       TEXT NOT NULL DEFAULT '',
  os            TEXT NOT NULL DEFAULT '',
  arch          TEXT NOT NULL DEFAULT '',
  dotnet        TEXT NOT NULL DEFAULT '',
  webview2      TEXT NOT NULL DEFAULT '',
  client        TEXT NOT NULL DEFAULT '',
  country       TEXT NOT NULL DEFAULT '',
  unclean_exit  INTEGER NOT NULL DEFAULT 0,
  context       TEXT NOT NULL DEFAULT '',
  last_fatal    TEXT NOT NULL DEFAULT '',
  log_gz        TEXT NOT NULL DEFAULT '',
  log_bytes     INTEGER NOT NULL DEFAULT 0,
  ip_hash       TEXT NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS reports_created_idx ON reports (created_at DESC);
CREATE INDEX IF NOT EXISTS reports_status_idx ON reports (status, created_at DESC);

CREATE TABLE IF NOT EXISTS report_notes (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  report_id  TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  body       TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS report_notes_report_idx ON report_notes (report_id, created_at);

CREATE TABLE IF NOT EXISTS rate_limits (
  bucket     TEXT PRIMARY KEY,
  count      INTEGER NOT NULL DEFAULT 0,
  expires_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS rate_limits_expiry_idx ON rate_limits (expires_at);

-- Admin token hash, session key, IP salt, token expiry. Values are never
-- returned to a browser; the token itself is only shown once, at rotation.
CREATE TABLE IF NOT EXISTS settings (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);
