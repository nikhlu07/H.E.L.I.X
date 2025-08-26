# CorruptGuard Functionality Implementation Guide

## Overview
This document outlines the complete functionality implementation that connects the frontend with the backend and ICP blockchain integration.

## 🚀 Quick Start

### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Start the backend server
python ../start-backend.py
```

### 2. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
echo "VITE_BACKEND_URL=http://localhost:8000" > .env.local

# Start the frontend
npm run dev
```

## 🔧 Implementation Details

### Backend Integration

#### 1. **CorruptGuard Service** (`frontend/src/services/corruptGuardService.ts`)
- **Purpose**: Central service handling all backend API calls and ICP integration
- **Features**:
  - Authentication (ICP + Demo modes)
  - Fraud detection API calls
  - ICP canister interactions
  - User management
  - Health checks

#### 2. **API Client** (`frontend/src/services/api.ts`)
- **Purpose**: HTTP client for backend communication
- **Features**:
  - Automatic authentication header injection
  - Error handling
  - Request/response formatting
  - Token management

#### 3. **Authentication Service** (`frontend/src/services/authService.ts`)
- **Purpose**: Internet Identity and demo authentication
- **Features**:
  - ICP WebAuthn integration
  - Demo token management
  - User session handling

### Frontend Integration

#### 1. **App Component** (`frontend/src/App.tsx`)
- **Updated**: Now uses CorruptGuard service for authentication
- **Features**:
  - Service initialization
  - Authentication state management
  - Dashboard routing based on user role
  - Loading states

#### 2. **Login Page** (`frontend/src/components/Auth/LoginPage.tsx`)
- **Updated**: Integrated with CorruptGuard service
- **Features**:
  - ICP authentication flow
  - Demo authentication flow
  - Error handling
  - Loading states
  - Role selection

#### 3. **Header Component** (`frontend/src/components/Dashboard/Header.tsx`)
- **Updated**: Works with new service-based authentication
- **Features**:
  - User information display
  - Role switching (demo mode)
  - Logout functionality
  - Sector badges

## 🔐 Authentication Flow

### ICP Authentication
1. User clicks "Internet Computer Identity"
2. Service initializes ICP AuthClient
3. User authenticates via WebAuthn
4. Backend validates principal and issues token
5. Frontend stores token and redirects to dashboard

### Demo Authentication
1. User clicks "Demo Mode"
2. User selects government role
3. Service calls backend demo login endpoint
4. Backend issues demo token
5. Frontend stores token and redirects to dashboard

## 📊 API Endpoints

### Authentication
- `POST /auth/demo-login/{role}` - Demo authentication
- `POST /auth/logout` - Logout
- `GET /auth/profile` - Get user profile

### Fraud Detection
- `POST /api/v1/fraud/detect` - Detect fraud in claims
- `GET /api/v1/fraud/history` - Get fraud detection history

### ICP Canister
- `GET /api/v1/icp/claims` - Get all claims
- `GET /api/v1/icp/claims/{id}` - Get specific claim
- `POST /api/v1/icp/claims` - Submit new claim
- `GET /api/v1/icp/budgets` - Get budgets
- `GET /api/v1/icp/fraud-alerts` - Get fraud alerts
- `GET /api/v1/icp/stats` - Get system statistics

### Demo Features
- `POST /api/v1/demo/generate-test-scenario` - Generate test scenarios
- `GET /api/v1/demo/fraud-patterns` - Get fraud patterns

### Health
- `GET /health` - Health check
- `GET /` - Root endpoint with system info

## 🏗️ Backend Architecture

### Main Application (`backend/app/main.py`)
- **FastAPI application** with CORS middleware
- **Fraud detection engine** with ML models
- **ICP canister integration** via agent
- **Authentication middleware** for route protection
- **Demo endpoints** for testing

### ICP Integration (`backend/app/icp/`)
- **Canister calls** (`canister_calls.py`) - Main ICP interaction service
- **Agent management** (`agent.py`) - HTTP agent for ICP network
- **Principal authentication** - WebAuthn integration

### Authentication (`backend/app/auth/`)
- **Middleware** - Route protection
- **Principal auth** - ICP principal validation
- **Demo auth** - Demo token generation

## 🔄 Data Flow

### Fraud Detection Flow
1. **Frontend**: User submits claim data
2. **Service**: Calls `/api/v1/fraud/detect`
3. **Backend**: Processes with ML models
4. **Backend**: Returns fraud score and flags
5. **Frontend**: Displays results

### ICP Integration Flow
1. **Frontend**: User authenticates with ICP
2. **Backend**: Validates principal
3. **Backend**: Issues access token
4. **Frontend**: Uses token for API calls
5. **Backend**: Validates token on each request

## 🛠️ Development Commands

### Backend
```bash
# Start backend server
python start-backend.py

# Run tests
cd backend && python -m pytest

# Check health
curl http://localhost:8000/health
```

### Frontend
```bash
# Start development server
cd frontend && npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## 🔍 Testing the Integration

### 1. Health Check
```bash
curl http://localhost:8000/health
```

### 2. Demo Login
```bash
curl -X POST http://localhost:8000/auth/demo-login/main_government \
  -H "Content-Type: application/json"
```

### 3. Fraud Detection
```bash
curl -X POST http://localhost:8000/api/v1/fraud/detect \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "claim_id": 1,
    "vendor_id": "vendor_001",
    "amount": 50000,
    "budget_id": 1,
    "allocation_id": 1,
    "invoice_hash": "abc123",
    "deputy_id": "deputy_001",
    "area": "construction"
  }'
```

## 🚨 Troubleshooting

### Common Issues

1. **Backend not starting**
   - Check Python dependencies: `pip install -r requirements.txt`
   - Verify port 8000 is available
   - Check environment variables

2. **Frontend can't connect to backend**
   - Verify backend is running on `http://localhost:8000`
   - Check CORS settings in backend
   - Verify `.env.local` file exists

3. **ICP authentication failing**
   - Check Internet Identity service availability
   - Verify canister ID configuration
   - Check browser WebAuthn support

4. **Demo authentication failing**
   - Check backend demo endpoints are enabled
   - Verify role names match backend expectations
   - Check token storage in localStorage

### Debug Mode
Set `VITE_DEBUG=true` in frontend environment to enable detailed logging.

## 📈 Next Steps

1. **Deploy to ICP Mainnet**
   - Deploy canister to mainnet
   - Update canister ID in configuration
   - Test with real Internet Identity

2. **Production Deployment**
   - Set up production environment variables
   - Configure proper CORS settings
   - Set up monitoring and logging

3. **Advanced Features**
   - Real-time fraud alerts
   - Advanced ML models
   - Multi-sector support
   - Mobile app integration

## 🔗 Useful Links

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Internet Computer Documentation](https://internetcomputer.org/docs)
- [Internet Identity](https://identity.ic0.app/)
- [CorruptGuard GitHub Repository](https://github.com/nikhlu07/Corruptguard)
