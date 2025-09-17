@echo off
title CV Portfolio - Development Mode
color 0E

echo.
echo ========================================
echo    CV Portfolio - Development Mode
echo ========================================
echo.

echo Starting server in development mode...
echo Auto-restart enabled for code changes
echo Admin: Check data/users.json
echo.

REM Install dependencies if needed
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
)

REM Create directories if needed
if not exist "data" mkdir data
if not exist "public\uploads" mkdir public\uploads

REM Open browser
start "" "http://localhost:3000"

REM Start in development mode (with nodemon if available)
npm run dev 2>nul || npm start

pause
