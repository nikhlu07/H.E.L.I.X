@echo off
echo ============================================
echo 🌐 CorruptGuard MAINNET Deployment
echo ============================================

echo.
echo 🚀 Deploying directly to Internet Computer Mainnet...
echo ⚠️  This will create LIVE canisters accessible worldwide!
echo.

echo Step 1: Checking DFX...
where dfx >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ DFX not found! Please install DFX first.
    echo Visit: https://internetcomputer.org/docs/current/developer-docs/setup/install/
    pause
    exit /b 1
)
echo ✅ DFX found!

echo.
echo Step 2: Creating identity (if needed)...
dfx identity whoami
if %errorlevel% neq 0 (
    echo Creating new identity...
    dfx identity new default
    dfx identity use default
)

echo.
echo Step 3: Checking cycles balance...
dfx wallet balance --network ic
if %errorlevel% neq 0 (
    echo ⚠️  You need ICP tokens to deploy to mainnet.
    echo.
    echo 💡 Options:
    echo 1. Get free cycles from dfinity.org/grants
    echo 2. Convert ICP to cycles in NNS app
    echo 3. Use cycles faucet (if available)
    echo.
    echo 🔗 Get cycles: https://faucet.dfinity.org/
    pause
    exit /b 1
)

echo.
echo Step 4: Deploying procurement canister to MAINNET...
dfx deploy procurement --network ic
if %errorlevel% neq 0 (
    echo ❌ Failed to deploy procurement canister
    pause
    exit /b 1
)
echo ✅ Procurement canister deployed to mainnet!

echo.
echo Step 5: Building frontend...
cd frontend
npm run build
if %errorlevel% neq 0 (
    echo ❌ Failed to build frontend
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo Step 6: Deploying frontend canister to MAINNET...
dfx deploy frontend --network ic
if %errorlevel% neq 0 (
    echo ❌ Failed to deploy frontend canister
    pause
    exit /b 1
)
echo ✅ Frontend canister deployed to mainnet!

echo.
echo Step 7: Getting your LIVE canister IDs...
for /f "tokens=*" %%i in ('dfx canister id procurement --network ic') do set PROCUREMENT_ID=%%i
for /f "tokens=*" %%i in ('dfx canister id frontend --network ic') do set FRONTEND_ID=%%i

echo.
echo ============================================
echo 🎉 LIVE ON MAINNET! Your URLs:
echo ============================================
echo.
echo 🌐 LIVE FRONTEND (Share this URL):
echo    https://%FRONTEND_ID%.ic0.app
echo.
echo 🛡️ PROCUREMENT CANISTER:
echo    https://%PROCUREMENT_ID%.ic0.app
echo.
echo 📊 CANDID INTERFACE (for testing):
echo    https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.ic0.app/?id=%PROCUREMENT_ID%
echo.
echo 📋 FOR DORAHACKS SUBMISSION:
echo    Frontend Canister ID: %FRONTEND_ID%
echo    Backend Canister ID: %PROCUREMENT_ID%
echo    Live Demo URL: https://%FRONTEND_ID%.ic0.app
echo.
echo 🎯 Your CorruptGuard dApp is now LIVE on the blockchain!
echo 🌍 Anyone worldwide can access it at the URLs above!
echo.
pause