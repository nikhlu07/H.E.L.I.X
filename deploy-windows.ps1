# 🚀 CorruptGuard Windows Deployment Script
# Run this script as Administrator

Write-Host "🚀 CorruptGuard ICP Deployment Script" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Check if running as Administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "❌ This script must be run as Administrator!" -ForegroundColor Red
    Write-Host "Please right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Running as Administrator" -ForegroundColor Green

# Step 1: Check if DFX is already installed
Write-Host "`n🔍 Checking if DFX is already installed..." -ForegroundColor Cyan
try {
    $dfxVersion = dfx --version 2>$null
    if ($dfxVersion) {
        Write-Host "✅ DFX is already installed: $dfxVersion" -ForegroundColor Green
        $dfxInstalled = $true
    } else {
        $dfxInstalled = $false
    }
} catch {
    $dfxInstalled = $false
}

if (-not $dfxInstalled) {
    Write-Host "`n📥 Installing DFX..." -ForegroundColor Cyan
    
    # Create dfx directory
    $dfxDir = "C:\dfx"
    if (-not (Test-Path $dfxDir)) {
        New-Item -ItemType Directory -Path $dfxDir -Force | Out-Null
        Write-Host "✅ Created directory: $dfxDir" -ForegroundColor Green
    }
    
    # Download DFX
    Write-Host "📥 Downloading DFX..." -ForegroundColor Yellow
    $dfxUrl = "https://github.com/dfinity/dfx/releases/latest/download/dfx-x86_64-pc-windows-msvc.zip"
    $dfxZip = "C:\dfx\dfx.zip"
    
    try {
        Invoke-WebRequest -Uri $dfxUrl -OutFile $dfxZip -UseBasicParsing
        Write-Host "✅ Downloaded DFX" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to download DFX" -ForegroundColor Red
        Write-Host "Please download manually from: $dfxUrl" -ForegroundColor Yellow
        Write-Host "Extract to: $dfxDir" -ForegroundColor Yellow
        exit 1
    }
    
    # Extract DFX
    Write-Host "📦 Extracting DFX..." -ForegroundColor Yellow
    try {
        Expand-Archive -Path $dfxZip -DestinationPath $dfxDir -Force
        Write-Host "✅ Extracted DFX" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to extract DFX" -ForegroundColor Red
        exit 1
    }
    
    # Add to PATH
    Write-Host "🔧 Adding DFX to PATH..." -ForegroundColor Yellow
    $currentPath = [Environment]::GetEnvironmentVariable("PATH", "Machine")
    if ($currentPath -notlike "*$dfxDir*") {
        $newPath = "$currentPath;$dfxDir"
        [Environment]::SetEnvironmentVariable("PATH", $newPath, "Machine")
        Write-Host "✅ Added DFX to system PATH" -ForegroundColor Green
        Write-Host "⚠️  Please restart your terminal for PATH changes to take effect" -ForegroundColor Yellow
    }
    
    # Clean up
    Remove-Item $dfxZip -Force -ErrorAction SilentlyContinue
}

# Step 2: Verify DFX installation
Write-Host "`n🔍 Verifying DFX installation..." -ForegroundColor Cyan
try {
    $dfxVersion = dfx --version
    Write-Host "✅ DFX installed successfully: $dfxVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ DFX not found in PATH" -ForegroundColor Red
    Write-Host "Please restart your terminal and run this script again" -ForegroundColor Yellow
    exit 1
}

# Step 3: Setup DFX identity
Write-Host "`n👤 Setting up DFX identity..." -ForegroundColor Cyan
try {
    dfx identity new corruptguard --force 2>$null
    dfx identity use corruptguard
    $identity = dfx identity whoami
    Write-Host "✅ Identity created: $identity" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Identity setup failed, continuing..." -ForegroundColor Yellow
}

# Step 4: Get free cycles
Write-Host "`n💰 Getting free cycles..." -ForegroundColor Cyan
Write-Host "Using coupon: 594FA-B3B89-6F436" -ForegroundColor Yellow
try {
    dfx cycles --network ic redeem-faucet-coupon 594FA-B3B89-6F436
    Write-Host "✅ Cycles redeemed successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to redeem cycles" -ForegroundColor Red
    Write-Host "Please visit: https://faucet.dfinity.org/" -ForegroundColor Yellow
    Write-Host "Enter coupon: 594FA-B3B89-6F436" -ForegroundColor Yellow
}

# Step 5: Check balance
Write-Host "`n💳 Checking wallet balance..." -ForegroundColor Cyan
try {
    $balance = dfx wallet balance --network ic
    Write-Host "💰 Wallet balance: $balance" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Could not check balance" -ForegroundColor Yellow
}

# Step 6: Deploy to ICP
Write-Host "`n🚀 Deploying to ICP..." -ForegroundColor Cyan
Write-Host "This may take a few minutes..." -ForegroundColor Yellow

try {
    dfx deploy corruptguard_frontend --network ic
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
    
    # Get canister ID
    $canisterId = dfx canister id corruptguard_frontend --network ic
    Write-Host "`n🎉 Your app is live!" -ForegroundColor Green
    Write-Host "URL: https://$canisterId.ic0.app" -ForegroundColor Cyan
    Write-Host "`n📋 Next steps:" -ForegroundColor Yellow
    Write-Host "1. Visit your app URL" -ForegroundColor White
    Write-Host "2. Test the demo mode" -ForegroundColor White
    Write-Host "3. Share with your hackathon judges!" -ForegroundColor White
    
} catch {
    Write-Host "❌ Deployment failed" -ForegroundColor Red
    Write-Host "Please check the error messages above" -ForegroundColor Yellow
    Write-Host "You can also try deploying manually:" -ForegroundColor Yellow
    Write-Host "dfx deploy corruptguard_frontend --network ic" -ForegroundColor White
}

Write-Host "`n🎬 For video recording, use the local demo mode:" -ForegroundColor Cyan
Write-Host "python start-backend.py" -ForegroundColor White
Write-Host "cd frontend && npm run dev" -ForegroundColor White
Write-Host "Open: http://localhost:5173" -ForegroundColor White

Write-Host "`n✅ Script completed!" -ForegroundColor Green
