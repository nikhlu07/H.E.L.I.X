#!/bin/bash

echo "🚀 H.E.L.I.X. ICP Deployment"
echo "================================"

# Check if dfx is installed
if ! command -v dfx &> /dev/null; then
    echo "❌ DFX not found. Please install DFX first:"
    echo "   Visit: https://internetcomputer.org/docs/current/developer-docs/setup/install/"
    exit 1
fi

echo "✅ DFX found: $(dfx --version)"

# Check if we're in the right directory
if [ ! -f "dfx.json" ]; then
    echo "❌ dfx.json not found. Please run this script from the project root."
    exit 1
fi

echo "✅ Project structure verified"

# Setup identity if not exists
if ! dfx identity list | grep -q "h.e.l.i.x"; then
    echo "🔐 Creating new DFX identity..."
    dfx identity new h.e.l.i.x --disable-encryption
fi

echo "🔑 Using h.e.l.i.x identity..."
dfx identity use h.e.l.i.x

echo "👤 Current identity: $(dfx identity whoami)"
echo "🔑 Principal: $(dfx identity get-principal)"

# Build frontend
echo "📦 Building frontend..."
cd frontend
npm install
npm run build
cd ..

echo "✅ Frontend built successfully"

# Check if we want to deploy to local or mainnet
echo ""
echo "🌐 Choose deployment target:"
echo "1) Local (for testing)"
echo "2) Mainnet (production)"
read -p "Enter choice (1 or 2): " choice

case $choice in
    1)
        echo "🏠 Deploying to local network..."
        dfx deploy --network local
        echo "✅ Local deployment complete!"
        echo "🌐 Your app is available at: http://localhost:4943"
        ;;
    2)
        echo "🌍 Deploying to ICP mainnet..."
        
        # Check cycles balance
        echo "💰 Checking cycles balance..."
        balance=$(dfx wallet balance --network ic 2>/dev/null || echo "0")
        echo "   Current balance: $balance cycles"
        
        if [[ $balance == "0" || $balance == "" ]]; then
            echo "⚠️  No cycles found. You may need to get free cycles:"
            echo "   Visit: https://faucet.dfinity.org/"
            echo "   Or use: dfx ledger create-canister --network ic"
        fi
        
        # Deploy to mainnet
        dfx deploy --network ic
        
        # Get canister ID
        canister_id=$(dfx canister id helix_frontend --network ic)
        echo "✅ Mainnet deployment complete!"
        echo "🌐 Your app is available at: https://$canister_id.ic0.app"
        ;;
    *)
        echo "❌ Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Test your application"
echo "   2. Check authentication flow"
echo "   3. Monitor cycles usage"
echo "   4. Share your ICP URL!"
