@echo off
REM Deploy the project to Firebase Hosting using the local Firebase CLI.
cd /d "%~dp0"
setlocal

set "FIREBASE_CMD=%APPDATA%\npm\firebase.cmd"
if not exist "%FIREBASE_CMD%" (
  for /f "delims=" %%i in ('where firebase 2^>nul') do (
    if /i "%%~xi"==".cmd" set "FIREBASE_CMD=%%i"
  )
)

if not exist "%FIREBASE_CMD%" (
  echo Firebase CLI not found. Install it with:
  echo   npm install -g firebase-tools
  pause
  exit /b 1
)

echo Using Firebase CLI: "%FIREBASE_CMD%"
"%FIREBASE_CMD%" deploy --only hosting
if errorlevel 1 (
  echo.
  echo Deploy failed. Check your Firebase login and project configuration.
)
echo.
echo Press any key to close this window.
pause >nul
