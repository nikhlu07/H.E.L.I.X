# 🚀 CorruptGuard ICP Deployment Guide

## Step 1: Install DFX (Run this in your terminal)

### For Windows (PowerShell):
```powershell
# Install via Chocolatey (if you have it)
choco install dfx

# OR download manually
Invoke-WebRequest -Uri "https://github.com/dfinity/sdk/releases/download/0.15.2/dfx-0.15.2-x86_64-pc-windows-msvc.zip" -OutFile "dfx.zip"
Expand-Archive -Path "dfx.zip" -DestinationPath "dfx"
$env:PATH += ";$(Get-Location)\dfx"
```

### For Linux/WSL:
```bash
sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
```

## Step 2: Deploy Local Canister

```bash
# Navigate to project
cd /path/to/cleargov-fraud-detection

# Start local replica
dfx start --clean --background

# Deploy canister
dfx deploy procurement

# Get canister ID
dfx canister id procurement
```

## Step 3: Update Frontend Environment

Create `frontend/.env`:
```
REACT_APP_CANISTER_ID=your_canister_id_from_step_2
REACT_APP_IC_HOST=http://127.0.0.1:4943
REACT_APP_DFX_NETWORK=local
```

## Step 4: Install Frontend Dependencies

```bash
cd frontend
npm install @dfinity/agent @dfinity/auth-client @dfinity/candid @dfinity/identity @dfinity/principal
```

## Step 5: Test Connection

```bash
# In frontend directory
npm run dev

# Test canister connection
curl http://127.0.0.1:4943/api/v2/canister/YOUR_CANISTER_ID/call
```

## Step 6: Deploy to IC Testnet (Optional)

```bash
# Deploy to mainnet
dfx deploy --network ic

# Get mainnet canister ID
dfx canister id procurement --network ic

# Update .env with mainnet ID and host
REACT_APP_CANISTER_ID=your_mainnet_canister_id
REACT_APP_IC_HOST=https://ic0.app
```

## Troubleshooting

### Common Issues:
1. **DFX not found**: Make sure DFX is in your PATH
2. **Canister build fails**: Check Motoko syntax in main.mo
3. **Frontend can't connect**: Verify canister ID and host in .env
4. **CORS errors**: Add localhost to canister CORS settings

### Test Commands:
```bash
# Check DFX status
dfx ping

# Check canister status
dfx canister status procurement

# Check frontend connection
curl http://localhost:5173
```

## Success Indicators:
✅ DFX starts without errors
✅ Canister deploys successfully
✅ Frontend can call canister methods
✅ All roles can perform their actions
✅ Public queries return data