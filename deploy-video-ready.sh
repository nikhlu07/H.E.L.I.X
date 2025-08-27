#!/bin/bash

echo "🎬 CorruptGuard Video-Ready Deployment"
echo "======================================"

# Check if we're in the right directory
if [ ! -f "frontend/package.json" ] || [ ! -f "backend/requirements.txt" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo "✅ Project structure verified"

# Create environment files for video recording
echo "📝 Creating video-ready environment files..."

# Frontend environment for video
cat > frontend/.env.local << EOF
VITE_BACKEND_URL=http://localhost:8000
VITE_II_URL=https://identity.ic0.app
VITE_DEMO_MODE=true
VITE_DEBUG=true
VITE_VIDEO_MODE=true
EOF

# Backend environment for video
cat > backend/.env << EOF
ENVIRONMENT=development
DEBUG=true
HOST=0.0.0.0
PORT=8000
ICP_CANISTER_ID=rdmx6-jaaaa-aaaah-qcaiq-cai
demo_mode=true
SECRET_KEY=video-demo-secret-key
EOF

echo "✅ Environment files created"

# Install dependencies
echo "📦 Installing dependencies..."

# Backend dependencies
echo "   Installing backend dependencies..."
cd backend
python3 -m pip install --upgrade pip
python3 -m pip install -r requirements.txt
cd ..

# Frontend dependencies
echo "   Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo "✅ Dependencies installed"

# Test the demo mode
echo "🧪 Testing demo mode..."
cd frontend
npm run build
cd ..

echo ""
echo "🎉 Video-ready deployment complete!"
echo ""
echo "📋 For your video recording:"
echo "   1. Start backend: python start-backend.py"
echo "   2. Start frontend: cd frontend && npm run dev"
echo "   3. Open: http://localhost:5173"
echo "   4. Click 'Get Started'"
echo "   5. Choose 'Demo Mode'"
echo "   6. Select 'Main Government' role"
echo "   7. Click 'Enter as Main Government (Demo Mode)'"
echo ""
echo "🎬 Demo Mode Features for Video:"
echo "   ✅ No ICP authentication required"
echo "   ✅ Full Main Government dashboard"
echo "   ✅ All features accessible"
echo "   ✅ Role switching works"
echo "   ✅ Professional logo displayed"
echo "   ✅ Ready for screen recording"
echo ""
echo "🔑 Cycles Faucet Coupon: 594FA-B3B89-6F436"
echo "   Visit: https://faucet.dfinity.org/"
echo ""
echo "🚀 Ready for your video!"
