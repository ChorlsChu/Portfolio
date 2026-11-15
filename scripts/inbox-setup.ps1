<#
.SYNOPSIS
    Set up, verify, and re-key the bug report inbox on Cloudflare.

.DESCRIPTION
    The inbox needs three things that live outside the repo: a migrated D1
    database, an ADMIN_TOKEN secret, and (optionally) a rotated unlock link.
    This script checks all three, and can create them.

    With no switches it only reports. Nothing is changed, nothing is rotated.

    The unlock link is a one-time credential. This script prints it once and
    never writes it anywhere unless you pass -SaveLink.

.PARAMETER Setup
    Apply the D1 migration and create ADMIN_TOKEN if it is missing.

.PARAMETER Rotate
    Exchange the bootstrap token for a rotated unlock link and print it once.
    Refuses when a rotated link is already live, because that would invalidate
    the link you saved last time.

.PARAMETER BreakGlass
    Delete the stored rotated token so ADMIN_TOKEN works again (the recovery
    path in INBOX.md). Requires -Force. Immediately follow it with -Rotate.

.PARAMETER Force
    Allow -Setup to replace an existing ADMIN_TOKEN secret, and allow
    -BreakGlass to delete a live link.

.PARAMETER Local
    Target the local D1 database and http://localhost:8791 instead of
    production. The bootstrap token then comes from .dev.vars, so -Setup skips
    the secret and -Rotate needs -Token.

.PARAMETER Site
    Base URL. Defaults to https://charlestiudev.qzz.io (or localhost with -Local).

.PARAMETER Token
    Supply the current bootstrap token instead of generating one. Useful with
    -Rotate on its own, and required for -Local.

.PARAMETER SaveLink
    Write the rotated link to this path. Plaintext - only use somewhere private.

.EXAMPLE
    .\scripts\inbox-setup.ps1

    Report what is missing. Read-only.

.EXAMPLE
    .\scripts\inbox-setup.ps1 -Setup -Rotate

    Migrate, set ADMIN_TOKEN, claim the unlock link, and print it once.

.EXAMPLE
    .\scripts\inbox-setup.ps1 -BreakGlass -Force -Rotate -Token $t

    Lost the link: clear the stored hash, unlock with $t, rotate a new link.
#>

[CmdletBinding()]
param(
    [switch]$Setup,
    [switch]$Rotate,
    [switch]$BreakGlass,
    [switch]$Force,
    [switch]$Local,
    [string]$Site,
    [string]$Token,
    [string]$SaveLink
)

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

$repo = Split-Path -Parent $PSScriptRoot
$configPath = Join-Path $repo 'wrangler.jsonc'

if (-not $Site) {
    $Site = if ($Local) { 'http://localhost:8791' } else { 'https://charlestiudev.qzz.io' }
}
$Site = $Site.TrimEnd('/')

$REQUIRED_TABLES = @('rate_limits', 'report_notes', 'reports', 'settings')

function Write-Head([string]$Text) {
    Write-Host ''
    Write-Host $Text -ForegroundColor Cyan
}

function Write-Ok([string]$Text) {
    Write-Host ('  ok    ' + $Text) -ForegroundColor Green
}

function Write-Warn([string]$Text) {
    Write-Host ('  warn  ' + $Text) -ForegroundColor Yellow
}

function Write-Bad([string]$Text) {
    Write-Host ('  fail  ' + $Text) -ForegroundColor Red
}

function Stop-Fail([string]$Text) {
    Write-Bad $Text
    Write-Host ''
    exit 1
}

# PowerShell wraps a native command's stderr in its own ErrorRecord block
# ("node.exe : <message>", "At <script>:210 char:19", "+ CategoryInfo", ...).
# Strip the wrapper so failures print as one readable line.
function ConvertFrom-NativeStderr {
    param([string]$Text)

    if (-not $Text) { return '' }
    $kept = @()
    foreach ($line in ($Text -split "`r?`n")) {
        if ($line -match '^\s*\+') { continue }
        if ($line -match '^At .*:\d+ char:\d+') { continue }
        $kept += $line
    }
    $clean = ($kept -join "`n").Trim()
    $clean = [regex]::Replace($clean, '(?m)^(?:node|curl|npx)\.exe : ', '')
    return $clean
}

