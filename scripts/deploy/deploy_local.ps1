# ClearGov Local Deployment Script for Windows

Write-Host "🚀 Starting ClearGov Local Deployment..." -ForegroundColor Green

# Start DFX in WSL2
Write-Host "Starting DFX local replica..." -ForegroundColor Yellow
wsl dfx start --clean --background

# Deploy canisters
Write-Host "Deploying canisters..." -ForegroundColor Yellow  
wsl dfx deploy

# Start fraud detection backend
Write-Host "Starting fraud detection backend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-Command cd backend; venv\Scripts\activate; python -m app.main"

# Start frontend development server
Write-Host "Starting frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-Command cd frontend; npm run dev"

Write-Host "✅ ClearGov deployed successfully!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Backend API: http://localhost:8080" -ForegroundColor Cyan
Write-Host "DFX Dashboard: http://localhost:8000" -ForegroundColor Cyan