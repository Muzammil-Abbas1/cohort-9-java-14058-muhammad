# One-command dev launcher.
# Loads your local secrets (set-env.local.ps1, gitignored) into this
# PowerShell process, then runs the backend -- avoids relying on
# persistent Windows/VS Code environment variables, which don't always
# reach a freshly-opened terminal reliably.

$ErrorActionPreference = "Stop"

$envFile = Join-Path $PSScriptRoot "set-env.local.ps1"

if (-not (Test-Path $envFile)) {
    Write-Error "Missing $envFile -- copy set-env.local.ps1.example to set-env.local.ps1 and fill in your values."
    exit 1
}

try {
    . $envFile
} catch {
    Write-Error "Failed to load $envFile -- $_"
    exit 1
}

& "$PSScriptRoot\mvnw.cmd" spring-boot:run
exit $LASTEXITCODE
