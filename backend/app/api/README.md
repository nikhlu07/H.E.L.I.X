# API Layer (`app/api/`)

## Overview

This directory contains the FastAPI router modules that define all REST API endpoints for H.E.L.I.X. Each module is organized by user role or functional area, providing a clean separation of concerns and role-based access control (RBAC) enforcement.

## Purpose

The API layer serves as the interface between the frontend React application and the backend services. It handles:

- HTTP request routing and validation
- Authentication and authorization enforcement
- Request/response serialization using Pydantic models
- Role-specific endpoint access control
- Error handling and HTTP status code management
- API documentation generation (Swagger/OpenAPI)

## Contents

### Files

- **__init__.py** - Python package initialization (currently empty)
- **auth.py** - Authentication endpoints for Internet Identity login, token management, and user profile operations
- **citizen.py** - Public transparency endpoints for citizens to view procurement data and report corruption
- **deputy.py** - District-level endpoints for deputy officers to manage vendors, projects, and claims
- **deps.py** - Shared dependencies for API endpoints (authentication, database sessions, client info)
- **fraud.py** - Fraud detection API endpoints for analyzing claims and retrieving fraud alerts
- **government.py** - National-level endpoints for main government officials to manage budgets and oversee operations
- **vendor.py** - Vendor-specific endpoints for claim submission, payment tracking, and project management

## Architecture Context

The API layer sits between the frontend and backend services in H.E.L.I.X.'s architecture:

```
Frontend (React)
       ↓
   API Layer (FastAPI Routers)
       ↓
   ├─→ Authentication Service (auth/)
   ├─→ Fraud Detection Service (fraud/, fraud_engine/)
   ├─→ ICP Blockchain Service (icp/)
   ├─→ Database Service (database/)
   └─→ Business Logic Services (services/)
```

### Request Flow

1. **Client Request**: Frontend sends HTTP request to API endpoint
2. **Middleware**: Authentication middleware validates JWT token
3. **Dependency Injection**: `deps.py` provides user context, database session
4. **Router Handler**: Endpoint function processes request
5. **Service Layer**: Business logic executed via service classes
6. **Response**: Serialized response returned to client

### Role-Based Routing

Each router module corresponds to a specific user role:

| Router | Role | Access Level | Key Responsibilities |
|--------|------|--------------|---------------------|
| **government.py** | Main Government | National | Budget creation, role management, system administration |
| **deputy.py** | Deputy Officer | District | Vendor selection, project management, claim review |
| **vendor.py** | Vendor | Limited | Claim submission, payment tracking, supplier management |
| **citizen.py** | Citizen | Public | Transparency access, corruption reporting, verification |
| **fraud.py** | All Authenticated | Varies | Fraud analysis, alert retrieval (role-dependent access) |
| **auth.py** | Public/Authenticated | Mixed | Login, profile management, token operations |

## Key Concepts

### FastAPI Router Pattern

Each module defines a router that is mounted to the main FastAPI application:

```python
from fastapi import APIRouter

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login/internet-identity")
async def login_with_internet_identity(login_data: InternetIdentityLogin):
    # Endpoint implementation
    pass
```

### Dependency Injection

The `deps.py` module provides reusable dependencies:

```python
from fastapi import Depends
from app.api.deps import get_current_user, get_db

@router.get("/profile")
async def get_profile(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # current_user and db are automatically injected
    pass
```

### Pydantic Request/Response Models

All endpoints use Pydantic models for validation:

```python
from pydantic import BaseModel, Field

class InternetIdentityLogin(BaseModel):
    principal_id: str = Field(..., description="Internet Identity Principal ID")
    signature: str = Field(..., description="Delegation signature")

class AuthResponse(BaseModel):
    access_token: str
    token_type: str
    principal_id: str
    role: str
```

### Error Handling

Consistent error responses using HTTPException:

```python
from fastapi import HTTPException, status

if not user_authorized:
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Insufficient permissions"
    )
```

## Usage Examples

### Authentication Endpoint

```python
# POST /auth/login/internet-identity
import httpx

async with httpx.AsyncClient() as client:
    response = await client.post(
        "http://localhost:8000/auth/login/internet-identity",
        json={
            "principal_id": "rdmx6-jaaaa-aaaah-qcaiq-cai",
            "signature": "delegation_signature_here"
        }
    )
    auth_data = response.json()
    access_token = auth_data["access_token"]
```

### Fraud Analysis Endpoint

```python
# POST /api/v1/fraud/analyze-claim
headers = {"Authorization": f"Bearer {access_token}"}

response = await client.post(
    "http://localhost:8000/api/v1/fraud/analyze-claim",
    json={
        "claim_id": 1001,
        "vendor_id": "vendor_123",
        "amount": 150000,
        "description": "Road construction materials",
        "category": "construction",
        "location": "Mumbai"
    },
    headers=headers
)
fraud_result = response.json()
```

### Role-Protected Endpoint

```python
# GET /government/budget-overview (Main Government only)
response = await client.get(
    "http://localhost:8000/government/budget-overview",
    headers={"Authorization": f"Bearer {main_gov_token}"}
)
budget_data = response.json()
```

