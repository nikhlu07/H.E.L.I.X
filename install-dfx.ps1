# ================================================================================
# CORRUPTGUARD - DFX SDK INSTALLATION SCRIPT FOR WINDOWS
# ================================================================================

Write-Host "🛡️ CorruptGuard - Installing DFX SDK for Internet Computer Development" -ForegroundColor Green
Write-Host "================================================================================" -ForegroundColor Cyan

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")

if (-not $isAdmin) {
    Write-Host "⚠️  Warning: This script should be run as Administrator for best results" -ForegroundColor Yellow
    Write-Host "   Some features may not work correctly without admin privileges" -ForegroundColor Yellow
    Write-Host ""
}

# Check if Chocolatey is installed
Write-Host "🔍 Checking for Chocolatey package manager..." -ForegroundColor Blue
$chocoInstalled = Get-Command choco -ErrorAction SilentlyContinue

if (-not $chocoInstalled) {
    Write-Host "📦 Installing Chocolatey..." -ForegroundColor Yellow
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
    
    # Refresh environment variables
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
} else {
    Write-Host "✅ Chocolatey is already installed" -ForegroundColor Green
}

# Check if Git is installed
Write-Host "🔍 Checking for Git..." -ForegroundColor Blue
$gitInstalled = Get-Command git -ErrorAction SilentlyContinue

if (-not $gitInstalled) {
    Write-Host "📦 Installing Git..." -ForegroundColor Yellow
    choco install git -y
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
} else {
    Write-Host "✅ Git is already installed" -ForegroundColor Green
}

# Check if Node.js is installed
Write-Host "🔍 Checking for Node.js..." -ForegroundColor Blue
$nodeInstalled = Get-Command node -ErrorAction SilentlyContinue

if (-not $nodeInstalled) {
    Write-Host "📦 Installing Node.js..." -ForegroundColor Yellow
    choco install nodejs -y
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
} else {
    Write-Host "✅ Node.js is already installed" -ForegroundColor Green
    $nodeVersion = node --version
    Write-Host "   Version: $nodeVersion" -ForegroundColor Gray
}

# Check if Python is installed
Write-Host "🔍 Checking for Python..." -ForegroundColor Blue
$pythonInstalled = Get-Command python -ErrorAction SilentlyContinue

if (-not $pythonInstalled) {
    Write-Host "📦 Installing Python..." -ForegroundColor Yellow
    choco install python -y
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
} else {
    Write-Host "✅ Python is already installed" -ForegroundColor Green
    $pythonVersion = python --version
    Write-Host "   Version: $pythonVersion" -ForegroundColor Gray
}

# Install DFX SDK
Write-Host "🚀 Installing DFX SDK..." -ForegroundColor Yellow

# Download and install DFX
$dfxUrl = "https://download.dfinity.systems/ic/dfx/0.15.0/x86_64-windows/dfx.exe"
$dfxPath = "$env:USERPROFILE\.dfx\bin\dfx.exe"
$dfxDir = "$env:USERPROFILE\.dfx\bin"

# Create directory if it doesn't exist
if (-not (Test-Path $dfxDir)) {
    New-Item -ItemType Directory -Path $dfxDir -Force | Out-Null
}

# Download DFX
Write-Host "📥 Downloading DFX SDK..." -ForegroundColor Blue
try {
    Invoke-WebRequest -Uri $dfxUrl -OutFile $dfxPath
    Write-Host "✅ DFX downloaded successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to download DFX: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Add DFX to PATH
Write-Host "🔧 Adding DFX to PATH..." -ForegroundColor Blue
$userPath = [Environment]::GetEnvironmentVariable("PATH", "User")
if ($userPath -notlike "*$dfxDir*") {
    [Environment]::SetEnvironmentVariable("PATH", "$userPath;$dfxDir", "User")
    $env:Path += ";$dfxDir"
    Write-Host "✅ DFX added to PATH" -ForegroundColor Green
} else {
    Write-Host "✅ DFX already in PATH" -ForegroundColor Green
}

# Verify DFX installation
Write-Host "🔍 Verifying DFX installation..." -ForegroundColor Blue
try {
    $dfxVersion = & $dfxPath --version
    Write-Host "✅ DFX installed successfully" -ForegroundColor Green
    Write-Host "   Version: $dfxVersion" -ForegroundColor Gray
} catch {
    Write-Host "❌ DFX verification failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Install Internet Identity
Write-Host "🔐 Installing Internet Identity..." -ForegroundColor Yellow
try {
    & $dfxPath identity new minter --disable-encryption
    Write-Host "✅ Internet Identity created successfully" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Internet Identity creation failed (this is normal if already exists): $($_.Exception.Message)" -ForegroundColor Yellow
}

# Set default identity
Write-Host "🔧 Setting default identity..." -ForegroundColor Blue
try {
    & $dfxPath identity use minter
    Write-Host "✅ Default identity set to 'minter'" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Could not set default identity: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Test local network
Write-Host "🧪 Testing local network setup..." -ForegroundColor Blue
try {
    & $dfxPath ping
    Write-Host "✅ DFX network test successful" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Network test failed (this is normal if no local network is running): $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 DFX SDK Installation Complete!" -ForegroundColor Green
Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Restart your terminal/PowerShell to ensure PATH changes take effect" -ForegroundColor White
Write-Host "   2. Navigate to your CorruptGuard project directory" -ForegroundColor White
Write-Host "   3. Run: dfx start --background" -ForegroundColor White
Write-Host "   4. Run: dfx deploy" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Useful Commands:" -ForegroundColor Yellow
Write-Host "   dfx --version          - Check DFX version" -ForegroundColor White
Write-Host "   dfx identity list      - List available identities" -ForegroundColor White
Write-Host "   dfx start --background - Start local network" -ForegroundColor White
Write-Host "   dfx stop               - Stop local network" -ForegroundColor White
Write-Host "   dfx deploy             - Deploy canisters" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Yellow
Write-Host "   https://internetcomputer.org/docs/current/developer-docs/setup/install/" -ForegroundColor Cyan
Write-Host "   https://internetcomputer.org/docs/current/developer-docs/quickstart/hello10mins" -ForegroundColor Cyan
Write-Host ""
Write-Host "🛡️ CorruptGuard is ready for development!" -ForegroundColor Green
