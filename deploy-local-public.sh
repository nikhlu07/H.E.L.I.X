#!/bin/bash

echo "============================================"
echo "🚀 CorruptGuard LOCAL Deployment with PUBLIC Access"
echo "============================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo -e "${BLUE}🎯 Strategy: Deploy locally + use ngrok for public access${NC}"
echo ""

echo "Step 1: Installing DFX (if needed)..."
if ! command -v dfx &> /dev/null; then
    echo "Installing DFX..."
    sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
    source ~/.bashrc
fi
echo -e "${GREEN}✅ DFX ready!${NC}"

echo ""
echo "Step 2: Starting local replica..."
dfx start --clean --background
echo -e "${GREEN}✅ Local IC network running!${NC}"

echo ""
echo "Step 3: Deploying procurement canister..."
dfx deploy procurement
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to deploy canister${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Procurement canister deployed!${NC}"

echo ""
echo "Step 4: Building frontend..."
cd frontend
npm run build
cd ..
echo -e "${GREEN}✅ Frontend built!${NC}"

echo ""
echo "Step 5: Deploying frontend canister..."
dfx deploy frontend
echo -e "${GREEN}✅ Frontend canister deployed!${NC}"

echo ""
echo "Step 6: Getting canister IDs..."
PROCUREMENT_ID=$(dfx canister id procurement)
FRONTEND_ID=$(dfx canister id frontend)

echo ""
echo "Step 7: Setting up public access with ngrok..."
echo -e "${YELLOW}📥 Installing ngrok for public URLs...${NC}"

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "Please install ngrok:"
    echo "1. Visit: https://ngrok.com/download"
    echo "2. Create free account"
    echo "3. Download and install ngrok"
    echo "4. Run: ngrok authtoken YOUR_TOKEN"
    echo ""
    echo "Or for Ubuntu/Debian:"
    echo "curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null && echo 'deb https://ngrok-agent.s3.amazonaws.com buster main' | sudo tee /etc/apt/sources.list.d/ngrok.list && sudo apt update && sudo apt install ngrok"
    echo ""
    read -p "Press Enter after installing ngrok..."
fi

echo ""
echo "Step 8: Creating public tunnel..."
echo -e "${BLUE}🌐 Starting ngrok tunnel for public access...${NC}"

# Start ngrok in background for local dfx
nohup ngrok http 4943 > ngrok.log 2>&1 &
sleep 3

# Get ngrok URL
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | jq -r '.tunnels[0].public_url')

echo ""
echo "============================================"
echo -e "${GREEN}🎉 YOUR PUBLIC URLS ARE READY!${NC}"
echo "============================================"
echo ""
echo -e "${BLUE}🌐 PUBLIC FRONTEND ACCESS:${NC}"
echo -e "${GREEN}   $NGROK_URL/?canisterId=$FRONTEND_ID${NC}"
echo ""
echo -e "${BLUE}🛡️ PROCUREMENT CANISTER:${NC}"
echo -e "${GREEN}   $NGROK_URL/?canisterId=$PROCUREMENT_ID${NC}"
echo ""
echo -e "${BLUE}📊 CANDID INTERFACE:${NC}"
echo -e "${GREEN}   $NGROK_URL/api/v2/canister/$PROCUREMENT_ID/call${NC}"
echo ""
echo -e "${YELLOW}📋 FOR DORAHACKS SUBMISSION:${NC}"
echo "   Live Demo URL: $NGROK_URL/?canisterId=$FRONTEND_ID"
echo "   Frontend Canister ID: $FRONTEND_ID"
echo "   Backend Canister ID: $PROCUREMENT_ID"
echo "   Network: Local IC (via ngrok tunnel)"
echo ""
echo -e "${GREEN}🎯 Share the public URL with judges - it's accessible worldwide!${NC}"
echo -e "${YELLOW}⚠️  Keep this terminal open to maintain the public tunnel${NC}"
echo ""

# Keep ngrok running
echo "Press Ctrl+C to stop the public tunnel"
tail -f ngrok.log