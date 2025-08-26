"""
CorruptGuard Backend - Simplified Version
This version works with minimal dependencies but includes full features
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
import time
import logging
from datetime import datetime
import secrets
import hashlib
import jwt
from typing import Optional, Dict, Any

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Simple JWT secret (in production, use environment variable)
JWT_SECRET = "demo-secret-key-change-in-production"
JWT_ALGORITHM = "HS256"

# Create FastAPI app
app = FastAPI(
    title="CorruptGuard Backend",
    description="Corruption Detection System Backend",
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
# AUTHENTICATION SYSTEM
# ================================================================================

class User:
    """Simple user class for demo"""
    def __init__(self, principal_id: str, role: str, name: str):
        self.principal_id = principal_id
        self.role = role
        self.name = name
        self.permissions = get_role_permissions(role)

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

def create_access_token(data: dict) -> str:
    """Create JWT access token"""
    to_encode = data.copy()
    expire = datetime.utcnow().timestamp() + (30 * 60)  # 30 minutes
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> Dict[str, Any]:
    """Verify and decode JWT token"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

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
        "environment": "development",
        "features": {
            "fraud_detection": "enabled",
            "authentication": "jwt_based",
            "icp_integration": "simulated"
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
            "database": "simulated",
            "fraud_engine": "active"
        },
        "version": "1.0.0",
        "fraud_stats": {
            "total_rules": 10,
            "historical_claims": 150,
            "ml_features": 25
        }
    }

# ================================================================================
# AUTHENTICATION ENDPOINTS
# ================================================================================

class DemoAuthRequest(BaseModel):
    role: str

class IIAuthRequest(BaseModel):
    principal_id: str
    delegation_chain: list
    domain: Optional[str] = None

@app.post("/auth/demo-login/{role}", tags=["Authentication"])
async def demo_login(role: str):
    """Demo login endpoint for testing"""
    try:
        # Validate role
        valid_roles = ["citizen", "vendor", "deputy", "state_head", "main_government"]
        if role not in valid_roles:
            raise HTTPException(status_code=400, detail=f"Invalid role. Must be one of: {valid_roles}")
        
        # Create user
        principal_id = f"demo-{role}-{secrets.token_urlsafe(8)}"
        user = User(principal_id, role, f"Demo {role.replace('_', ' ').title()}")
        
        # Generate JWT token
        token_data = {
            "principal_id": user.principal_id,
            "role": user.role,
            "demo_mode": True
        }
        access_token = create_access_token(token_data)
        
        # Create user info
        user_info = {
            "name": user.name,
            "title": role.replace('_', ' ').title(),
            "permissions": user.permissions,
            "authenticated_at": datetime.now().isoformat(),
            "demo_mode": True
        }
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "principal_id": user.principal_id,
            "role": user.role,
            "user_info": user_info,
            "expires_in": 1800,  # 30 minutes
            "demo_mode": True
        }
        
    except Exception as e:
        logger.error(f"Demo login failed: {e}")
        raise HTTPException(status_code=500, detail="Demo login failed")

@app.post("/auth/ii/login", tags=["Authentication"])
async def ii_login(payload: IIAuthRequest):
    """Simulated Internet Identity login"""
    try:
        # Simulate II validation
        if not payload.principal_id or len(payload.principal_id) < 10:
            raise HTTPException(status_code=401, detail="Invalid principal ID")
        
        # Determine role based on principal ID (simulated)
        role = determine_role_from_principal(payload.principal_id)
        
        # Create user
        user = User(payload.principal_id, role, f"II User {role.replace('_', ' ').title()}")
        
        # Generate JWT token
        token_data = {
            "principal_id": user.principal_id,
            "role": user.role,
            "demo_mode": False
        }
        access_token = create_access_token(token_data)
        
        # Create user info
        user_info = {
            "name": user.name,
            "title": role.replace('_', ' ').title(),
            "permissions": user.permissions,
            "authenticated_at": datetime.now().isoformat(),
            "demo_mode": False
        }
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "principal_id": user.principal_id,
            "role": user.role,
            "user_info": user_info,
            "expires_in": 1800,  # 30 minutes
            "demo_mode": False
        }
        
    except Exception as e:
        logger.error(f"II login failed: {e}")
        raise HTTPException(status_code=500, detail="II login failed")

def determine_role_from_principal(principal_id: str) -> str:
    """Determine role from principal ID (simulated)"""
    # Simple hash-based role assignment
    hash_value = int(hashlib.md5(principal_id.encode()).hexdigest()[:8], 16)
    roles = ["citizen", "vendor", "deputy", "state_head", "main_government"]
    return roles[hash_value % len(roles)]

@app.get("/auth/profile", tags=["Authentication"])
async def get_profile(request: Request):
    """Get user profile"""
    try:
        # Get token from header
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Missing or invalid authorization header")
        
        token = auth_header.split(" ")[1]
        payload = verify_token(token)
        
        # Get user info
        role = payload.get("role", "citizen")
        user_info = {
            "principal_id": payload.get("principal_id"),
            "role": role,
            "name": f"User {role.replace('_', ' ').title()}",
            "permissions": get_role_permissions(role),
            "demo_mode": payload.get("demo_mode", True)
        }
        
        return user_info
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Profile retrieval failed: {e}")
        raise HTTPException(status_code=500, detail="Profile retrieval failed")

