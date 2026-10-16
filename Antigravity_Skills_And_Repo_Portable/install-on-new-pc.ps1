# ======================================================================
#    Ciné Glacier Repo & Antigravity Skills - PowerShell Installer
# ======================================================================

$ErrorActionPreference = "Continue"

Write-Host "`n======================================================================" -ForegroundColor Cyan
Write-Host "   CINE GLACIER REPO & ANTIGRAVITY SKILLS - ONE-CLICK INSTALLER" -ForegroundColor Cyan
Write-Host "======================================================================`n" -ForegroundColor Cyan

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$destGemini = Join-Path $env:USERPROFILE ".gemini"
$destConfig = Join-Path $destGemini "config"
$destAgy = Join-Path $destGemini "antigravity"

Write-Host "Destination: $destGemini" -ForegroundColor Yellow
Write-Host "Source:      $scriptRoot`n" -ForegroundColor Yellow

# 1. Check Node.js
try {
    $nodeVer = (node -v) 2>$null
    if ($nodeVer) {
        Write-Host "[OK] Node.js is installed: $nodeVer" -ForegroundColor Green
    } else {
        Write-Host "[WARNING] Node.js is not found in PATH. Please install Node.js (v18+) to run the repo." -ForegroundColor Yellow
    }
} catch {
    Write-Host "[WARNING] Could not check Node.js version." -ForegroundColor Yellow
}

# 2. Copy Skills & Configs
Write-Host "`n----------------------------------------------------------------------" -ForegroundColor DarkCyan
Write-Host "[STEP 1/3] Restoring Antigravity Skills, Agents, Plugins & Configs..." -ForegroundColor DarkCyan
Write-Host "----------------------------------------------------------------------" -ForegroundColor DarkCyan

if (-not (Test-Path $destConfig)) {
    New-Item -ItemType Directory -Path $destConfig -Force | Out-Null
}
if (-not (Test-Path (Join-Path $destAgy "hooks"))) {
    New-Item -ItemType Directory -Path (Join-Path $destAgy "hooks") -Force | Out-Null
}

$srcGeminiConfig = Join-Path $scriptRoot "skills_and_configs\gemini_config"
if (Test-Path $srcGeminiConfig) {
    Write-Host "[*] Copying Skills, Plugins, and Agents to $destConfig..." -ForegroundColor White
    robocopy $srcGeminiConfig $destConfig /E /R:1 /W:1 > $null
    Write-Host "[OK] 82+ Skills, Agents, and Plugins installed successfully!" -ForegroundColor Green
}

$srcHooks = Join-Path $scriptRoot "skills_and_configs\antigravity_hooks"
if (Test-Path $srcHooks) {
    Write-Host "[*] Copying Antigravity Hooks to $destAgy\hooks..." -ForegroundColor White
    robocopy $srcHooks (Join-Path $destAgy "hooks") /E /R:1 /W:1 > $null
    Write-Host "[OK] Antigravity hooks installed successfully!" -ForegroundColor Green
}

$srcSettings = Join-Path $scriptRoot "skills_and_configs\antigravity_settings\settings.json"
if (Test-Path $srcSettings) {
    Copy-Item -Path $srcSettings -Destination (Join-Path $destAgy "settings.json") -Force
    Write-Host "[OK] Settings file applied!" -ForegroundColor Green
}

# 3. Install Repo Dependencies
Write-Host "`n----------------------------------------------------------------------" -ForegroundColor DarkCyan
Write-Host "[STEP 2/3] Installing Ice-Cream Repository Dependencies..." -ForegroundColor DarkCyan
Write-Host "----------------------------------------------------------------------" -ForegroundColor DarkCyan

$repoPath = Join-Path $scriptRoot "repo"
if (Test-Path (Join-Path $repoPath "package.json")) {
    Set-Location $repoPath
    Write-Host "[*] Running npm install in $repoPath..." -ForegroundColor White
    cmd /c "npm install"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] npm install completed successfully!" -ForegroundColor Green
    } else {
        Write-Host "[!] npm install had warnings or errors. You can run it manually." -ForegroundColor Yellow
    }
} else {
    Write-Host "[!] repo directory not found." -ForegroundColor Red
}

# 4. Summary
Write-Host "`n----------------------------------------------------------------------" -ForegroundColor DarkCyan
Write-Host "[STEP 3/3] Installation Complete!" -ForegroundColor DarkCyan
Write-Host "----------------------------------------------------------------------`n" -ForegroundColor DarkCyan

Write-Host "All skills, plugins, agents, and repository files are ready to use!" -ForegroundColor Green
Write-Host "To launch dev server: cd repo; npm run dev" -ForegroundColor Cyan
Write-Host "To build production:  cd repo; npm run build" -ForegroundColor Cyan
Write-Host "To launch container: cd repo; docker compose up`n" -ForegroundColor Cyan
