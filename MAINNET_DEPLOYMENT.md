# 🚀 CorruptGuard Mainnet Deployment Guide

**Deploy CorruptGuard to Internet Computer Mainnet for ICP Hackathon**

## 🎯 Why Deploy to Mainnet?

For the **ICP Hackathon**, mainnet deployment is crucial because:
- ✅ **Judges expect real blockchain integration**
- ✅ **Internet Identity authentication works properly**
- ✅ **Public accessibility for anyone to test**
- ✅ **Demonstrates production readiness**
- ✅ **Provides permanent demo URLs**

## 📋 Prerequisites

### 1. Install DFX SDK

**Windows (WSL):**
```bash
# Install WSL if not already installed
wsl --install

# In WSL terminal:
sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
```

**macOS/Linux:**
```bash
sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
```

**Verify Installation:**
```bash
dfx --version
# Should show: dfx 0.15.x or higher
```

### 2. Create Internet Identity

1. Visit https://identity.ic0.app
2. Create your Internet Identity using device authentication
3. Note your Principal ID for later use

## 💰 Getting Cycles for Deployment

### Option 1: ICP Hackathon Cycles (Recommended)
If you're participating in an ICP hackathon:
1. Check hackathon documentation for cycle grants
2. Use provided coupon codes
3. Contact hackathon organizers for cycles

### Option 2: Cycles Faucet (Development)
```bash
# Visit the cycles faucet
open https://faucet.dfinity.org/

# Request development cycles
# Usually provides 20T cycles for testing
```

### Option 3: Purchase Cycles
```bash
# Convert ICP to cycles
dfx ledger fabricate-cycles --amount 1.0

# Or use NNS app to convert ICP
open https://nns.ic0.app/
```

## 🏗️ Deployment Steps

### 1. Configure dfx.json

Update your `dfx.json` for mainnet deployment:

```json
{
  "canisters": {
    "frontend": {
      "type": "assets",
      "source": ["frontend/dist"]
    },
    "backend": {
      "type": "motoko",
      "main": "canisters/procurement/src/main.mo"
    },
    "fraud_engine": {
      "type": "motoko", 
      "main": "canisters/fraud_engine/main.mo"
    }
  },
  "networks": {
    "local": {
      "bind": "127.0.0.1:4943",
      "type": "ephemeral"
    },
    "ic": {
      "providers": ["https://ic0.app"],
      "type": "persistent"
    }
  },
  "version": 1
}
```

### 2. Build Frontend

```bash
cd frontend
npm install
npm run build
cd ..
```

### 3. Deploy to Mainnet

```bash
# Start local DFX (for identity management)
dfx start --background

# Check your cycles balance
dfx wallet balance --network ic

# Deploy all canisters to mainnet
dfx deploy --network ic --with-cycles 5000000000000

# This will deploy:
# - frontend (asset canister)
# - backend (motoko canister) 
# - fraud_engine (motoko canister)
```

### 4. Get Canister URLs

```bash
# Get your canister IDs
dfx canister id frontend --network ic
dfx canister id backend --network ic  
dfx canister id fraud_engine --network ic

# Your frontend will be available at:
# https://{frontend-canister-id}.ic0.app
```

## 🔧 Configuration Updates

### Update Frontend Environment

Create `frontend/.env.production`:
```bash
VITE_DFX_NETWORK=ic
VITE_II_URL=https://identity.ic0.app
VITE_BACKEND_CANISTER_ID=your-backend-canister-id
VITE_FRAUD_ENGINE_CANISTER_ID=your-fraud-engine-canister-id
```

### Update Canister References

Update `frontend/src/services/authService.ts`:
```typescript
// Use production canister IDs
const BACKEND_CANISTER_ID = process.env.VITE_BACKEND_CANISTER_ID;
const FRAUD_ENGINE_CANISTER_ID = process.env.VITE_FRAUD_ENGINE_CANISTER_ID;

// Production agent configuration
const agent = new HttpAgent({
  host: 'https://ic0.app',
  identity,
});
```

## 🎯 Hackathon-Specific Deployment

### Quick Deployment Script

