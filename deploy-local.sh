#!/bin/bash

echo "🚀 CorruptGuard Local Deployment"
echo "=================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Create environment files
echo "📝 Creating environment files..."

# Backend environment
cat > backend/.env << EOF
ENVIRONMENT=production
DEBUG=false
HOST=0.0.0.0
PORT=8000
ICP_CANISTER_ID=rdmx6-jaaaa-aaaah-qcaiq-cai
demo_mode=true
SECRET_KEY=your-secret-key-here-change-in-production
EOF

# Frontend environment
cat > frontend/.env.local << EOF
VITE_BACKEND_URL=http://localhost:8000
VITE_II_URL=https://identity.ic0.app
VITE_DEMO_MODE=true
VITE_DEBUG=false
EOF

echo "✅ Environment files created"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
python3 -m pip install --upgrade pip
python3 -m pip install -r requirements.txt
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo "✅ Dependencies installed"

# Build frontend
echo "🔨 Building frontend..."
cd frontend
npm run build
cd ..

echo "✅ Frontend built"

# Start backend
echo "🚀 Starting backend server..."
echo "   Backend will be available at: http://localhost:8000"
echo "   Frontend will be available at: http://localhost:5173"
echo ""
echo "📋 To start the application:"
echo "   1. Backend: python start-backend.py"
echo "   2. Frontend: cd frontend && npm run dev"
echo ""
echo "🔍 To test the deployment:"
echo "   - Backend test: python test-backend.py"
echo "   - Frontend: Open http://localhost:5173"
echo ""
echo "🎉 Local deployment setup complete!"
