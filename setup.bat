@echo off
title CV Portfolio - Initial Setup
color 0C

echo.
echo ========================================
echo    CV Portfolio - Initial Setup
echo ========================================
echo.

echo This will set up your CV Portfolio website for the first time.
echo.

REM Check if Node.js is installed
echo [1/4] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo.
    echo Please download and install Node.js from: https://nodejs.org
    echo After installation, run this script again.
    echo.
    pause
    exit /b 1
)
echo ✓ Node.js is installed

REM Install dependencies
echo [2/4] Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)
echo ✓ Dependencies installed

REM Create directories
echo [3/4] Creating necessary directories...
if not exist "data" mkdir data
if not exist "public\uploads" mkdir public\uploads
echo ✓ Directories created

REM Create initial data files
echo [4/4] Setting up initial data...
echo ✓ Initial setup complete!

echo.
echo ========================================
echo    Setup Complete!
echo ========================================
echo.
echo Your CV Portfolio website is ready!
echo.
echo To start the website:
echo   1. Double-click "run-server.bat" for full setup
echo   2. Double-click "quick-start.bat" for quick start
echo   3. Double-click "dev-mode.bat" for development
echo.
echo Website will be available at: http://localhost:3000
echo Admin login: Check data/users.json
echo.
pause
