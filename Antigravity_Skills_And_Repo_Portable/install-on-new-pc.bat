@echo off
setlocal EnableDelayedExpansion

title Antigravity Skills & Codebase Installer
color 0A

echo ======================================================================
echo    CINE GLACIER REPO ^& ANTIGRAVITY SKILLS - ONE-CLICK INSTALLER
echo ======================================================================
echo.
echo Target User Profile: %USERPROFILE%\.gemini
echo Current Script Dir:  %~dp0
echo.

:: 1. Check for Node.js
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    color 0C
    echo [WARNING] Node.js is not found in your PATH!
    echo Please install Node.js (v18+ or v20+) from https://nodejs.org/ to run the app.
    echo Press any key to continue installing the skills anyway...
    pause >nul
    color 0A
) else (
    for /f "tokens=*" %%i in ('node -v') do set NODE_VER=%%i
    echo [OK] Node.js detected: !NODE_VER!
)

echo.
echo ----------------------------------------------------------------------
echo [STEP 1/3] Restoring Antigravity Skills, Agents, Plugins ^& Configs...
echo ----------------------------------------------------------------------

set "DEST_GEMINI=%USERPROFILE%\.gemini"
set "DEST_CONFIG=%DEST_GEMINI%\config"
set "DEST_AGY=%DEST_GEMINI%\antigravity"

if not exist "%DEST_CONFIG%" mkdir "%DEST_CONFIG%"
if not exist "%DEST_AGY%\hooks" mkdir "%DEST_AGY%\hooks"

:: Copy config folder (skills, agents, plugins, sidecars, config.json)
if exist "%~dp0skills_and_configs\gemini_config" (
    echo [*] Copying Skills, Plugins, and Agents to %DEST_CONFIG%...
    robocopy "%~dp0skills_and_configs\gemini_config" "%DEST_CONFIG%" /E /R:1 /W:1 >nul
    echo [OK] 82+ Skills, Agents, and Plugins installed successfully!
)

:: Copy hooks
if exist "%~dp0skills_and_configs\antigravity_hooks" (
    echo [*] Copying Antigravity Hooks to %DEST_AGY%\hooks...
    robocopy "%~dp0skills_and_configs\antigravity_hooks" "%DEST_AGY%\hooks" /E /R:1 /W:1 >nul
    echo [OK] Antigravity hooks installed successfully!
)

:: Copy settings
if exist "%~dp0skills_and_configs\antigravity_settings\settings.json" (
    echo [*] Copying Antigravity Settings...
    copy /Y "%~dp0skills_and_configs\antigravity_settings\settings.json" "%DEST_AGY%\settings.json" >nul
    echo [OK] Settings file applied!
)

echo.
echo ----------------------------------------------------------------------
echo [STEP 2/3] Installing Ice-Cream Repository Dependencies...
echo ----------------------------------------------------------------------

if exist "%~dp0repo\package.json" (
    echo [*] Entering repo directory and running npm install...
    cd /d "%~dp0repo"
    call npm install
    if %ERRORLEVEL% equ 0 (
        echo [OK] npm install completed successfully!
    ) else (
        echo [!] npm install encountered an error. You can run it manually inside the repo folder.
    )
) else (
    echo [!] repo folder not found at %~dp0repo
)

echo.
echo ----------------------------------------------------------------------
echo [STEP 3/3] Installation Complete!
echo ----------------------------------------------------------------------
echo.
echo All 82+ Antigravity skills, plugins, agents, and configs are now active!
echo Your repository is ready to run.
echo.
echo Quick commands:
echo   To launch development server:  cd repo ^&^& npm run dev
echo   To build for production:       cd repo ^&^& npm run build
echo   To run via Docker container:   cd repo ^&^& docker compose up
echo.
echo ======================================================================
pause
