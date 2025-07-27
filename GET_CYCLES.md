# 💰 How to Get Cycles for Mainnet Deployment

## 🎯 You Need Cycles to Deploy on IC Mainnet

Cycles = "Gas" for Internet Computer (like ETH gas fees)

---

## 🆓 **FREE Options (Recommended):**

### **1. Cycles Faucet (Easiest)**
```bash
# Visit and claim free cycles
https://faucet.dfinity.org/

# Or use command line
dfx wallet balance --network ic
```

### **2. DFINITY Developer Grants**
- Visit: https://dfinity.org/grants
- Apply for developer program
- Get free cycles for hackathon projects

### **3. Internet Identity App**
- Download: https://identity.ic0.app/
- Some promotions give free cycles

---

## 💳 **Paid Options:**

### **1. Buy ICP Tokens**
```bash
# Buy ICP on exchanges (Coinbase, Binance, etc.)
# Transfer to your DFX wallet
# Convert ICP to cycles
dfx cycles convert 1.0 --network ic
```

### **2. NNS App**
- Visit: https://nns.ic0.app/
- Connect wallet
- Convert ICP → Cycles

---

## 🚀 **Quick Start (Free):**

### **Step 1: Get Free Cycles**
```bash
# Visit faucet
open https://faucet.dfinity.org/

# Claim free cycles for development
```

### **Step 2: Verify Balance**
```bash
dfx wallet balance --network ic
# Should show: 4.000 TC (trillion cycles)
```

### **Step 3: Deploy**
```bash
./deploy-mainnet.sh
# Now you have cycles to deploy!
```

---

## 💡 **Cost Estimation:**

- **Frontend Canister**: ~0.1 TC per month
- **Backend Canister**: ~0.2 TC per month  
- **Total for 1 year**: ~4 TC (easily covered by faucet)

**Your CorruptGuard dApp will cost practically nothing to run!**

---

## 🎯 **For Your Hackathon:**

1. **Use cycles faucet** → Get 4 TC free
2. **Deploy to mainnet** → ./deploy-mainnet.sh
3. **Get public URL** → Share with judges
4. **Costs covered** → Faucet cycles last months

**Result**: Live blockchain dApp with zero hosting costs! 🚀