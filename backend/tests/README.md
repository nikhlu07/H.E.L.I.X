# Backend Tests (`tests/`)

## Overview

This directory contains the comprehensive test suite for the H.E.L.I.X. backend, including unit tests, integration tests, and end-to-end tests for all components.

## Purpose

The test suite ensures:
- Code correctness and reliability
- Regression prevention
- API contract validation
- Integration point verification
- Performance benchmarking

## Test Structure

```
tests/
├── test_api/          # API endpoint tests
├── test_auth/         # Authentication tests
├── test_fraud/        # Fraud detection tests
├── test_icp/          # ICP integration tests
├── conftest.py        # Pytest fixtures and configuration
└── README.md          # This file
```

## Running Tests

### All Tests

```bash
# Run all tests
pytest backend/tests/ -v

# Run with coverage
pytest backend/tests/ --cov=app --cov-report=html

# Run in parallel
pytest backend/tests/ -n auto
```

### Specific Test Categories

```bash
# API tests only
pytest backend/tests/test_api/ -v

# Authentication tests
pytest backend/tests/test_auth/ -v

# Fraud detection tests
pytest backend/tests/test_fraud/ -v

# ICP integration tests
pytest backend/tests/test_icp/ -v
```

### Integration Tests

```bash
# Run integration tests (requires running services)
pytest backend/tests/ --integration -v

# Skip integration tests
pytest backend/tests/ -m "not integration" -v
```

## Test Categories

### Unit Tests

Test individual components in isolation:

```python
def test_fraud_rules_engine():
    engine = FraudRulesEngine()
    claim = ClaimData(...)
    
    score = engine.analyze_claim(claim)
    
    assert score.score >= 0
    assert score.score <= 100
    assert score.risk_level in ["low", "medium", "high", "critical"]
```

### Integration Tests

Test component interactions:

```python
@pytest.mark.integration
async def test_fraud_detection_with_canister():
    fraud_service = FraudDetectionService()
    claim = ClaimData(...)
    
    result = await fraud_service.analyze_claim(claim)
    
    # Verify canister was updated
    canister_score = await canister_service.get_fraud_score(claim.claim_id)
    assert canister_score == result.score
```

### API Tests

Test HTTP endpoints:

```python
def test_analyze_fraud_endpoint(client, auth_headers):
    response = client.post(
        "/api/v1/fraud/analyze-claim",
        json={"claim_id": 1001, ...},
        headers=auth_headers
    )
    
    assert response.status_code == 200
    assert "fraud_analysis" in response.json()
```

## Test Fixtures

Common fixtures in `conftest.py`:

```python
@pytest.fixture
def client():
    """FastAPI test client"""
    return TestClient(app)

@pytest.fixture
def auth_headers():
    """Authentication headers with valid JWT"""
    token = create_test_token()
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def test_db():
    """Test database session"""
    Base.metadata.create_all(bind=test_engine)
    yield TestSessionLocal()
    Base.metadata.drop_all(bind=test_engine)
```

## Test Coverage Goals

- **Overall Coverage**: > 80%
- **Critical Paths**: > 95% (auth, fraud detection, ICP)
- **API Endpoints**: 100%
- **Business Logic**: > 90%

## Continuous Integration

Tests run automatically on:
- Pull requests
- Commits to main branch
- Scheduled nightly builds

## Related Documentation

- [Main Application](../app/README.md) - Application being tested
- [API Layer](../app/api/README.md) - API endpoint tests
- [Fraud Detection](../app/fraud/README.md) - Fraud detection tests
