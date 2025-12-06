@echo off
REM Cadence App - Fast Start (skips npm install if dependencies exist)
REM This is the fastest way to start the dev server

echo.
echo ========================================
echo   Cadence - Starting Dev Server
echo ========================================
echo.

REM Start the dev server immediately
echo Starting dev server at http://localhost:3001
echo.
npm run dev

REM Keep window open if there's an error
pause
