@echo off
echo ============================================
echo 🚀 CorruptGuard ICP Deployment Script
echo ============================================

echo.
echo Step 1: Checking DFX installation...
where dfx >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ DFX not found! Please install DFX first:
    echo    Visit: https://internetcomputer.org/docs/current/developer-docs/setup/install/
    echo    Or run: sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
    pause
    exit /b 1
)
echo ✅ DFX found!

echo.
echo Step 2: Starting local replica...
dfx start --clean --background
if %errorlevel% neq 0 (
    echo ❌ Failed to start DFX replica
    pause
    exit /b 1
)
echo ✅ Local replica started!

echo.
echo Step 3: Deploying procurement canister...
dfx deploy procurement
if %errorlevel% neq 0 (
    echo ❌ Failed to deploy canister
    pause
    exit /b 1
)
echo ✅ Canister deployed!

echo.
echo Step 4: Getting canister ID...
for /f "tokens=*" %%i in ('dfx canister id procurement') do set CANISTER_ID=%%i
echo Canister ID: %CANISTER_ID%

echo.
echo Step 5: Updating frontend environment...
echo # ICP Canister Configuration > frontend\.env
echo REACT_APP_CANISTER_ID=%CANISTER_ID% >> frontend\.env
echo REACT_APP_IC_HOST=http://127.0.0.1:4943 >> frontend\.env
echo REACT_APP_DFX_NETWORK=local >> frontend\.env
echo REACT_APP_BACKEND_URL=http://127.0.0.1:8000 >> frontend\.env
echo NODE_ENV=development >> frontend\.env
echo ✅ Environment updated!

echo.
echo Step 6: Installing frontend dependencies...
cd frontend
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)
echo ✅ Dependencies installed!

echo.
echo Step 7: Building frontend...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Failed to build frontend
    pause
    exit /b 1
)
echo ✅ Frontend built!

cd ..

echo.
echo Step 8: Deploying frontend canister...
dfx deploy frontend
if %errorlevel% neq 0 (
    echo ❌ Failed to deploy frontend canister
    pause
    exit /b 1
)
echo ✅ Frontend canister deployed!

echo.
echo ============================================
echo 🎉 DEPLOYMENT COMPLETE!
echo ============================================
echo.
echo 📋 Your CorruptGuard dApp is ready:
echo.
echo 🔗 Frontend URL: http://127.0.0.1:4943/?canisterId=frontend_canister_id
echo 🛡️ Procurement Canister: %CANISTER_ID%
echo 🐍 Backend API: http://127.0.0.1:8000
echo.
echo 🧪 To test:
echo 1. Open: http://localhost:5173
echo 2. Scroll to "ICP Connection Test" section
echo 3. Click "Test Connection"
echo 4. Should show "Connected" with system stats
echo.
echo 📝 Next steps:
echo - Test all role flows (Government → Vendor → Citizen)
echo - Deploy to IC mainnet: dfx deploy --network ic
echo - Update frontend .env with mainnet canister ID
echo.
pause