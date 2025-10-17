# Schemas (`app/schemas/`)

## Overview

This directory contains Pydantic data models for request/response validation and serialization throughout the H.E.L.I.X. backend.

## Purpose

Schemas provide:
- Type-safe request validation
- Automatic response serialization
- API documentation generation
- Data transformation and validation
- Clear API contracts

## Key Schema Categories

### Base Schemas
- `ResponseSchema` - Standard API response wrapper
- `UserRole` - User role enumeration
- `ErrorResponse` - Error response format

### Fraud Detection Schemas
- `FraudResult` - Fraud analysis result
- `FraudAuditLog` - Fraud detection audit entry
- `ClaimData` - Transaction claim data

### Authentication Schemas
- `LoginRequest` - Login credentials
- `AuthResponse` - Authentication response with JWT
- `UserProfile` - User profile information

## Usage Examples

### Request Validation

```python
from pydantic import BaseModel, Field

class ClaimSubmission(BaseModel):
    vendor_id: str = Field(..., min_length=1)
    amount: float = Field(..., gt=0)
    description: str

@router.post("/claims/submit")
async def submit_claim(claim: ClaimSubmission):
    # claim is automatically validated
    pass
```

### Response Serialization

```python
class FraudAnalysisResponse(BaseModel):
    claim_id: int
    fraud_score: int
    risk_level: str
    reasoning: str

@router.post("/fraud/analyze")
async def analyze(claim_data: ClaimData) -> FraudAnalysisResponse:
    # Response automatically serialized to JSON
    return FraudAnalysisResponse(...)
```

## Related Documentation

- [API Layer](../api/README.md) - API endpoints using schemas
- [Database](../database/README.md) - Database models vs. schemas