function Invoke-Wrangler {
    param(
        [Parameter(Mandatory = $true)][string[]]$Arguments,
        [string]$StdinText
    )

    # Keep stdout and stderr apart: wrangler prints banners and warnings, and
    # merging them would corrupt the JSON lifted out below. stderr is only
    # appended when the command actually fails.
    $errFile = [IO.Path]::GetTempFileName()
    $previous = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    try {
        if ($PSBoundParameters.ContainsKey('StdinText') -and $StdinText) {
            # Piped, so wrangler reads the value from stdin instead of prompting.
            # The prompt path aborts with "cannot be run in a non-interactive
            # context" when the shell has no TTY, which a redirected or agent
            # shell always is.
            $stdout = $StdinText | & npx wrangler @Arguments 2> $errFile
        }
        else {
            $stdout = & npx wrangler @Arguments 2> $errFile
        }
        $code = $LASTEXITCODE
        $stderr = if (Test-Path $errFile) { ConvertFrom-NativeStderr (Get-Content $errFile -Raw) } else { '' }
    }
    finally {
        $ErrorActionPreference = $previous
        if (Test-Path $errFile) { Remove-Item $errFile -Force -ErrorAction SilentlyContinue }
    }

    $text = $stdout | Out-String
    if ($code -ne 0 -and $stderr) { $text = $text + "`n" + $stderr }

    [pscustomobject]@{
        Output = $text
        Code   = $code
    }
}

# wrangler prints a banner and log hints around its JSON, so lift the array out.
function ConvertFrom-WranglerJson {
    param([string]$Text)

    $match = [regex]::Match($Text, '\[[\s\S]*\]')
    if (-not $match.Success) { return @() }
    try { return @($match.Value | ConvertFrom-Json) }
    catch { return @() }
}

function Invoke-D1 {
    param([string]$Sql)

    $d1Args = @('d1', 'execute', 'DB')
    $d1Args += if ($Local) { @('--local') } else { @('--remote') }
    $d1Args += @('--command', $Sql, '--json')

    $result = Invoke-Wrangler -Arguments $d1Args
    if ($result.Code -ne 0) {
        throw "d1 execute failed: $($result.Output.Trim())"
    }

    $parsed = ConvertFrom-WranglerJson $result.Output
    if ($parsed.Count -eq 0) {
        throw "d1 execute returned no JSON: $($result.Output.Trim())"
    }
    return $parsed[0].results
}

function Get-ConfigValue {
    param([string]$Text, [string]$Key)

    $match = [regex]::Match($Text, '"' + [regex]::Escape($Key) + '"\s*:\s*"([^"]*)"')
    if ($match.Success) { return $match.Groups[1].Value }
    return ''
}

function Get-SecretNames {
    $result = Invoke-Wrangler -Arguments @('secret', 'list')
    if ($result.Code -ne 0) { return @() }
    $parsed = ConvertFrom-WranglerJson $result.Output
    return @($parsed | ForEach-Object { $_.name })
}

function New-UnlockToken {
    $bytes = New-Object 'byte[]' 32
    $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
    try { $rng.GetBytes($bytes) } finally { $rng.Dispose() }
    return ([Convert]::ToBase64String($bytes)).Replace('+', '-').Replace('/', '_').TrimEnd('=')
}

function Invoke-Curl {
    param([string[]]$Arguments)

    # Same split as Invoke-Wrangler: a refused connection must come back as an
    # exit code plus a short reason, not a NativeCommandError that kills the run.
    $errFile = [IO.Path]::GetTempFileName()
    $previous = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    try {
        $stdout = & curl.exe @Arguments 2> $errFile
        $code = $LASTEXITCODE
        $stderr = if (Test-Path $errFile) { (ConvertFrom-NativeStderr (Get-Content $errFile -Raw)) -replace '\s+', ' ' } else { '' }
    }
    finally {
        $ErrorActionPreference = $previous
        if (Test-Path $errFile) { Remove-Item $errFile -Force -ErrorAction SilentlyContinue }
    }

    [pscustomobject]@{
        Output = ($stdout | Out-String)
        Error  = $stderr.Trim()
        Code   = $code
    }
}

function Request-Unlock {
    param(
        [Parameter(Mandatory = $true)][string]$Key,
        [Parameter(Mandatory = $true)][string]$Jar
    )

    $url = "$Site/admin/unlock?k=$Key"
    $result = Invoke-Curl -Arguments @(
        '-sS', '-o', 'NUL', '-w', '%{http_code}', '--max-time', '30', '-c', $Jar, $url
    )
    if ($result.Code -ne 0) {
        $why = if ($result.Error) { $result.Error } else { "curl exit $($result.Code)" }
        return "ERR $why"
    }
    return $result.Output.Trim()
}

# ---------------------------------------------------------------- preflight --

if (-not (Test-Path $configPath)) {
    Stop-Fail "wrangler.jsonc not found; run this from the portfolio repo ($configPath)."
}
if (-not (Get-Command curl.exe -ErrorAction SilentlyContinue)) {
    Stop-Fail 'curl.exe not found. It ships with Windows 10 and later.'
}

$config = Get-Content $configPath -Raw
$workerName = Get-ConfigValue -Text $config -Key 'name'
$databaseId = Get-ConfigValue -Text $config -Key 'database_id'

