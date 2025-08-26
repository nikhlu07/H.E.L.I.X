# ICP Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. **Install DFX**
- [ ] Download DFX from [dfinity.org](https://internetcomputer.org/docs/current/developer-docs/setup/install/)
- [ ] Verify installation: `dfx --version`

### 2. **Setup Identity**
- [ ] Create Internet Identity at [identity.ic0.app](https://identity.ic0.app)
- [ ] Create DFX identity: `dfx identity new corruptguard`
- [ ] Use identity: `dfx identity use corruptguard`
- [ ] Check principal: `dfx identity get-principal`

### 3. **Get Cycles**
- [ ] Visit [cycles faucet](https://faucet.dfinity.org/)
- [ ] Or use: `dfx ledger create-canister --network ic`
- [ ] Check balance: `dfx wallet balance --network ic`

### 4. **Build Frontend**
- [ ] Install dependencies: `cd frontend && npm install`
- [ ] Build for production: `npm run build`
- [ ] Verify build output in `frontend/dist/`

### 5. **Configure Environment**
- [ ] Update `VITE_BACKEND_URL` in frontend environment
- [ ] Set `VITE_II_URL=https://identity.ic0.app`
- [ ] Ensure `VITE_DEMO_MODE=true`

## 🚀 Deployment Steps

### Option 1: Full ICP Deployment
```bash
# Deploy everything to ICP
dfx deploy --network ic
```

### Option 2: Frontend Only (Recommended)
```bash
# Deploy only frontend to ICP
dfx deploy corruptguard_frontend --network ic

# Keep backend on traditional hosting (Railway/Render/Vercel)
```

## ✅ Post-Deployment Checklist

### 1. **Verify Deployment**
- [ ] Get canister ID: `dfx canister id corruptguard_frontend --network ic`
- [ ] Access app: `https://your-canister-id.ic0.app`
- [ ] Check canister status: `dfx canister status corruptguard_frontend --network ic`

### 2. **Test Functionality**
- [ ] Landing page loads correctly
- [ ] Login page accessible
- [ ] Demo mode authentication works
- [ ] ICP Identity authentication works
- [ ] Dashboard loads properly
- [ ] All buttons and links work

### 3. **Monitor Resources**
- [ ] Check cycles usage: `dfx wallet balance --network ic`
- [ ] Monitor canister performance
- [ ] Set up cycle top-ups if needed

## 🔧 Troubleshooting

### Common Issues:
- **Out of cycles**: Get free cycles from faucet
- **Build errors**: Check Node.js version and dependencies
- **Authentication issues**: Verify II_URL configuration
- **CORS errors**: Ensure backend URL is correct

### Useful Commands:
```bash
# Check DFX status
dfx ping --network ic

# View canister logs
dfx canister call corruptguard_frontend --network ic

# Update canister
dfx deploy corruptguard_frontend --network ic --upgrade-unchanged

# Delete canister (if needed)
dfx canister delete corruptguard_frontend --network ic
```

## 📞 Support

If you encounter issues:
1. Check DFX documentation
2. Verify all prerequisites are met
3. Test locally first with `dfx deploy --network local`
4. Check canister logs for errors