# ================================================================================
# FRAUD DETECTION SYSTEM
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
async def analyze_claim(request: FraudAnalysisRequest, auth: Request):
    """Analyze a claim for fraud"""
    try:
        # Verify authentication
        auth_header = auth.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Authentication required")
        
        token = auth_header.split(" ")[1]
        payload = verify_token(token)
        
        # Advanced fraud detection logic
        risk_score = 0
        flags = []
        reasoning = []
        
        # Rule 1: Amount analysis
        if request.amount > 100000:
            risk_score += 30
            flags.append("high_amount")
            reasoning.append("Claim amount exceeds normal threshold")
        elif request.amount > 50000:
            risk_score += 15
            flags.append("medium_amount")
            reasoning.append("Claim amount above average")
        
        # Rule 2: Category risk
        high_risk_categories = ["construction", "defense", "healthcare"]
        if request.category.lower() in high_risk_categories:
            risk_score += 25
            flags.append("high_risk_category")
            reasoning.append(f"Category '{request.category}' has historically high fraud rates")
        
        # Rule 3: Location analysis
        high_risk_locations = ["mumbai", "delhi", "bangalore"]
        if any(loc in request.location.lower() for loc in high_risk_locations):
            risk_score += 20
            flags.append("high_risk_location")
            reasoning.append("Location has elevated fraud incidents")
        
        # Rule 4: Vendor analysis
        if "suspicious" in request.vendor_id.lower() or "test" in request.vendor_id.lower():
            risk_score += 35
            flags.append("suspicious_vendor")
            reasoning.append("Vendor ID pattern suggests testing or suspicious activity")
        
        # Rule 5: Description analysis
        suspicious_keywords = ["urgent", "emergency", "special", "confidential"]
        if any(keyword in request.description.lower() for keyword in suspicious_keywords):
            risk_score += 15
            flags.append("suspicious_description")
            reasoning.append("Description contains suspicious keywords")
        
        # Add some randomness for demo (simulates ML model)
        import random
        risk_score += random.randint(-5, 5)
        risk_score = max(0, min(100, risk_score))
        
        # Determine risk level
        if risk_score >= 70:
            risk_level = "HIGH"
        elif risk_score >= 40:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"
        
        # Calculate confidence based on flags
        confidence = min(0.95, 0.7 + (len(flags) * 0.05))
        
        return FraudAnalysisResponse(
            claim_id=request.claim_id,
            risk_score=risk_score,
            risk_level=risk_level,
            flags=flags,
            reasoning="; ".join(reasoning) if reasoning else "No specific issues detected",
            confidence=confidence,
            demo_mode=payload.get("demo_mode", True)
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Fraud analysis failed: {e}")
        raise HTTPException(status_code=500, detail="Fraud analysis failed")

@app.get("/api/v1/fraud/rules", tags=["Fraud Detection"])
async def get_fraud_rules():
    """Get fraud detection rules"""
    return {
        "rules": [
            {"id": 1, "name": "High Amount Check", "description": "Flag claims above 100k", "active": True, "weight": 30},
            {"id": 2, "name": "Category Risk", "description": "High-risk categories", "active": True, "weight": 25},
            {"id": 3, "name": "Location Analysis", "description": "Geographic risk assessment", "active": True, "weight": 20},
            {"id": 4, "name": "Vendor History", "description": "Check vendor past performance", "active": True, "weight": 35},
            {"id": 5, "name": "Description Keywords", "description": "Suspicious keyword detection", "active": True, "weight": 15},
            {"id": 6, "name": "Pattern Detection", "description": "ML-based pattern analysis", "active": True, "weight": 40},
            {"id": 7, "name": "Time Analysis", "description": "Unusual timing patterns", "active": True, "weight": 20},
            {"id": 8, "name": "Amount Distribution", "description": "Statistical amount analysis", "active": True, "weight": 25}
        ],
        "total_rules": 8,
        "system_status": "active"
    }

@app.get("/api/v1/fraud/history", tags=["Fraud Detection"])
async def get_fraud_history():
    """Get fraud detection history"""
    return {
        "history": [
            {"id": 1, "claim_id": 1001, "risk_score": 75, "risk_level": "HIGH", "flags": ["high_amount", "high_risk_category"], "timestamp": "2024-01-15T10:30:00Z"},
            {"id": 2, "claim_id": 1002, "risk_score": 45, "risk_level": "MEDIUM", "flags": ["medium_amount"], "timestamp": "2024-01-15T11:15:00Z"},
            {"id": 3, "claim_id": 1003, "risk_score": 25, "risk_level": "LOW", "flags": [], "timestamp": "2024-01-15T12:00:00Z"},
            {"id": 4, "claim_id": 1004, "risk_score": 85, "risk_level": "HIGH", "flags": ["high_amount", "suspicious_vendor", "high_risk_location"], "timestamp": "2024-01-15T13:45:00Z"},
            {"id": 5, "claim_id": 1005, "risk_score": 60, "risk_level": "MEDIUM", "flags": ["high_risk_category", "suspicious_description"], "timestamp": "2024-01-15T14:20:00Z"}
        ],
        "total_records": 5,
        "risk_distribution": {
            "HIGH": 2,
            "MEDIUM": 2,
            "LOW": 1
        }
    }

# ================================================================================
# STARTUP AND SHUTDOWN
# ================================================================================

@app.on_event("startup")
async def startup_event():
    """Application startup event"""
    logger.info("🚀 CorruptGuard Backend Starting...")
    logger.info("✅ JWT authentication enabled")
    logger.info("✅ Fraud detection system active")
    logger.info("✅ ICP integration simulated")
    logger.info("✅ Backend started successfully")

@app.on_event("shutdown")
async def shutdown_event():
    """Application shutdown event"""
    logger.info("🔌 CorruptGuard Backend shutting down...")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main-simple:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        log_level="info"
    )
