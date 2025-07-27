# Development Environment Setup for Windows

Write-Host "🔧 Setting up ClearGov development environment..." -ForegroundColor Green

# Setup backend
Write-Host "Setting up Python backend..." -ForegroundColor Yellow
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
cd ..

# Setup frontend  
Write-Host "Setting up React frontend..." -ForegroundColor Yellow
cd frontend
npm install
cd ..

# Setup Vessel for Motoko packages (in WSL2)
Write-Host "Setting up Motoko packages..." -ForegroundColor Yellow
wsl vessel --version

Write-Host "✅ Development environment ready!" -ForegroundColor Green
Write-Host "Run 'scripts\deploy\deploy_local.ps1' to start the project" -ForegroundColor Cyan