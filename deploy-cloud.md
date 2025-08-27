# CorruptGuard Cloud Deployment Guide

## 🚀 Quick Deploy Options

### **Option 1: Vercel + Railway (Recommended)**

#### **Frontend (Vercel)**
1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Connect your GitHub repository
   - Set environment variables:
     ```
     VITE_BACKEND_URL=https://your-backend-url.railway.app
     VITE_II_URL=https://identity.ic0.app
     VITE_DEMO_MODE=true
     VITE_DEBUG=false
     ```
   - Deploy!

#### **Backend (Railway)**
1. **Create Railway Account:**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy Backend:**
   - Create new project
   - Connect GitHub repository
   - Set root directory to `backend`
   - Add environment variables:
     ```
     ENVIRONMENT=production
     DEBUG=false
     HOST=0.0.0.0
     PORT=8000
     ICP_CANISTER_ID=rdmx6-jaaaa-aaaah-qcaiq-cai
     demo_mode=true
     SECRET_KEY=your-secret-key-here
     ```
   - Deploy!

### **Option 2: Vercel + Render**

#### **Backend (Render)**
1. **Create Render Account:**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Deploy Backend:**
   - Create new Web Service
   - Connect GitHub repository
   - Set root directory to `backend`
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Add environment variables (same as Railway)
   - Deploy!

### **Option 3: Full Vercel Deployment**

#### **Monorepo Setup**
1. **Create `vercel.json`:**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "backend/app/main.py",
         "use": "@vercel/python"
       },
       {
         "src": "frontend/package.json",
         "use": "@vercel/static-build",
         "config": {
           "distDir": "dist"
         }
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "backend/app/main.py"
       },
       {
         "src": "/(.*)",
         "dest": "frontend/dist/$1"
       }
     ]
   }
   ```

2. **Deploy to Vercel:**
   - Connect repository
   - Set environment variables
   - Deploy!

## 🔧 Environment Configuration

### **Frontend Environment Variables**
```env
VITE_BACKEND_URL=https://your-backend-url.com
VITE_II_URL=https://identity.ic0.app
VITE_DEMO_MODE=true
VITE_DEBUG=false
```

### **Backend Environment Variables**
```env
ENVIRONMENT=production
DEBUG=false
HOST=0.0.0.0
PORT=8000
ICP_CANISTER_ID=rdmx6-jaaaa-aaaah-qcaiq-cai
demo_mode=true
SECRET_KEY=your-secret-key-here
CORS_ORIGINS=https://your-frontend-url.vercel.app
```

## 📋 Deployment Checklist

### **Pre-Deployment**
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Dependencies updated
- [ ] Build successful locally
- [ ] Database migrations (if any)

### **Post-Deployment**
- [ ] Health check endpoint working
- [ ] Authentication flow working
- [ ] API endpoints accessible
- [ ] Frontend loading correctly
- [ ] CORS configured properly

## 🚨 Troubleshooting

### **Common Issues**

1. **CORS Errors:**
   - Ensure `CORS_ORIGINS` includes your frontend URL
   - Check backend CORS configuration

2. **Environment Variables:**
   - Verify all variables are set correctly
   - Check for typos in variable names

3. **Build Failures:**
   - Check dependency versions
   - Verify Python/Node.js versions
   - Review build logs

4. **Authentication Issues:**
   - Verify backend URL is correct
   - Check token generation
   - Test with backend test script

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)
- [CorruptGuard GitHub](https://github.com/nikhlu07/Corruptguard)

## 📞 Support

If you encounter issues:
1. Check the deployment logs
2. Test locally first
3. Verify environment variables
4. Check the troubleshooting section above
