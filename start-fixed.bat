@echo off
title CV Portfolio - Fixed Version
color 0A

echo.
echo ========================================
echo    CV Portfolio - Fixed Version
echo ========================================
echo.

echo Killing any existing Node processes...
taskkill /f /im node.exe >nul 2>&1

echo Waiting 2 seconds...
timeout /t 2 /nobreak >nul

echo Starting server on port 3001...
set PORT=3001
npm start

echo.
echo Server should be running on: http://localhost:3001
echo Admin credentials: refanvanh / bnesindangpanon64
echo.
pause
