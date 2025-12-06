@echo off
REM Cadence App - Quick Start Script
REM This script installs dependencies and starts the dev server

echo.
echo ========================================
echo   Cadence - Veteran Transition Tool
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo Dependencies installed!
    echo.
) else (
    echo Dependencies already installed, skipping npm install
    echo.
)

REM Start the dev server
echo Starting dev server...
echo.
echo Server will be available at: http://localhost:3001
echo.
call npm run dev

REM Keep window open if there's an error
pause