if (-not $workerName) { Stop-Fail 'No worker "name" in wrangler.jsonc.' }
if ($databaseId -notmatch '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$') {
    Stop-Fail "wrangler.jsonc has no real database_id (found '$databaseId'). The deploy will fail."
}

$authNote = 'skipped (-Local)'
if (-not $Local) {
    $who = Invoke-Wrangler -Arguments @('whoami')
    if ($who.Output -notmatch 'You are logged in') {
        Stop-Fail 'Not signed in. Run: npx wrangler login'
    }
    $email = ([regex]::Match($who.Output, 'associated with the email ([^\s\r\n]+)').Groups[1].Value).TrimEnd('.')
    $authNote = if ($email) { "signed in as $email" } else { 'signed in' }
}

# ------------------------------------------------------------------- status --

Write-Head 'Inbox status'

$tables = @()
$schemaNote = 'query failed'
try {
    $rows = Invoke-D1 -Sql "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
    $tables = @($rows | ForEach-Object { $_.name })
    $missing = @($REQUIRED_TABLES | Where-Object { $tables -notcontains $_ })
    $schemaNote = if ($missing.Count -eq 0) { 'complete' } else { 'missing: ' + ($missing -join ', ') }
}
catch {
    $schemaNote = 'unreachable (' + $_.Exception.Message.Split("`n")[0] + ')'
}

$secretNames = @()
if (-not $Local) { $secretNames = Get-SecretNames }
$hasSecret = $secretNames -contains 'ADMIN_TOKEN'

$tokenHash = $null
$tokenExpiry = $null
if ($tables -contains 'settings') {
    try {
        $rows = Invoke-D1 -Sql "SELECT key, value FROM settings WHERE key IN ('admin_token_hash','admin_token_expires_at')"
        foreach ($row in $rows) {
            if ($row.key -eq 'admin_token_hash') { $tokenHash = $row.value }
            if ($row.key -eq 'admin_token_expires_at') { $tokenExpiry = $row.value }
        }
    }
    catch { }
}

