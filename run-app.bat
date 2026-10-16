@echo off
title DPDP Form Auditor — Swayambhu 2K26
color 0A

echo ======================================================================
echo    DPDP FORM AUDITOR — VIBE CODING 2K26 DEV SERVER
echo ======================================================================

set "PATH=C:\Users\Student\AppData\Local\Programs\nodejs;%PATH%"

where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js not found in portable path.
    pause
    exit /b
)

if not exist "node_modules" (
    echo [INFO] Installing dependencies...
    call npm install
)

echo.
echo Launching Vite Dev Server at http://localhost:5173/ ...
call npm run dev -- --host
pause
