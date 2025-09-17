@echo off
title CV Portfolio - Quick Start
color 0B

echo.
echo ========================================
echo    CV Portfolio - Quick Start
echo ========================================
echo.

echo Starting server and opening website...
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

REM Open browser and start server
start "" "http://localhost:3000"
npm start

pause