$linkNote = 'none'
if ($tokenHash) {
    if ($tokenExpiry -and [int64]$tokenExpiry -le [int64]([DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds())) {
        $linkNote = 'expired - use -BreakGlass -Force -Rotate'
    }
    else {
        $days = if ($tokenExpiry) {
            [Math]::Max(0, [Math]::Ceiling(([int64]$tokenExpiry - [int64]([DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds())) / 86400000))
        } else { '?' }
        $linkNote = "rotated, $days days left"
    }
}
elseif ($hasSecret) { $linkNote = 'bootstrap (ADMIN_TOKEN only)' }

Write-Host ('  worker    ' + $workerName)
Write-Host ('  database  portfolio-inbox ' + $databaseId)
Write-Host ('  site      ' + $Site)
Write-Host ('  auth      ' + $authNote)
Write-Host ('  schema    ' + $schemaNote)
Write-Host ('  secret    ' + $(if ($Local) { 'skipped (-Local; .dev.vars)' } elseif ($hasSecret) { 'ADMIN_TOKEN present' } else { 'ADMIN_TOKEN missing' }))
Write-Host ('  unlock    ' + $linkNote)

if (-not ($Setup -or $Rotate -or $BreakGlass)) {
    Write-Head 'Nothing changed'
    Write-Host '  -Setup              migrate the database and create ADMIN_TOKEN'
    Write-Host '  -Setup -Rotate      ...then claim an unlock link and print it once'
    Write-Host '  -BreakGlass -Force  delete the stored link so -Token works again'
    Write-Host '  -SaveLink <path>    also write the printed link to a file'
    Write-Host ''
    exit 0
}

$schemaOk = $schemaNote -eq 'complete'
if (-not $schemaOk) {
    Write-Warn "Schema is not complete ($schemaNote)."
}

# --------------------------------------------------------------- break glass --

if ($BreakGlass) {
    if (-not $Force) {
        Stop-Fail '-BreakGlass deletes the live unlock link. Re-run with -Force if that is what you want.'
    }
    if (-not $schemaOk) {
        Stop-Fail 'Cannot break glass without the settings table.'
    }
    Write-Head 'Break glass'
    Invoke-D1 -Sql "DELETE FROM settings WHERE key IN ('admin_token_hash','admin_token_expires_at')" | Out-Null
    Write-Ok 'stored link deleted; ADMIN_TOKEN is authoritative again'
    $tokenHash = $null
    $linkNote = 'bootstrap'
}

# --------------------------------------------------------------------- setup --

if ($Setup) {
    Write-Head 'Setup'

    if ($Local) {
        $migrate = Invoke-Wrangler -Arguments @('d1', 'migrations', 'apply', 'DB', '--local')
    }
    else {
        $migrate = Invoke-Wrangler -Arguments @('d1', 'migrations', 'apply', 'DB', '--remote')
    }
    if ($migrate.Code -ne 0) {
        Stop-Fail "Migration failed:`n$($migrate.Output.Trim())"
    }
    Write-Ok 'migration applied (idempotent)'

    if ($Local) {
        Write-Warn 'local mode: ADMIN_TOKEN comes from .dev.vars, secret left alone'
        if (-not $Token) { $Token = 'local-dev-only-token-do-not-ship' }
    }
    else {
        if ($hasSecret -and -not $Force) {
            Write-Ok 'ADMIN_TOKEN already present; use -Force to replace it'
            if (-not $Token) {
                Write-Warn 'its value is not readable, so -Rotate needs -Token <value>'
            }
        }
        else {
            if (-not $Token) { $Token = New-UnlockToken }
            $put = Invoke-Wrangler -Arguments @('secret', 'put', 'ADMIN_TOKEN') -StdinText $Token
            if ($put.Code -ne 0) {
                Stop-Fail "Setting the secret failed:`n$($put.Output.Trim())"
            }
            Write-Ok 'ADMIN_TOKEN set (value never printed)'
        }
    }
}

# -------------------------------------------------------------------- rotate --

if ($Rotate) {
    Write-Head 'Rotate'

    if (-not $schemaOk) {
        Stop-Fail 'Cannot rotate without the settings table. Run -Setup first.'
    }
    if ($tokenHash) {
        Stop-Fail 'A rotated link is already live. Use the saved link, or -BreakGlass -Force -Rotate to replace it.'
    }
    if (-not $Token) {
        Stop-Fail 'No token to unlock with. Use -Setup -Rotate, or pass -Token <current ADMIN_TOKEN>.'
    }

    $jar = [IO.Path]::GetTempFileName()
    $page = [IO.Path]::GetTempFileName()
    $jar2 = [IO.Path]::GetTempFileName()
    try {
        $code = Request-Unlock -Key $Token -Jar $jar
        if ($code -notmatch '^\d{3}$') {
            Stop-Fail "Could not reach $Site ($code). With -Local, start the preview first."
        }
        switch ($code) {
            '303' { Write-Ok 'unlocked with the bootstrap token' }
            '503' { Stop-Fail 'Admin area is not configured: migration or ADMIN_TOKEN missing.' }
            '429' { Stop-Fail 'Rate limited: 10 unlock attempts per hour. Wait and retry.' }
            '404' { Stop-Fail 'That token is not current (rotate or break glass first).' }
            default { Stop-Fail "Unexpected unlock response: HTTP $code" }
        }

        $post = Invoke-Curl -Arguments @(
            '-sS', '-b', $jar, '-X', 'POST', '-H', "Origin: $Site",
            '-o', $page, '-w', '%{http_code}', '--max-time', '30', "$Site/admin/rotate"
        )
        $postCode = $post.Output.Trim()
        if ($postCode -eq '403') {
            Stop-Fail "Rotate rejected the origin. -Site must match the host exactly (got $Site)."
        }
        if ($postCode -ne '200') {
            Stop-Fail "Rotate failed: HTTP $postCode"
        }

        $html = Get-Content $page -Raw
        $link = [regex]::Match($html, 'value="([^"]*admin/unlock\?k=[^"]*)"').Groups[1].Value
        if (-not $link) {
            Stop-Fail 'Rotate succeeded but the page contained no link; check /admin/reports by hand.'
        }
        Write-Ok 'new link issued'

        # The old token must be dead now, and the new link must work.
        if ((Request-Unlock -Key $Token -Jar $jar) -ne '404') {
            Write-Warn 'old bootstrap token still accepted; expected it to be retired'
        }
        $newKey = [regex]::Match($link, 'k=([^&]+)').Groups[1].Value
        if ((Request-Unlock -Key $newKey -Jar $jar2) -ne '303') {
            Stop-Fail 'New link did not unlock; do not save it.'
        }
        Write-Ok 'new link unlocks, old token rejected'

        Write-Head 'Save this now - it is not shown again'
        Write-Host ''
        Write-Host ('  ' + $link) -ForegroundColor White
        Write-Host ''
        if ($SaveLink) {
            Set-Content -Path $SaveLink -Value $link -NoNewline -Encoding ascii
            Write-Warn "written to $SaveLink (plaintext; move it into a password manager)"
        }
        else {
            Write-Host ('  Inbox: ' + $Site + '/admin/reports')
        }
    }
    finally {
        foreach ($path in @($jar, $page, $jar2)) {
            if ($path -and (Test-Path $path)) { Remove-Item $path -Force -ErrorAction SilentlyContinue }
        }
    }
}

Write-Host ''
exit 0
