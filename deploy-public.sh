#!/bin/bash

echo "============================================"
echo "🌐 CorruptGuard PUBLIC Deployment Script"
echo "============================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "Step 1: Deploying to IC Mainnet..."
dfx deploy --network ic
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to deploy to mainnet${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Deployed to IC Mainnet!${NC}"

echo ""
echo "Step 2: Getting mainnet canister IDs..."
PROCUREMENT_CANISTER_ID=$(dfx canister id procurement --network ic)
FRONTEND_CANISTER_ID=$(dfx canister id frontend --network ic)

echo -e "${BLUE}Procurement Canister ID: $PROCUREMENT_CANISTER_ID${NC}"
echo -e "${BLUE}Frontend Canister ID: $FRONTEND_CANISTER_ID${NC}"

echo ""
echo "Step 3: Updating frontend for mainnet..."
cat > frontend/.env << EOF
# ICP Mainnet Configuration
REACT_APP_CANISTER_ID=$PROCUREMENT_CANISTER_ID
REACT_APP_IC_HOST=https://ic0.app
REACT_APP_DFX_NETWORK=ic

# Backend Configuration (fallback)
REACT_APP_BACKEND_URL=http://127.0.0.1:8000

# Environment
NODE_ENV=production
EOF

echo -e "${GREEN}✅ Environment updated for mainnet!${NC}"

echo ""
echo "Step 4: Rebuilding frontend for mainnet..."
cd frontend
npm run build
cd ..

echo ""
echo "Step 5: Redeploying frontend to mainnet..."
dfx deploy frontend --network ic
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to redeploy frontend${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Frontend redeployed to mainnet!${NC}"

echo ""
echo "============================================"
echo -e "${GREEN}🎉 PUBLIC DEPLOYMENT COMPLETE!${NC}"
echo "============================================"
echo ""
echo -e "${YELLOW}📋 Your CorruptGuard dApp is now LIVE on the Internet Computer:${NC}"
echo ""
echo -e "${BLUE}🌐 PUBLIC FRONTEND URL:${NC}"
echo -e "${GREEN}   https://$FRONTEND_CANISTER_ID.ic0.app${NC}"
echo ""
echo -e "${BLUE}🛡️ PROCUREMENT CANISTER:${NC}"
echo -e "${GREEN}   https://$PROCUREMENT_CANISTER_ID.ic0.app${NC}"
echo ""
echo -e "${BLUE}📊 CANDID UI (Canister Interface):${NC}"
echo -e "${GREEN}   https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.ic0.app/?id=$PROCUREMENT_CANISTER_ID${NC}"
echo ""
echo -e "${YELLOW}🔗 Share these URLs with judges, users, and demo audiences!${NC}"
echo -e "${YELLOW}💡 The dApp is now accessible worldwide on the blockchain!${NC}"
echo ""
echo -e "${BLUE}📝 For your DoraHacks submission:${NC}"
echo "- Frontend Canister ID: $FRONTEND_CANISTER_ID"
echo "- Backend Canister ID: $PROCUREMENT_CANISTER_ID"
echo "- Live Demo URL: https://$FRONTEND_CANISTER_ID.ic0.app"
echo ""