@echo off
setlocal
cd /d "%~dp0"

echo =============================
echo Firebase setup for BBTService
echo =============================

rem Prefer the firebase.cmd wrapper to avoid PowerShell execution policy issues.
set "FIREBASE_CMD=%APPDATA%\npm\firebase.cmd"
if not exist "%FIREBASE_CMD%" (
  for /f "delims=" %%i in ('where firebase 2^>nul') do (
    if /i "%%~xi"==".cmd" set "FIREBASE_CMD=%%i"
  )
)

if not exist "%FIREBASE_CMD%" (
  echo Firebase CLI not found. Install it with:
  echo   npm install -g firebase-tools
  echo.
  pause
  exit /b 1
)

echo Using Firebase CLI: "%FIREBASE_CMD%"
"%FIREBASE_CMD%" --version >nul 2>&1
if errorlevel 1 goto :error

echo.
"%FIREBASE_CMD%" login --no-localhost
if errorlevel 1 goto :login_failed

echo.
echo Firebase login successful.
echo.

set /p "PROJECT_ID=Enter Firebase project ID to use (existing or new): "
if "%PROJECT_ID%"=="" goto :project_empty

"%FIREBASE_CMD%" use "%PROJECT_ID%" >nul 2>&1
if errorlevel 1 (
  echo Project not found or not accessible. Attempting to create it...
  "%FIREBASE_CMD%" projects:create "%PROJECT_ID%" --display-name "%PROJECT_ID%"
  if errorlevel 1 goto :project_create_failed
  "%FIREBASE_CMD%" use "%PROJECT_ID%"
)

echo.
echo Project set to: %PROJECT_ID%

(echo {"projects":{"default":"%PROJECT_ID%"}}) > .firebaserc
if errorlevel 1 goto :file_error

echo Wrote .firebaserc with project ID %PROJECT_ID%.
echo.
echo Now build and deploy:
echo   npm run build
echo   "%FIREBASE_CMD%" deploy --only hosting
echo.

echo Setup complete. Press any key to close this window.
pause >nul
exit /b 0

:login_failed
  echo.
  echo Firebase login failed. Please ensure the browser opened and you authenticated.
  goto :end

:project_empty
  echo Project ID cannot be empty.
  goto :end

:project_create_failed
  echo Failed to create project. Please create the project manually in Firebase Console.
  goto :end

:file_error
  echo Failed to write .firebaserc. Please check file permissions.
  goto :end

:error
  echo There was a problem running Firebase CLI. Please verify the installation.
  goto :end

:end
  echo.
  echo Press any key to close this window.
  pause >nul
  exit /b 1
