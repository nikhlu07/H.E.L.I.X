"""
CorruptGuard Backend - Demo Mode Only
This version doesn't require ICP dependencies for quick testing
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
import time
import logging
from datetime import datetime
import secrets

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="CorruptGuard Backend - Demo Mode",
    description="Corruption Detection System Backend (Demo Version)",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
)

# Simple rate limiting
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    
    # Simple IP-based rate limiting
    ip = request.client.host if request.client else "unknown"
    if not hasattr(app.state, "rate_buckets"):
        app.state.rate_buckets = {}
    
    bucket = app.state.rate_buckets
    now = time.time()
    
    if ip not in bucket:
        bucket[ip] = {"count": 0, "reset_time": now + 60}
    
    if now > bucket[ip]["reset_time"]:
        bucket[ip] = {"count": 0, "reset_time": now + 60}
    
    bucket[ip]["count"] += 1
    
    if bucket[ip]["count"] > 100:  # 100 requests per minute
        return JSONResponse(
            status_code=429,
            content={"detail": "Rate limit exceeded. Try again later."}
        )
    
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = f"{process_time:.4f}"
    return response

# ================================================================================
# CORE API ENDPOINTS
# ================================================================================

@app.get("/", tags=["Root"])
async def root():
    """Root endpoint"""
    return {
        "service": "CorruptGuard Backend",
        "version": "1.0.0",
        "status": "running",
        "description": "Corruption Detection System Backend",
        "environment": "demo",
        "features": {
            "fraud_detection": "enabled",
            "authentication": "demo_mode",
            "icp_integration": "disabled"
        },
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "backend": "running",
            "database": "sqlite",
            "fraud_engine": "demo_mode"
        },
        "version": "1.0.0",
        "fraud_stats": {
            "total_rules": 10,
            "historical_claims": 150,
            "ml_features": 25
        }
    }

# ================================================================================
# AUTHENTICATION (Demo Mode)
# ================================================================================

class DemoAuthRequest(BaseModel):
    role: str

class DemoAuthResponse(BaseModel):
    access_token: str
    token_type: str
    role: str
    user_info: dict
    expires_in: int
    demo_mode: bool

@app.post("/auth/demo-login/{role}", tags=["Authentication"])
async def demo_login(role: str):
    """Demo login endpoint for testing"""
    try:
        # Validate role
        valid_roles = ["citizen", "vendor", "deputy", "state_head", "main_government"]
        if role not in valid_roles:
            raise HTTPException(status_code=400, detail=f"Invalid role. Must be one of: {valid_roles}")
        
        # Generate demo token
        token = f"demo_{role}_{secrets.token_urlsafe(16)}"
        
        # Create user info based on role
        user_info = {
            "name": f"Demo {role.replace('_', ' ').title()}",
            "title": role.replace('_', ' ').title(),
            "permissions": get_role_permissions(role),
            "authenticated_at": datetime.now().isoformat(),
            "demo_mode": True
        }
        
        return DemoAuthResponse(
            access_token=token,
            token_type="bearer",
            role=role,
            user_info=user_info,
            expires_in=3600,
            demo_mode=True
        )
        
    except Exception as e:
        logger.error(f"Demo login failed: {e}")
        raise HTTPException(status_code=500, detail="Demo login failed")

def get_role_permissions(role: str) -> list:
    """Get permissions for a given role"""
    permissions = {
        "citizen": ["transparency_access", "corruption_reporting", "community_verification"],
        "vendor": ["claim_submission", "payment_tracking", "supplier_management"],
        "deputy": ["vendor_selection", "project_management", "claim_review"],
        "state_head": ["budget_allocation", "deputy_management", "regional_oversight"],
        "main_government": ["budget_control", "role_management", "fraud_oversight", "system_administration"]
    }
    return permissions.get(role, [])

@app.get("/auth/profile", tags=["Authentication"])
async def get_profile():
    """Get user profile (demo endpoint)"""
    return {
        "message": "Demo profile endpoint",
        "note": "In real mode, this would return actual user data from ICP canister"
    }

# ================================================================================
# FRAUD DETECTION (Demo Mode)
# ================================================================================

class FraudAnalysisRequest(BaseModel):
    claim_id: int
    vendor_id: str
    amount: float
    description: str
    category: str
    location: str

class FraudAnalysisResponse(BaseModel):
    claim_id: int
    risk_score: int
    risk_level: str
    flags: list
    reasoning: str
    confidence: float
    demo_mode: bool

@app.post("/api/v1/fraud/analyze-claim", tags=["Fraud Detection"])
async def analyze_claim(request: FraudAnalysisRequest):
    """Analyze a claim for fraud (demo mode)"""
    try:
        # Simple demo fraud detection logic
        risk_score = 0
        flags = []
        reasoning = []
        
        # Check amount
        if request.amount > 100000:
            risk_score += 30
            flags.append("high_amount")
            reasoning.append("Claim amount exceeds normal threshold")
        
        # Check category
        if request.category in ["construction", "defense"]:
            risk_score += 20
            flags.append("high_risk_category")
            reasoning.append("Category has historically high fraud rates")
        
        # Check location
        if "mumbai" in request.location.lower():
            risk_score += 15
            flags.append("high_risk_location")
            reasoning.append("Location has elevated fraud incidents")
        
        # Random variation for demo
        import random
        risk_score += random.randint(-10, 10)
        risk_score = max(0, min(100, risk_score))
        
        # Determine risk level
        if risk_score >= 70:
            risk_level = "HIGH"
        elif risk_score >= 40:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"
        
        return FraudAnalysisResponse(
            claim_id=request.claim_id,
            risk_score=risk_score,
            risk_level=risk_level,
            flags=flags,
            reasoning="; ".join(reasoning) if reasoning else "No specific issues detected",
            confidence=0.85,
            demo_mode=True
        )
        
    except Exception as e:
        logger.error(f"Fraud analysis failed: {e}")
        raise HTTPException(status_code=500, detail="Fraud analysis failed")

@app.get("/api/v1/fraud/rules", tags=["Fraud Detection"])
async def get_fraud_rules():
    """Get fraud detection rules (demo mode)"""
    return {
        "rules": [
            {"id": 1, "name": "High Amount Check", "description": "Flag claims above 100k", "active": True},
            {"id": 2, "name": "Category Risk", "description": "High-risk categories", "active": True},
            {"id": 3, "name": "Location Analysis", "description": "Geographic risk assessment", "active": True},
            {"id": 4, "name": "Vendor History", "description": "Check vendor past performance", "active": True},
            {"id": 5, "name": "Pattern Detection", "description": "ML-based pattern analysis", "active": True}
        ],
        "total_rules": 5,
        "demo_mode": True
    }

@app.get("/api/v1/fraud/history", tags=["Fraud Detection"])
async def get_fraud_history():
    """Get fraud detection history (demo mode)"""
    return {
        "history": [
            {"id": 1, "claim_id": 1001, "risk_score": 75, "risk_level": "HIGH", "timestamp": "2024-01-15T10:30:00Z"},
            {"id": 2, "claim_id": 1002, "risk_score": 45, "risk_level": "MEDIUM", "timestamp": "2024-01-15T11:15:00Z"},
            {"id": 3, "claim_id": 1003, "risk_score": 25, "risk_level": "LOW", "timestamp": "2024-01-15T12:00:00Z"}
        ],
        "total_records": 3,
        "demo_mode": True
    }

# ================================================================================
# STARTUP AND SHUTDOWN
# ================================================================================

@app.on_event("startup")
async def startup_event():
    """Application startup event"""
    logger.info("🚀 CorruptGuard Backend (Demo Mode) Starting...")
    logger.info("✅ Demo mode enabled - no ICP dependencies required")
    logger.info("✅ Backend started successfully")

@app.on_event("shutdown")
async def shutdown_event():
    """Application shutdown event"""
    logger.info("🔌 CorruptGuard Backend shutting down...")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main-demo:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        log_level="info"
    )
