#!/bin/bash

# Helix System - Quick Deployment Script
# This script helps deploy the Helix system to production

echo "🚀 Helix System Deployment Script"
echo "=================================="

# Check if we're in the right directory
if [ ! -f "dfx.json" ]; then
    echo "❌ Error: Please run this script from the Helix project root directory"
    exit 1
fi

echo "📋 Deployment Options:"
echo "1. Frontend Only (Static hosting)"
echo "2. Backend Only (API server)"
echo "3. ICP Canisters Only"
echo "4. Full System Deployment"
echo "5. Development Setup"

read -p "Choose deployment option (1-5): " choice

case $choice in
    1)
        echo "🌐 Deploying Frontend..."
        cd frontend
        
        # Install dependencies
        echo "📦 Installing dependencies..."
        npm install
        
        # Build for production
        echo "🔨 Building for production..."
        npm run build
        
        echo "✅ Frontend built successfully!"
        echo "📁 Deploy the 'dist' folder to your hosting service"
        echo "🌐 Recommended: Netlify, Vercel, or AWS S3"
        ;;
        
    2)
        echo "🐍 Deploying Backend..."
        cd backend
        
        # Check Python version
        python_version=$(python3 --version 2>&1 | grep -o '[0-9]\+\.[0-9]\+')
        echo "🐍 Python version: $python_version"
        
        # Install dependencies
        echo "📦 Installing dependencies..."
        pip install -r requirements.txt
        
        # Run database migrations
        echo "🗄️ Running database migrations..."
        alembic upgrade head
        
        echo "✅ Backend setup complete!"
        echo "🚀 Start with: gunicorn -w 4 -k uvicorn.workers.UvicornWorker demo_api:app"
        ;;
        
    3)
        echo "⛓️ Deploying ICP Canisters..."
        
        # Check if DFX is installed
        if ! command -v dfx &> /dev/null; then
            echo "❌ DFX not found. Installing..."
            sh -ci "$(curl -fsSL https://sdk.dfinity.org/install.sh)"
        fi
        
        # Start local replica for testing
        echo "🔄 Starting local ICP replica..."
        dfx start --background
        
        # Deploy canisters
        echo "📦 Deploying canisters..."
        dfx deploy
        
        echo "✅ Canisters deployed successfully!"
        dfx canister id --all
        ;;
        
    4)
        echo "🎯 Full System Deployment"
        echo "========================"
        
        # Frontend
        echo "🌐 Building Frontend..."
        cd frontend
        npm install && npm run build
        cd ..
        
        # Backend
        echo "🐍 Setting up Backend..."
        cd backend
        pip install -r requirements.txt
        cd ..
        
        # ICP Canisters
        echo "⛓️ Deploying Canisters..."
        if command -v dfx &> /dev/null; then
            dfx start --background
            dfx deploy
        else
            echo "⚠️ DFX not found. Skipping canister deployment."
        fi
        
        echo "✅ Full system deployment complete!"
        echo "📋 Next steps:"
        echo "   1. Deploy frontend 'dist' folder to hosting service"
        echo "   2. Deploy backend to cloud server"
        echo "   3. Configure environment variables"
        echo "   4. Set up domain and SSL certificates"
        ;;
        
    5)
        echo "🛠️ Development Setup"
        echo "===================="
        
        # Frontend setup
        echo "🌐 Setting up Frontend..."
        cd frontend
        npm install
        echo "✅ Frontend dependencies installed"
        cd ..
        
        # Backend setup
        echo "🐍 Setting up Backend..."
        cd backend
        pip install -r requirements.txt
        echo "✅ Backend dependencies installed"
        cd ..
        
        # ICP setup
        echo "⛓️ Setting up ICP..."
        if command -v dfx &> /dev/null; then
            dfx start --background
            dfx deploy
            echo "✅ ICP canisters deployed locally"
        else
            echo "⚠️ DFX not found. Install from: https://sdk.dfinity.org/docs/quickstart/local-quickstart.html"
        fi
        
        echo "🎉 Development setup complete!"
        echo "🚀 Start development servers:"
        echo "   Frontend: cd frontend && npm run dev"
        echo "   Backend: cd backend && python demo_api.py"
        ;;
        
    *)
        echo "❌ Invalid option. Please choose 1-5."
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment script completed!"
echo "📚 For detailed instructions, see DEPLOYMENT_GUIDE.md"
