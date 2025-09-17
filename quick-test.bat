@echo off
title Quick Test - CV Portfolio
color 0B

echo.
echo ========================================
echo    Quick Test - CV Portfolio
echo ========================================
echo.

echo Starting server...
start /B npm start

echo Waiting 3 seconds for server to start...
timeout /t 3 /nobreak >nul

echo Opening website...
start http://localhost:3000

echo.
echo ========================================
echo    Test Instructions
echo ========================================
echo.
echo 1. Website should open in your browser
echo 2. Look for the "Edit" button in the top navigation
echo 3. Click the "Edit" button
echo 4. A login modal should appear
echo.
echo If the Edit button doesn't work:
echo - Press F12 to open browser console
echo - Look for any red error messages
echo - Check if script.js is loaded
echo.
echo Login credentials:
echo Username: refanvanh
echo Password: bnesindangpanon64
echo.
echo Press any key to stop the server...
pause >nul

echo Stopping server...
taskkill /f /im node.exe >nul 2>&1
echo Server stopped.
