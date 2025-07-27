@echo off
echo ============================================
echo 🚀 CorruptGuard Complete Setup & Deployment
echo ============================================

echo.
echo Checking if DFX is installed...
where dfx >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ DFX not found! 
    echo.
    echo 📥 Installing DFX...
    echo Please choose your installation method:
    echo.
    echo 1. Install WSL + DFX (Recommended)
    echo 2. Download DFX Windows binary
    echo 3. Exit and install manually
    echo.
    set /p choice="Enter choice (1-3): "
    
    if "%choice%"=="1" (
        echo Installing WSL...
        wsl --install
        echo.
        echo ⚠️  Please restart your computer after WSL installation
        echo Then run this script again.
        pause
        exit /b 0
    )
    
    if "%choice%"=="2" (
        echo Downloading DFX Windows binary...
        powershell -Command "Invoke-WebRequest -Uri 'https://github.com/dfinity/sdk/releases/download/0.15.2/dfx-0.15.2-x86_64-pc-windows-msvc.zip' -OutFile 'dfx.zip'"
        powershell -Command "Expand-Archive -Path 'dfx.zip' -DestinationPath 'dfx-install' -Force"
        set PATH=%PATH%;%CD%\dfx-install
        echo DFX installed locally!
    )
    
    if "%choice%"=="3" (
        echo Please install DFX manually:
        echo https://internetcomputer.org/docs/current/developer-docs/setup/install/
        pause
        exit /b 1
    )
)

echo ✅ DFX is available!
echo.

echo Starting local IC replica...
dfx start --clean --background

echo.
echo Deploying your CorruptGuard canister...
dfx deploy procurement

echo.
echo Getting your canister ID...
for /f "tokens=*" %%i in ('dfx canister id procurement') do set CANISTER_ID=%%i

echo.
echo ============================================
echo 🎉 SUCCESS! Your canister is deployed!
echo ============================================
echo.
echo 🆔 Your Canister ID: %CANISTER_ID%
echo 🔗 Local URL: http://127.0.0.1:4943/?canisterId=%CANISTER_ID%
echo.
echo 📋 Next steps:
echo 1. Update frontend/.env with this canister ID
echo 2. Start frontend: cd frontend && npm run dev
echo 3. Test connection at http://localhost:5173
echo.
echo 🌐 To deploy publicly:
echo    dfx deploy --network ic
echo.
pause