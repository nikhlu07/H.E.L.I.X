#!/bin/bash

# CorruptGuard Fraud Detection Engine Startup Script

echo "🤖 Starting CorruptGuard Fraud Detection Engine..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install requirements
echo "Installing dependencies..."
pip install -r requirements.txt

# Create models directory
mkdir -p models

# Start the fraud detection engine
echo "🚀 Launching fraud detection engine on port 8080..."
python main.py

echo "✅ Fraud Detection Engine ready at http://localhost:8080"