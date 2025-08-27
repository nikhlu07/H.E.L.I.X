# 🚀 Windows DFX Installation Guide

## Method 1: Using Windows Subsystem for Linux (WSL) - Recommended

### Step 1: Install WSL
```powershell
# Open PowerShell as Administrator and run:
wsl --install
# Restart your computer
```

### Step 2: Install DFX in WSL
```bash
# Open WSL terminal
curl -L https://internetcomputer.org/dfx/install/install.sh -o install-dfx.sh
sh install-dfx.sh
source ~/.bashrc
dfx --version
```

### Step 3: Deploy from WSL
```bash
# Navigate to your project
cd /mnt/c/Users/nikhil/Downloads/Corruptguard

# Setup and deploy
dfx identity new corruptguard
dfx identity use corruptguard
dfx cycles --network ic redeem-faucet-coupon 594FA-B3B89-6F436
dfx deploy corruptguard_frontend --network ic
```

## Method 2: Direct Windows Installation

### Step 1: Download DFX Binary
1. **Visit**: https://github.com/dfinity/dfx/releases
2. **Download**: `dfx-x.x.x-x86_64-pc-windows-msvc.zip`
3. **Extract**: To `C:\dfx\`
4. **Add to PATH**: Add `C:\dfx\` to your system PATH

### Step 2: Verify Installation
```powershell
# Open new PowerShell window
dfx --version
```

### Step 3: Deploy
```powershell
# Navigate to project
cd C:\Users\nikhil\Downloads\Corruptguard

# Setup and deploy
dfx identity new corruptguard
dfx identity use corruptguard
dfx cycles --network ic redeem-faucet-coupon 594FA-B3B89-6F436
dfx deploy corruptguard_frontend --network ic
```

## Method 3: Using Chocolatey

### Step 1: Install Chocolatey
```powershell
# Run in PowerShell as Administrator
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

### Step 2: Install DFX
```powershell
choco install dfx
```

### Step 3: Deploy
```powershell
dfx --version
dfx identity new corruptguard
dfx identity use corruptguard
dfx cycles --network ic redeem-faucet-coupon 594FA-B3B89-6F436
dfx deploy corruptguard_frontend --network ic
```

## Method 4: Web-Based Deployment (No Installation)

### Step 1: Get Cycles
1. **Visit**: https://faucet.dfinity.org/
2. **Enter coupon**: `594FA-B3B89-6F436`
3. **Copy your Principal ID**

### Step 2: Use Online DFX
1. **Visit**: https://internetcomputer.org/docs/current/developer-docs/setup/deploy-live
2. **Upload your project files**
3. **Deploy using the web interface**

## Quick Commands After Installation

```bash
# 1. Verify DFX
dfx --version

# 2. Create identity
dfx identity new corruptguard
dfx identity use corruptguard

# 3. Get free cycles
dfx cycles --network ic redeem-faucet-coupon 594FA-B3B89-6F436

# 4. Check balance
dfx wallet balance --network ic

# 5. Deploy frontend
dfx deploy corruptguard_frontend --network ic

# 6. Get your URL
dfx canister id corruptguard_frontend --network ic
```

## Troubleshooting

### If DFX not found:
```powershell
# Add to PATH manually
$env:PATH += ";C:\dfx\"
# Or restart terminal after adding to system PATH
```

### If permission errors:
```powershell
# Run PowerShell as Administrator
```

### If WSL issues:
```powershell
# Reinstall WSL
wsl --unregister Ubuntu
wsl --install Ubuntu
```

## Your App URL
After successful deployment, your app will be live at:
`https://your-canister-id.ic0.app`
