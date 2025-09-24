"""
Unit and Integration Tests for the Fraud Detection Engine

This test suite uses pytest and httpx to test the FastAPI application endpoints.
To run: `pytest`

Make sure the main fraud engine application is running before executing these tests.
"""

import pytest
import httpx
from datetime import datetime

# The base URL for the running FastAPI application
BASE_URL = "http://localhost:8080"

@pytest.mark.asyncio
async def test_health_check():
    """Tests if the /health endpoint is working correctly."""
    async with httpx.AsyncClient(base_url=BASE_URL) as client:
        response = await client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "CorruptGuard Fraud Detection Engine"
        assert data["components"]["rules_engine"] == "active"

@pytest.mark.asyncio
async def test_analyze_low_risk_claim():
    """Tests the analysis of a claim that should be considered low risk."""
    low_risk_claim = {
        "claim_id": 1001,
        "vendor_id": "vendor_10", # An existing vendor
        "amount": 12543.50, # A non-round, reasonable amount
        "budget_id": 5,
        "allocation_id": 2,
        "invoice_hash": "inv_hash_normal_1001",
        "deputy_id": "deputy_5",
        "area": "IT Infrastructure",
        "timestamp": datetime.now().isoformat()
    }

    async with httpx.AsyncClient(base_url=BASE_URL) as client:
        response = await client.post("/analyze-claim", json=low_risk_claim)
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        
        fraud_analysis = data["fraud_analysis"]
        assert fraud_analysis["claim_id"] == low_risk_claim["claim_id"]
        # For a low-risk claim, we expect the score to be low (e.g., < 40)
        assert fraud_analysis["score"] < 40
        assert fraud_analysis["risk_level"] == "low"

@pytest.mark.asyncio
async def test_analyze_high_risk_claim():
    """Tests the analysis of a claim that should be considered high risk."""
    high_risk_claim = {
        "claim_id": 2002,
        "vendor_id": "vendor_999", # A brand new vendor
        "amount": 5000000.00, # A very high, perfectly round amount
        "budget_id": 1,
        "allocation_id": 1,
        "invoice_hash": "inv_hash_suspicious_2002",
        "deputy_id": "deputy_1",
        "area": "Educational Technology",
        "timestamp": datetime.now().isoformat()
    }

    async with httpx.AsyncClient(base_url=BASE_URL) as client:
        response = await client.post("/analyze-claim", json=high_risk_claim)
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        
        fraud_analysis = data["fraud_analysis"]
        assert fraud_analysis["claim_id"] == high_risk_claim["claim_id"]
        
        # For a high-risk claim, we expect a high score (e.g., > 70)
        # and relevant flags from the rules engine.
        assert fraud_analysis["score"] > 70
        assert fraud_analysis["risk_level"] in ["high", "critical"]
        assert len(fraud_analysis["flags"]) > 0
        # We expect the round numbers flag to be triggered
        assert "ROUND_NUMBERS" in fraud_analysis["flags"]

@pytest.mark.asyncio
async def test_invalid_claim_submission():
    """Tests the API's response to a malformed claim submission."""
    invalid_claim = {
        "claim_id": 3003,
        "vendor_id": "vendor_123",
        # Missing 'amount' and other required fields
        "area": "Water Supply",
        "timestamp": datetime.now().isoformat()
    }

    async with httpx.AsyncClient(base_url=BASE_URL) as client:
        response = await client.post("/analyze-claim", json=invalid_claim)
        # Expect a 422 Unprocessable Entity error for Pydantic validation failure
        assert response.status_code == 422
