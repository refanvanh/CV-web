@echo off
title CV Portfolio Website Server
color 0A

echo.
echo ========================================
echo    CV Portfolio Website Server
echo ========================================
echo.

REM Check if Node.js is installed
echo [1/5] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please download and install Node.js from: https://nodejs.org
    echo.
    pause
    exit /b 1
)
echo ✓ Node.js is installed

REM Check if package.json exists
echo [2/5] Checking project files...
if not exist "package.json" (
    echo ERROR: package.json not found!
    echo Make sure you're running this script from the correct directory.
    pause
    exit /b 1
)
echo ✓ Project files found

REM Install dependencies
echo [3/5] Installing/Checking dependencies...
if not exist "node_modules" (
    echo Installing dependencies for the first time...
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies!
        pause
        exit /b 1
    )
) else (
    echo ✓ Dependencies already installed
)

REM Create data directory if not exists
echo [4/5] Setting up data directory...
if not exist "data" mkdir data
if not exist "public\uploads" mkdir public\uploads
echo ✓ Data directories ready

REM Start server
echo [5/5] Starting server...
echo.
echo ========================================
echo    Server Starting...
echo ========================================
echo.
echo Website will be available at: http://localhost:3000
echo.
echo Admin credentials:
echo   Check data/users.json for login info
echo.
echo Press Ctrl+C to stop the server
echo.

REM Wait a moment then open browser
start "" "http://localhost:3000"

REM Start the server
npm start

echo.
echo Server stopped.
pause
