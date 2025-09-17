@echo off
title CV Portfolio - Debug Mode
color 0E

echo.
echo ========================================
echo    CV Portfolio - Debug Mode
echo ========================================
echo.

echo Checking files and dependencies...
echo.

REM Check if Node.js is installed
echo [1/4] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed!
    pause
    exit /b 1
) else (
    echo ✅ Node.js is installed
)

REM Check if dependencies are installed
echo [2/4] Checking dependencies...
if not exist "node_modules" (
    echo ❌ Dependencies not installed!
    echo Installing dependencies...
    npm install
) else (
    echo ✅ Dependencies are installed
)

REM Check if public folder exists
echo [3/4] Checking public folder...
if not exist "public" (
    echo ❌ Public folder not found!
    pause
    exit /b 1
) else (
    echo ✅ Public folder exists
)

REM Check if required files exist
echo [4/4] Checking required files...
if not exist "public\index.html" (
    echo ❌ index.html not found in public folder!
) else (
    echo ✅ index.html found
)

if not exist "public\script.js" (
    echo ❌ script.js not found in public folder!
) else (
    echo ✅ script.js found
)

if not exist "public\styles.css" (
    echo ❌ styles.css not found in public folder!
) else (
    echo ✅ styles.css found
)

if not exist "server.js" (
    echo ❌ server.js not found!
) else (
    echo ✅ server.js found
)

echo.
echo ========================================
echo    Starting Server for Debug
echo ========================================
echo.

echo Starting server...
echo Open browser and go to: http://localhost:3000
echo.
echo If the Edit button doesn't work:
echo 1. Open browser console (F12)
echo 2. Check for JavaScript errors
echo 3. Check if script.js is loaded
echo.

npm start

pause
