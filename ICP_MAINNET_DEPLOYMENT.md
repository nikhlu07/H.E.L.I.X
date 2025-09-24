# ICP Mainnet Deployment Guide for Helix System

## 🎯 **Step-by-Step ICP Mainnet Deployment**

### **Prerequisites:**
- ✅ Coupon code for ICP cycles
- ✅ Internet Identity wallet
- ✅ DFX SDK installed
- ✅ Helix canisters ready

---

## **Step 1: Install DFX SDK**

### **For Windows (PowerShell):**
```powershell
# Install DFX using the official installer
Invoke-WebRequest -Uri "https://sdk.dfinity.org/install.sh" -OutFile "install.sh"
bash install.sh
```

### **Alternative (WSL/Linux):**
```bash
sh -ci "$(curl -fsSL https://sdk.dfinity.org/install.sh)"
```

### **Verify Installation:**
```bash
dfx --version
# Should show: dfx 0.15.x or newer
```

---

## **Step 2: Set Up Internet Identity**

### **Create/Use Your Internet Identity:**
1. Go to **https://identity.ic0.app**
2. Create new identity or use existing
3. **Save your anchor number** (you'll need this)
4. **Download recovery phrase** (CRITICAL - don't lose this!)

---

## **Step 3: Configure DFX for Mainnet**

### **Set Identity:**
```bash
# Use your Internet Identity
dfx identity use default

# Or create new identity for deployment
dfx identity new deployment
dfx identity use deployment
```

### **Get Your Principal ID:**
```bash
dfx identity get-principal
# Save this - it's your canister controller
```

---

## **Step 4: Redeem Your Coupon Code**

### **Option A: Through NNS App**
1. Go to **https://nns.ic0.app**
2. Login with Internet Identity
3. Go to **"Canisters"** → **"Create Canister"**
4. Click **"Redeem Coupon"**
5. Enter your coupon code
6. Confirm cycles are added to your account

### **Option B: Through DFX**
```bash
# If you have cycles wallet
dfx wallet redeem-faucet-coupon YOUR_COUPON_CODE
```

---

## **Step 5: Prepare Helix Canisters**

### **Update dfx.json for Mainnet:**
```json
{
  "version": 1,
  "canisters": {
    "helix_backend": {
      "type": "motoko",
      "main": "canisters/backend/main.mo"
    },
    "helix_frontend": {
      "type": "assets",
      "source": ["frontend/dist"]
    }
  },
  "networks": {
    "ic": {
      "providers": ["https://ic0.app"],
      "type": "persistent"
    }
  }
}
```

### **Build Frontend for Production:**
```bash
cd frontend
npm run build
cd ..
```

---

## **Step 6: Deploy to Mainnet**

### **Deploy All Canisters:**
```bash
# Deploy to IC mainnet
dfx deploy --network ic

# Or deploy specific canister
dfx deploy helix_backend --network ic
dfx deploy helix_frontend --network ic
```

### **Monitor Deployment:**
```bash
# Check canister status
dfx canister status --network ic --all

# Get canister IDs
dfx canister id helix_backend --network ic
dfx canister id helix_frontend --network ic
```

---

## **Step 7: Configure Frontend for Mainnet**

### **Update Environment Variables:**
```bash
# frontend/.env.production
VITE_DFX_NETWORK=ic
VITE_BACKEND_CANISTER_ID=your-backend-canister-id
VITE_FRONTEND_CANISTER_ID=your-frontend-canister-id
VITE_INTERNET_IDENTITY_URL=https://identity.ic0.app
```

### **Rebuild and Redeploy Frontend:**
```bash
cd frontend
npm run build
cd ..
dfx deploy helix_frontend --network ic
```

---

## **Step 8: Verify Deployment**

### **Test Your Canisters:**
```bash
# Get canister URLs
echo "Backend: https://$(dfx canister id helix_backend --network ic).ic0.app"
echo "Frontend: https://$(dfx canister id helix_frontend --network ic).ic0.app"
```

### **Test Functionality:**
1. **Visit frontend URL**
2. **Test Internet Identity login**
3. **Create transactions**
4. **Verify hierarchical data flow**

---

## **Step 9: Set Up Custom Domain (Optional)**

### **Configure Custom Domain:**
1. **Add CNAME record:**
   ```
   helix.yourdomain.com → your-frontend-canister-id.ic0.app
   ```

2. **Update canister settings:**
   ```bash
   dfx canister call helix_frontend set_custom_domain '("helix.yourdomain.com")'
   ```

---

## **Step 10: Monitor and Maintain**

### **Check Cycles Balance:**
```bash
dfx canister status --network ic helix_backend
dfx canister status --network ic helix_frontend
```

### **Top Up Cycles (when needed):**
```bash
dfx canister deposit-cycles 1000000000000 helix_backend --network ic
```

---

## **🎉 Expected Results:**

After successful deployment:

✅ **Backend Canister**: `https://your-backend-id.ic0.app`
✅ **Frontend Canister**: `https://your-frontend-id.ic0.app`
✅ **Internet Identity**: Working authentication
✅ **Hierarchical Data Flow**: Government → State → Deputy
✅ **Real Blockchain Storage**: All data on ICP mainnet

---

## **💰 Cycles Cost Estimate:**

- **Initial Deployment**: ~1-2T cycles (~$1-2)
- **Monthly Operation**: ~500B cycles (~$0.50)
- **With Coupon**: Should cover 6-12 months

---

## **🚨 Important Notes:**

1. **Save your canister IDs** - you'll need them
2. **Backup your identity** - recovery phrase is critical
3. **Monitor cycles** - canisters stop if they run out
4. **Test thoroughly** - mainnet deployment is permanent

**Ready to deploy? Let's start with installing DFX!** 🚀
