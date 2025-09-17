@echo off
title Test Server Connection
color 0A

echo.
echo ========================================
echo    Testing Server Connection
echo ========================================
echo.

echo [1/3] Starting server...
start /B npm start

echo [2/3] Waiting for server to start...
timeout /t 3 /nobreak >nul

echo [3/3] Testing connection...
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Server is running on http://localhost:3000
    echo.
    echo Opening test page...
    start http://localhost:3000/test-edit.html
    echo.
    echo If the test page works, the problem is with the main page.
    echo If the test page doesn't work, there's a server issue.
) else (
    echo ❌ Server is not responding
    echo.
    echo Try running: npm start
    echo Then check if http://localhost:3000 works
)

echo.
echo Press any key to continue...
pause >nul
