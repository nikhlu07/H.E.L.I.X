#!/bin/bash

echo "============================================"
echo "🚀 CorruptGuard ICP Deployment Script"
echo "============================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo ""
echo "Step 1: Checking DFX installation..."
if ! command -v dfx &> /dev/null; then
    echo -e "${RED}❌ DFX not found! Please install DFX first:${NC}"
    echo "   Visit: https://internetcomputer.org/docs/current/developer-docs/setup/install/"
    echo "   Or run: sh -ci \"\$(curl -fsSL https://internetcomputer.org/install.sh)\""
    exit 1
fi
echo -e "${GREEN}✅ DFX found!${NC}"

echo ""
echo "Step 2: Starting local replica..."
dfx start --clean --background
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to start DFX replica${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Local replica started!${NC}"

echo ""
echo "Step 3: Deploying procurement canister..."
dfx deploy procurement
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to deploy canister${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Canister deployed!${NC}"

echo ""
echo "Step 4: Getting canister ID..."
CANISTER_ID=$(dfx canister id procurement)
echo "Canister ID: $CANISTER_ID"

echo ""
echo "Step 5: Updating frontend environment..."
cat > frontend/.env << EOF
# ICP Canister Configuration
REACT_APP_CANISTER_ID=$CANISTER_ID
REACT_APP_IC_HOST=http://127.0.0.1:4943
REACT_APP_DFX_NETWORK=local

# Backend Configuration (fallback)
REACT_APP_BACKEND_URL=http://127.0.0.1:8000

# Environment
NODE_ENV=development
EOF
echo -e "${GREEN}✅ Environment updated!${NC}"

echo ""
echo "Step 6: Installing frontend dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Dependencies installed!${NC}"

echo ""
echo "Step 7: Building frontend..."
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to build frontend${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Frontend built!${NC}"

cd ..

echo ""
echo "Step 8: Deploying frontend canister..."
dfx deploy frontend
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to deploy frontend canister${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Frontend canister deployed!${NC}"

echo ""
echo "============================================"
echo -e "${GREEN}🎉 DEPLOYMENT COMPLETE!${NC}"
echo "============================================"
echo ""
echo "📋 Your CorruptGuard dApp is ready:"
echo ""
echo "🔗 Frontend URL: http://127.0.0.1:4943/?canisterId=$(dfx canister id frontend)"
echo "🛡️ Procurement Canister: $CANISTER_ID"
echo "🐍 Backend API: http://127.0.0.1:8000"
echo ""
echo "🧪 To test:"
echo "1. Open: http://localhost:5173"
echo "2. Scroll to 'ICP Connection Test' section"
echo "3. Click 'Test Connection'"
echo "4. Should show 'Connected' with system stats"
echo ""
echo "📝 Next steps:"
echo "- Test all role flows (Government → Vendor → Citizen)"
echo "- Deploy to IC mainnet: dfx deploy --network ic"
echo "- Update frontend .env with mainnet canister ID"
echo ""