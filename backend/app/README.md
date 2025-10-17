# Backend Application (`app/`)

## Overview

This directory contains the core FastAPI application for H.E.L.I.X., implementing the backend services for AI-powered fraud detection, blockchain integration, and multi-role authentication. It serves as the central hub connecting the frontend, fraud detection engines, and Internet Computer Protocol (ICP) blockchain.

## Purpose

The `app/` directory organizes the backend into modular, maintainable components following clean architecture principles. It provides:

- RESTful API endpoints for all user roles (Government, State Head, Deputy, Vendor, Sub-Supplier, Citizen)
- Advanced fraud detection using hybrid rules engine + LLM analysis
- Internet Identity authentication and role-based access control (RBAC)
- ICP blockchain integration for immutable audit trails
- Real-time transaction analysis and fraud alerting

## Contents

### Files

- **main.py** - Production FastAPI application with full ICP integration, advanced fraud detection (rules + ML), and complete authentication system
- **main-demo.py** - Lightweight demo version without ICP dependencies for quick testing and demonstrations
- **main-simple.py** - Simplified version with JWT authentication and simulated ICP integration for development
- **__init__.py** - Python package initialization (currently empty)

### Subdirectories

- **api/** - API endpoint routers organized by user role (auth, citizen, deputy, fraud, government, vendor)
- **auth/** - Authentication system including Internet Identity integration, RBAC, and middleware
- **autonomous_fraud_engine/** - Advanced autonomous fraud detection engine with self-healing and continuous learning capabilities
- **config/** - Application configuration management and settings
- **database/** - Database models, schemas, and connection management
- **fraud/** - Core fraud detection logic and pattern analysis
- **fraud_engine/** - Standalone fraud detection service with hybrid rules + LLM approach
- **icp/** - Internet Computer Protocol integration (agent configuration, canister calls)
- **middleware/** - Request/response middleware for authentication, logging, and rate limiting
- **schemas/** - Pydantic data models for request/response validation
- **services/** - Business logic services for fraud analysis, user management, and blockchain operations
- **utils/** - Utility functions for logging, exceptions, and helper operations

## Architecture Context

The `app/` directory implements the backend layer of H.E.L.I.X.'s three-tier architecture:

```
Frontend (React) → Backend (FastAPI) → Blockchain (ICP)
                         ↓
                  Fraud Detection
                  (Rules + LLM)
```

### Data Flow

1. **Authentication**: User authenticates via Internet Identity → JWT token issued → Role-based permissions enforced
2. **Transaction Submission**: Frontend sends transaction → API validates → Fraud engine analyzes → Blockchain records
3. **Fraud Detection**: Transaction data → Rules engine (10 patterns) → LLM analysis (Gemma3) → Risk score → Alert if needed
4. **Blockchain Integration**: Transaction approved → Canister call → Immutable record → Public audit trail

### Integration Points

- **Frontend**: Exposes RESTful APIs consumed by React application
- **Fraud Engines**: Orchestrates both `fraud/` (core) and `fraud_engine/` (standalone service)
- **ICP Blockchain**: Communicates with Motoko canisters for data persistence
- **Database**: Stores fraud analysis results, audit logs, and user sessions

## Key Concepts

### Multiple Application Modes

H.E.L.I.X. provides three FastAPI application variants:

1. **main.py (Production)**: Full-featured with ICP integration, advanced ML fraud detection, and complete authentication
2. **main-demo.py (Demo)**: Minimal dependencies, perfect for presentations and quick testing
3. **main-simple.py (Development)**: JWT-based auth with simulated ICP for local development

### Fraud Detection Architecture

The application implements a **hybrid fraud detection approach**:

- **Rules Engine**: Deterministic pattern matching (10 fraud patterns)
- **ML Detector**: Isolation Forest anomaly detection
- **LLM Analysis**: Gemma3 model for context-aware reasoning
- **Combined Scoring**: Weighted average (70% rules, 30% ML)

### Role-Based Access Control (RBAC)

Six distinct user roles with hierarchical permissions:

| Role | Access Level | Key Permissions |
|------|-------------|-----------------|
| Main Government | National | Budget control, role management, fraud oversight |
| State Head | Regional | State budget allocation, deputy management |
| Deputy Officer | District | Vendor selection, project management, claim review |
| Vendor | Limited | Claim submission, payment tracking |
| Sub-Supplier | Limited | Delivery coordination, quality verification |
| Citizen | Public | Transparency access, corruption reporting |

## Usage Examples

### Starting the Application

```bash
# Production mode (requires ICP setup)
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Demo mode (no ICP required)
python app/main-demo.py

# Simple mode (JWT auth, simulated ICP)
python app/main-simple.py
```

### API Documentation

Once running, access interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

### Example API Call

```python
import httpx

# Analyze a claim for fraud
async with httpx.AsyncClient() as client:
    response = await client.post(
        "http://localhost:8000/api/v1/fraud/analyze-claim",
        json={
            "claim_id": 1001,
            "vendor_id": "vendor_123",
            "amount": 150000,
            "budget_id": 5,
            "allocation_id": 2,
            "invoice_hash": "hash_abc123",
            "deputy_id": "deputy_456",
            "area": "Road Construction",
            "timestamp": "2024-01-15T10:30:00Z"
        },
        headers={"Authorization": f"Bearer {jwt_token}"}
    )
    fraud_analysis = response.json()
    print(f"Fraud Score: {fraud_analysis['fraud_analysis']['fraud_score']}")
```

## Dependencies

### Core Dependencies

- **FastAPI**: Modern web framework for building APIs
- **Uvicorn**: ASGI server for running FastAPI
- **Pydantic**: Data validation using Python type annotations
- **SQLAlchemy**: SQL toolkit and ORM
- **PyJWT**: JSON Web Token implementation

### Fraud Detection Dependencies

- **scikit-learn**: Machine learning (Isolation Forest)
- **numpy/pandas**: Data manipulation and analysis
- **langchain**: LLM orchestration framework
- **ollama**: Local LLM inference (Gemma3)

### ICP Integration Dependencies

- **httpx**: Async HTTP client for canister calls
- **ic-py**: Internet Computer Python SDK

### Development Dependencies

- **pytest**: Testing framework
- **black**: Code formatting
- **flake8**: Linting
- **mypy**: Type checking

## Environment Configuration

Create a `.env` file in the `backend/` directory:

```bash
# Database
DATABASE_URL=sqlite:///./helix.db

# Security
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# ICP Configuration
ICP_NETWORK=local
CANISTER_ID=your-canister-id
DFX_NETWORK=local

# Fraud Detection
FRAUD_DETECTION_ENABLED=true
FRAUD_THRESHOLD=70
ML_MODEL_PATH=./models/fraud_detector.pkl

# CORS
CORS_ORIGINS=["http://localhost:5173", "http://localhost:3000"]

# Logging
LOG_LEVEL=INFO
LOG_FILE=./logs/helix.log
```

## Testing

Run tests for the application:

```bash
# Run all tests
pytest backend/tests/ -v

# Run with coverage
pytest backend/tests/ --cov=app --cov-report=html

# Run specific test module
pytest backend/tests/test_api/test_fraud.py -v
```

## Related Documentation

- [Backend README](../README.md) - Overall backend architecture and setup
- [API Documentation](api/README.md) - Detailed API endpoint documentation
- [Authentication System](auth/README.md) - Internet Identity and RBAC details
- [Fraud Detection](fraud_engine/README.md) - Fraud detection engine architecture
- [Autonomous Fraud Engine](autonomous_fraud_engine/README.md) - Advanced autonomous fraud detection
- [ICP Integration](icp/README.md) - Blockchain integration details
- [Main Project README](../../README.md) - Complete H.E.L.I.X. overview

## Performance Considerations

- **Response Time**: < 2 seconds for fraud analysis
- **Throughput**: 1000+ requests per second
- **Concurrent Connections**: Supports 100+ simultaneous users
- **Rate Limiting**: 100 requests per minute per IP (configurable)
- **Caching**: Fraud rules and ML models cached in memory

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **RBAC Enforcement**: Role-based permissions at API level
- **Input Validation**: Pydantic models validate all requests
- **SQL Injection Prevention**: SQLAlchemy ORM parameterized queries
- **CORS Configuration**: Restricted origins for cross-origin requests
- **Rate Limiting**: IP-based request throttling
- **Audit Logging**: All fraud detection events logged immutably

## Monitoring and Observability

- **Health Checks**: `/health` endpoint for service monitoring
- **Structured Logging**: JSON logs for easy parsing
- **Request Tracing**: X-Process-Time header on all responses
- **Fraud Metrics**: Real-time fraud detection statistics
- **Error Tracking**: Comprehensive exception handling and logging
