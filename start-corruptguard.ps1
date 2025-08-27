# ================================================================================
# CORRUPTGUARD - COMPLETE SYSTEM STARTUP SCRIPT
# ================================================================================

Write-Host "🛡️ CorruptGuard - Starting Complete System" -ForegroundColor Green
Write-Host "================================================================================" -ForegroundColor Cyan

# Check if DFX is installed
$dfxInstalled = Get-Command dfx -ErrorAction SilentlyContinue
if (-not $dfxInstalled) {
    Write-Host "❌ DFX not found. Please run .\install-dfx.ps1 first" -ForegroundColor Red
    exit 1
}

# Check if Python is installed
$pythonInstalled = Get-Command python -ErrorAction SilentlyContinue
if (-not $pythonInstalled) {
    Write-Host "❌ Python not found. Please install Python first" -ForegroundColor Red
    exit 1
}

# Check if Node.js is installed
$nodeInstalled = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeInstalled) {
    Write-Host "❌ Node.js not found. Please install Node.js first" -ForegroundColor Red
    exit 1
}

Write-Host "✅ All dependencies found" -ForegroundColor Green

# Step 1: Start ICP Network
Write-Host "🚀 Starting ICP Network..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-Command", "dfx start --background" -WindowStyle Minimized
Start-Sleep -Seconds 10

# Step 2: Deploy Canisters
Write-Host "📦 Deploying Canisters..." -ForegroundColor Yellow
dfx deploy
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Canister deployment failed" -ForegroundColor Red
    exit 1
}

# Step 3: Initialize Demo Data
Write-Host "🎯 Initializing Demo Data..." -ForegroundColor Yellow
dfx canister call procurement initializeDemoData
dfx canister call rbac initializeDemoData

# Step 4: Start Backend
Write-Host "🔧 Starting Backend API..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-Command", "cd backend; uvicorn app.main:app --reload --port 8000" -WindowStyle Minimized
Start-Sleep -Seconds 5

# Step 5: Start Frontend
Write-Host "🎨 Starting Frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-Command", "cd frontend; npm run dev" -WindowStyle Minimized
Start-Sleep -Seconds 5

# Step 6: Run Tests
Write-Host "🧪 Running System Tests..." -ForegroundColor Yellow
dfx canister call tests runAllTests

Write-Host ""
Write-Host "🎉 CorruptGuard System Started Successfully!" -ForegroundColor Green
Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📱 Access Points:" -ForegroundColor Yellow
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "   Backend API: http://localhost:8000" -ForegroundColor White
Write-Host "   API Docs: http://localhost:8000/docs" -ForegroundColor White
Write-Host "   ICP Network: http://localhost:4943" -ForegroundColor White
Write-Host ""
Write-Host "🔐 Login with Internet Identity to access the system" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Demo Accounts:" -ForegroundColor Yellow
Write-Host "   Government: Use ICP Identity" -ForegroundColor White
Write-Host "   Vendor: Use ICP Identity" -ForegroundColor White
Write-Host "   Citizen: Use ICP Identity" -ForegroundColor White
Write-Host ""
Write-Host "🛑 To stop all services, close the PowerShell windows" -ForegroundColor Gray
Write-Host ""
Write-Host "🛡️ CorruptGuard is ready to fight corruption! 🚀" -ForegroundColor Green
