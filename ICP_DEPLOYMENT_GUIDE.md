# CorruptGuard ICP Deployment Guide

## 🚀 Deploy to Internet Computer (ICP)

### Prerequisites
1. **Install DFX**: Download from [dfinity.org](https://internetcomputer.org/docs/current/developer-docs/setup/install/)
2. **Create Internet Identity**: Visit [identity.ic0.app](https://identity.ic0.app)
3. **Get Cycles**: You'll need cycles to deploy (can get free cycles for developers)

### Quick Deploy Steps

#### 1. **Setup DFX Identity**
```bash
# Create and use a new identity
dfx identity new corruptguard
dfx identity use corruptguard

# Check your identity
dfx identity whoami
dfx identity get-principal
```

#### 2. **Build Frontend for ICP**
```bash
# Build the frontend
cd frontend
npm run build
cd ..
```

#### 3. **Deploy to ICP**
```bash
# Deploy to mainnet
dfx deploy --network ic

# Or deploy to local first for testing
dfx deploy --network local
```

#### 4. **Configure Frontend for ICP**
Update `frontend/src/services/authService.ts`:
```typescript
const II_URL = 'https://identity.ic0.app';
const BACKEND_URL = 'https://your-canister-id.ic0.app';
```

### Alternative: Deploy Frontend Only

If you want to keep your FastAPI backend separate:

#### 1. **Deploy Frontend to ICP**
```bash
# Build frontend
cd frontend
npm run build
cd ..

# Deploy only frontend canister
dfx deploy corruptguard_frontend --network ic
```

#### 2. **Update Backend URL**
Point frontend to your deployed backend (Railway/Render/Vercel):
```typescript
const BACKEND_URL = 'https://your-backend-url.com';
```

### Environment Variables for ICP

#### Frontend (.env.production)
```env
VITE_BACKEND_URL=https://your-backend-url.com
VITE_II_URL=https://identity.ic0.app
VITE_DEMO_MODE=true
VITE_DEBUG=false
```

### Deployment Commands

```bash
# Full deployment
dfx deploy --network ic

# Deploy specific canister
dfx deploy corruptguard_frontend --network ic

# Check status
dfx canister status corruptguard_frontend --network ic

# Get canister ID
dfx canister id corruptguard_frontend --network ic
```

### Post-Deployment

1. **Get your canister URL**: `https://your-canister-id.ic0.app`
2. **Test authentication**: Try both ICP Identity and Demo modes
3. **Monitor cycles**: Check cycle balance with `dfx wallet balance`

### Troubleshooting

- **Out of cycles**: Get free cycles from [cycles faucet](https://faucet.dfinity.org/)
- **Build errors**: Ensure all dependencies are installed
- **Authentication issues**: Verify II_URL is correct

### Next Steps

After deployment, your app will be live on ICP at:
`https://your-canister-id.ic0.app`
