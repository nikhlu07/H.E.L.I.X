# 🚀 Install DFX for ICP Deployment

## Windows Installation

### Option 1: Using PowerShell (Recommended)
```powershell
# Download and install DFX
Invoke-WebRequest -Uri "https://internetcomputer.org/dfx/install/install.sh" -OutFile "install-dfx.ps1"
.\install-dfx.ps1

# Add DFX to PATH (restart terminal after this)
$env:PATH += ";$env:USERPROFILE\.local\bin"
```

### Option 2: Manual Installation
1. **Download DFX**: Visit https://internetcomputer.org/docs/current/developer-docs/setup/install/
2. **Extract**: Download the Windows binary and extract to a folder
3. **Add to PATH**: Add the folder to your system PATH
4. **Verify**: Open new terminal and run `dfx --version`

### Option 3: Using Chocolatey
```powershell
# Install Chocolatey first if you don't have it
# Then install DFX
choco install dfx
```

## After Installation

### 1. Verify DFX Installation
```bash
dfx --version
```

### 2. Create Identity
```bash
dfx identity new corruptguard
dfx identity use corruptguard
dfx identity whoami
```

### 3. Get Free Cycles
```bash
# Use our coupon code
dfx cycles --network ic redeem-faucet-coupon 594FA-B3B89-6F436

# Check balance
dfx wallet balance --network ic
```

### 4. Deploy to ICP
```bash
# Deploy frontend to ICP
dfx deploy corruptguard_frontend --network ic

# Get your canister URL
dfx canister id corruptguard_frontend --network ic
```

## Alternative: Use the Web Interface

If you prefer not to install DFX locally:

1. **Visit**: https://faucet.dfinity.org/
2. **Enter coupon**: `594FA-B3B89-6F436`
3. **Get cycles** for your principal ID
4. **Deploy via**: https://internetcomputer.org/docs/current/developer-docs/setup/deploy-live

## Quick Deploy Commands

Once DFX is installed:

```bash
# 1. Setup identity
dfx identity new corruptguard
dfx identity use corruptguard

# 2. Get cycles
dfx cycles --network ic redeem-faucet-coupon 594FA-B3B89-6F436

# 3. Deploy
dfx deploy corruptguard_frontend --network ic

# 4. Get URL
dfx canister id corruptguard_frontend --network ic
```

Your app will be live at: `https://your-canister-id.ic0.app`
