#!/bin/bash

echo "🚀 CorruptGuard Quick Deployment"
echo "================================"

# Check if we're in the right directory
if [ ! -f "frontend/package.json" ] || [ ! -f "backend/requirements.txt" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo "✅ Project structure verified"

# Fix import issues
echo "🔧 Fixing import issues..."

# Ensure AuthService is exported
if ! grep -q "export { AuthService };" frontend/src/services/authService.ts; then
    echo "   Adding AuthService export..."
    sed -i 's|// Export singleton instance|// Export the class and singleton instance\nexport { AuthService };|' frontend/src/services/authService.ts
fi

echo "✅ Import issues fixed"

# Create environment files
echo "📝 Creating environment files..."

# Frontend environment
cat > frontend/.env.local << EOF
VITE_BACKEND_URL=http://localhost:8000
VITE_II_URL=https://identity.ic0.app
VITE_DEMO_MODE=true
VITE_DEBUG=false
EOF

# Backend environment
cat > backend/.env << EOF
ENVIRONMENT=development
DEBUG=true
HOST=0.0.0.0
PORT=8000
ICP_CANISTER_ID=rdmx6-jaaaa-aaaah-qcaiq-cai
demo_mode=true
SECRET_KEY=dev-secret-key-change-in-production
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

# Test imports
echo "🧪 Testing imports..."
cd frontend
npm run build 2>&1 | head -20
cd ..

echo ""
echo "🎉 Quick deployment setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Start backend: python start-backend.py"
echo "   2. Start frontend: cd frontend && npm run dev"
echo "   3. Test backend: python test-backend.py"
echo "   4. Open frontend: http://localhost:5173"
echo ""
echo "🔍 If you see import errors, check:"
echo "   - All TypeScript files compile correctly"
echo "   - All exports are properly defined"
echo "   - No circular dependencies"
echo ""
echo "�� Ready to deploy!"
