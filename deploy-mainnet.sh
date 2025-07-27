#!/bin/bash

echo "============================================"
echo "🌐 CorruptGuard MAINNET Deployment"
echo "============================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo -e "${BLUE}🚀 Deploying directly to Internet Computer Mainnet...${NC}"
echo -e "${YELLOW}⚠️  This will create LIVE canisters accessible worldwide!${NC}"
echo ""

echo "Step 1: Checking DFX..."
if ! command -v dfx &> /dev/null; then
    echo -e "${RED}❌ DFX not found! Please install DFX first.${NC}"
    echo "Visit: https://internetcomputer.org/docs/current/developer-docs/setup/install/"
    exit 1
fi
echo -e "${GREEN}✅ DFX found!${NC}"

echo ""
echo "Step 2: Creating identity (if needed)..."
if ! dfx identity whoami &> /dev/null; then
    echo "Creating new identity..."
    dfx identity new default
    dfx identity use default
fi

echo ""
echo "Step 3: Checking cycles balance..."
if ! dfx wallet balance --network ic &> /dev/null; then
    echo -e "${YELLOW}⚠️  You need ICP tokens to deploy to mainnet.${NC}"
    echo ""
    echo -e "${BLUE}💡 Options:${NC}"
    echo "1. Get free cycles from dfinity.org/grants"
    echo "2. Convert ICP to cycles in NNS app"
    echo "3. Use cycles faucet (if available)"
    echo ""
    echo -e "${BLUE}🔗 Get cycles: https://faucet.dfinity.org/${NC}"
    read -p "Press Enter to continue when you have cycles..."
fi

echo ""
echo "Step 4: Deploying procurement canister to MAINNET..."
if ! dfx deploy procurement --network ic; then
    echo -e "${RED}❌ Failed to deploy procurement canister${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Procurement canister deployed to mainnet!${NC}"

echo ""
echo "Step 5: Building frontend..."
cd frontend
if ! npm run build; then
    echo -e "${RED}❌ Failed to build frontend${NC}"
    exit 1
fi
cd ..

echo ""
echo "Step 6: Deploying frontend canister to MAINNET..."
if ! dfx deploy frontend --network ic; then
    echo -e "${RED}❌ Failed to deploy frontend canister${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Frontend canister deployed to mainnet!${NC}"

echo ""
echo "Step 7: Getting your LIVE canister IDs..."
PROCUREMENT_ID=$(dfx canister id procurement --network ic)
FRONTEND_ID=$(dfx canister id frontend --network ic)

echo ""
echo "============================================"
echo -e "${GREEN}🎉 LIVE ON MAINNET! Your URLs:${NC}"
echo "============================================"
echo ""
echo -e "${BLUE}🌐 LIVE FRONTEND (Share this URL):${NC}"
echo -e "${GREEN}   https://$FRONTEND_ID.ic0.app${NC}"
echo ""
echo -e "${BLUE}🛡️ PROCUREMENT CANISTER:${NC}"
echo -e "${GREEN}   https://$PROCUREMENT_ID.ic0.app${NC}"
echo ""
echo -e "${BLUE}📊 CANDID INTERFACE (for testing):${NC}"
echo -e "${GREEN}   https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.ic0.app/?id=$PROCUREMENT_ID${NC}"
echo ""
echo -e "${YELLOW}📋 FOR DORAHACKS SUBMISSION:${NC}"
echo "   Frontend Canister ID: $FRONTEND_ID"
echo "   Backend Canister ID: $PROCUREMENT_ID"
echo "   Live Demo URL: https://$FRONTEND_ID.ic0.app"
echo ""
echo -e "${GREEN}🎯 Your CorruptGuard dApp is now LIVE on the blockchain!${NC}"
echo -e "${GREEN}🌍 Anyone worldwide can access it at the URLs above!${NC}"
echo ""