## API Endpoint Categories

### Authentication Endpoints (`auth.py`)

- `POST /auth/login/internet-identity` - Authenticate with Internet Identity
- `POST /auth/demo-login/{role}` - Demo login for testing
- `GET /auth/profile` - Get current user profile
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout and invalidate token
- `GET /auth/verify-role/{target_principal}` - Verify another user's role (admin only)
- `GET /auth/system-status` - Get authentication system status

### Fraud Detection Endpoints (`fraud.py`)

- `POST /api/v1/fraud/analyze-claim` - Analyze a claim for fraud indicators
- `GET /api/v1/fraud/claim/{claim_id}/score` - Get fraud score for specific claim
- `GET /api/v1/fraud/alerts/active` - Get active fraud alerts
- `GET /api/v1/fraud/rules` - Get fraud detection rules
- `GET /api/v1/fraud/history` - Get fraud detection history
- `POST /api/v1/fraud/report` - Report suspicious activity

### Government Endpoints (`government.py`)

- `POST /government/budget/create` - Create new budget allocation
- `GET /government/budget/overview` - National budget overview
- `GET /government/states` - Inter-state corruption patterns
- `POST /government/role/assign` - Assign role to principal
- `GET /government/analytics` - National fraud analytics

### Deputy Endpoints (`deputy.py`)

- `GET /deputy/projects` - District project management
- `GET /deputy/vendors` - Vendor evaluation tools
- `POST /deputy/claims/review` - Review vendor claims
- `GET /deputy/investigations` - Local fraud investigations
- `POST /deputy/vendor/select` - Select vendor for project

### Vendor Endpoints (`vendor.py`)

- `GET /vendor/contracts` - Contract management
- `GET /vendor/payments` - Payment tracking
- `POST /vendor/claim/submit` - Submit new claim
- `POST /vendor/compliance/report` - Compliance reporting
- `GET /vendor/performance` - Performance analytics

### Citizen Endpoints (`citizen.py`)

- `GET /citizen/transparency` - Public procurement data
- `POST /citizen/report` - Report corruption
- `GET /citizen/verify` - Community verification
- `GET /citizen/impact` - Impact tracking
- `POST /citizen/challenge` - Challenge suspicious transaction

## Dependencies

### Internal Dependencies

- **app.auth.middleware** - Authentication middleware and user context
- **app.auth.prinicipal_auth** - Principal authentication service
- **app.schemas** - Pydantic models for request/response validation
- **app.services** - Business logic services
- **app.database** - Database session management
- **app.utils.logging** - Logging utilities
- **app.utils.exceptions** - Custom exception classes

### External Dependencies

- **fastapi** - Web framework and routing
- **pydantic** - Data validation and serialization
- **httpx** - Async HTTP client for external calls
- **python-jose** - JWT token handling
- **passlib** - Password hashing (if needed)

## Testing

### Unit Testing

```bash
# Test specific API module
pytest backend/tests/test_api/test_auth.py -v

# Test all API endpoints
pytest backend/tests/test_api/ -v
```

### Integration Testing

```bash
# Test with running server
pytest backend/tests/test_api/ --integration -v
```

### API Documentation Testing

Access interactive API documentation:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Security Considerations

### Authentication Requirements

- All endpoints except `/auth/login/*` and `/auth/system-status` require authentication
- JWT tokens must be included in `Authorization: Bearer {token}` header
- Tokens expire after 24 hours (configurable)

### Role-Based Access Control

- Each endpoint checks user role via `get_current_user` dependency
- Unauthorized access returns `403 Forbidden`
- Role verification happens at both middleware and endpoint level

### Input Validation

- All request bodies validated using Pydantic models
- SQL injection prevented through ORM usage
- XSS protection via proper response encoding

### Rate Limiting

- IP-based rate limiting applied at middleware level
- Default: 100 requests per minute per IP
- Configurable via environment variables

## Error Response Format

All errors follow consistent format:

```json
{
    "detail": "Error message describing what went wrong",
    "status_code": 400,
    "error_type": "ValidationError"
}
```

Common HTTP status codes:
- `200 OK` - Successful request
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Validation error
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

## Related Documentation

- [Main Application README](../README.md) - Overall backend architecture
- [Authentication System](../auth/README.md) - Authentication implementation details
- [Fraud Detection](../fraud_engine/README.md) - Fraud detection engine
- [Database Models](../database/README.md) - Database schema and models
- [Schemas](../schemas/README.md) - Pydantic model definitions
- [Services](../services/README.md) - Business logic services

## Performance Optimization

- **Async Endpoints**: All endpoints use `async def` for non-blocking I/O
- **Database Connection Pooling**: Reuses database connections
- **Response Caching**: Frequently accessed data cached in memory
- **Lazy Loading**: Related data loaded only when needed
- **Pagination**: Large result sets paginated to reduce response size

## API Versioning

Current API version: `v1`

All endpoints prefixed with `/api/v1/` except authentication endpoints which use `/auth/` for backward compatibility.

Future versions will be added as `/api/v2/`, `/api/v3/`, etc., allowing multiple API versions to coexist.
