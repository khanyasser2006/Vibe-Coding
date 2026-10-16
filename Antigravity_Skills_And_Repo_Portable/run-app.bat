@echo off
title Running Ciné Haute Glacerie
color 0E

echo Starting Ciné Haute Glacerie Dev Server...
cd /d "%~dp0repo"

where npm >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js/npm not found. Please install Node.js from https://nodejs.org/
    pause
    exit /b
)

if not exist "node_modules" (
    echo node_modules not found. Running npm install first...
    call npm install
)

echo.
echo Launching Vite Dev Server at http://localhost:5173/ ...
call npm run dev -- --open
pause