Create `deploy-hackathon.sh`:
```bash
#!/bin/bash

echo "🚀 Deploying CorruptGuard to IC Mainnet for Hackathon"

# Build frontend
echo "📦 Building frontend..."
cd frontend && npm run build && cd ..

# Deploy to mainnet
echo "🌐 Deploying to IC mainnet..."
dfx deploy --network ic --with-cycles 5000000000000

# Get URLs
echo "🔗 Getting deployment URLs..."
FRONTEND_ID=$(dfx canister id frontend --network ic)
BACKEND_ID=$(dfx canister id backend --network ic)

echo "✅ Deployment Complete!"
echo "Frontend URL: https://${FRONTEND_ID}.ic0.app"
echo "Backend Canister: ${BACKEND_ID}"

echo "🎯 Hackathon Demo URLs:"
echo "- Live App: https://${FRONTEND_ID}.ic0.app"
echo "- Internet Identity: https://identity.ic0.app"
echo "- Repository: https://github.com/nikhlu07/Corruptguard"
```

### Make it executable and run:
```bash
chmod +x deploy-hackathon.sh
./deploy-hackathon.sh
```

## 🧪 Testing Deployment

### 1. Frontend Testing
- Visit your frontend URL: `https://{canister-id}.ic0.app`
- Test Internet Identity login
- Try different user roles
- Verify fraud detection features work

### 2. Backend Testing
```bash
# Test canister calls
dfx canister call backend getUserRole --network ic --argument '(principal "your-principal-id")'

# Test fraud detection
dfx canister call fraud_engine analyzeFraud --network ic --argument '(record { amount = 1000000; vendor_id = "test" })'
```

### 3. Internet Identity Testing
- Use your Internet Identity to log in
- Test role assignment
- Verify authentication flow

## 📊 Monitoring Deployment

### Check Canister Status
```bash
# View canister info
dfx canister status frontend --network ic
dfx canister status backend --network ic

# Check cycle balance
dfx canister status frontend --network ic | grep "Balance:"
```

### View Logs
```bash
# Get canister logs
dfx canister logs backend --network ic
```

## 🎬 Hackathon Demo Script

### Live Demo Flow:
1. **Show GitHub Repository** - https://github.com/nikhlu07/Corruptguard
2. **Visit Live App** - https://{your-canister-id}.ic0.app
3. **Demonstrate Internet Identity** - Biometric login
4. **Show Role Switching** - Different user dashboards
5. **Fraud Detection Demo** - Live AI analysis
6. **Blockchain Verification** - Show immutable records

### Demo Talking Points:
- "This is running live on Internet Computer mainnet"
- "Real blockchain with immutable fraud evidence"
- "Internet Identity provides passwordless, secure authentication"
- "AI fraud detection with 87% accuracy saves lives"
- "Built to prevent tragedies like Jhalawar school collapse"

## 🚨 Troubleshooting

### Common Issues:

**"Insufficient Cycles"**
```bash
# Add more cycles
dfx canister deposit-cycles 1000000000000 frontend --network ic
```

**"Canister Not Found"**
```bash
# Verify canister ID
dfx canister id frontend --network ic
```

**"Authentication Failed"**
```bash
# Re-authenticate
dfx identity get-principal
dfx wallet balance --network ic
```

### Emergency Commands:
```bash
# Stop canisters (saves cycles)
dfx canister stop frontend --network ic

# Start canisters
dfx canister start frontend --network ic

# Delete canisters (if needed)
dfx canister delete frontend --network ic
```

## 💡 Optimization Tips

### Cycle Management:
- Monitor cycle usage regularly
- Stop unused canisters to save cycles
- Use asset canister for frontend (most efficient)

### Performance:
- Minimize canister calls
- Use query calls when possible
- Optimize frontend bundle size

### Security:
- Set proper canister controllers
- Implement access controls
- Use Internet Identity for authentication

## 🏆 Hackathon Success Metrics

After deployment, you'll have:
- ✅ **Live dapp URL** running on IC mainnet
- ✅ **Internet Identity integration** working
- ✅ **Real blockchain** fraud detection
- ✅ **Public accessibility** for judges
- ✅ **Production-ready** demonstration

## 🔗 Final Deliverables

**For Hackathon Submission:**
1. **Live App URL**: https://{canister-id}.ic0.app
2. **GitHub Repository**: https://github.com/nikhlu07/Corruptguard
3. **Demo Video**: Showing live deployment
4. **Canister IDs**: Backend and frontend canisters
5. **Internet Identity**: Ready for judge testing

---

**"From tragedy to technology - CorruptGuard now lives permanently on the blockchain."** 🛡️⛓️