# 🌐 CorruptGuard Public URL Deployment Guide

## 🎯 Get Your Public URLs in 3 Ways:

### **Option 1: IC Mainnet (Recommended for Hackathon)**
**Best for**: Demo presentations, judge evaluations, permanent hosting

```bash
# Deploy to mainnet
./deploy-public.sh

# Your URLs will be:
# 🌐 Frontend: https://YOUR_FRONTEND_CANISTER_ID.ic0.app
# 🛡️ Backend: https://YOUR_BACKEND_CANISTER_ID.ic0.app
# 📊 Candid UI: https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.ic0.app/?id=YOUR_BACKEND_ID
```

**Benefits:**
✅ Completely decentralized on blockchain  
✅ No hosting costs  
✅ Permanent URLs  
✅ Judge/investor accessible  
✅ True web3 deployment  

---

### **Option 2: Vercel/Netlify Frontend + ICP Backend**
**Best for**: Fast frontend deployment, keeping canister backend

```bash
# 1. Build frontend
cd frontend
npm run build

# 2. Deploy to Vercel
npm install -g vercel
vercel

# 3. Deploy backend canister to IC
dfx deploy procurement --network ic

# Your URLs:
# 🌐 Frontend: https://corruptguard.vercel.app
# 🛡️ Backend: https://YOUR_CANISTER_ID.ic0.app
```

---

### **Option 3: Railway/Render for Full Stack**
**Best for**: Traditional deployment, easier debugging

```bash
# Deploy both frontend and Python backend to cloud
# Connect to IC canister for blockchain features
```

---

## 🚀 **Recommended: IC Mainnet Deployment**

### **Step 1: Run the Public Deployment**
```bash
cd /path/to/cleargov-fraud-detection
./deploy-public.sh
```

### **Step 2: Get Your URLs**
After deployment, you'll get:

**📱 Frontend URL (Public Access):**
```
https://frontend_canister_id.ic0.app
```

**🔧 Backend API (Blockchain):**
```
https://procurement_canister_id.ic0.app
```

**🧪 Candid Interface (Testing):**
```
https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.ic0.app/?id=procurement_canister_id
```

### **Step 3: Share with Anyone**
✅ Send URL to judges  
✅ Post on social media  
✅ Add to DoraHacks submission  
✅ Demo live to investors  
✅ Works on any device/browser  

---

## 📋 **For DoraHacks Submission:**

```markdown
🔗 **Live Demo URL**: https://your_frontend_id.ic0.app
🛡️ **Canister ID**: your_procurement_id
🌐 **Network**: Internet Computer Mainnet
📊 **Candid UI**: https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.ic0.app/?id=your_id

## Test the dApp:
1. Visit the live URL above
2. Try different roles: Government → State → Deputy → Vendor → Citizen
3. Upload invoices, run fraud detection, view transparency data
4. All data stored on ICP blockchain permanently
```

---

## 🎯 **Quick Deploy Commands:**

### **For Local Testing:**
```bash
./deploy.sh
# Access: http://localhost:5173
```

### **For Public Demo:**
```bash
./deploy-public.sh
# Access: https://YOUR_ID.ic0.app
```

---

## 💡 **Pro Tips:**

1. **Custom Domain**: You can point your own domain to the IC canister
2. **SSL**: All IC URLs come with HTTPS automatically
3. **Global CDN**: IC provides worldwide fast access
4. **No Maintenance**: Blockchain hosting means no server management
5. **Cost**: Extremely low cost compared to traditional hosting

---

## 🌟 **Demo Flow for Public URL:**

1. **Share URL** → Judges open in browser
2. **No installation** → Works immediately 
3. **Full functionality** → All features live
4. **Real blockchain** → Data actually stored on ICP
5. **Live fraud detection** → AI working in real-time

Your CorruptGuard dApp will be **truly live on the blockchain** with a public URL anyone can access! 🚀