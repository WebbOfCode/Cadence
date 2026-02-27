@echo off
REM Cadence Local Development Startup Script
REM This script installs dependencies and starts the dev server

cd /d "%~dp0"

echo.
echo ========================================
echo   Cadence Development Server
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    echo.
    call npm install
    echo.
)

echo Starting development server...
echo.
echo Server will be available at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev

pause
