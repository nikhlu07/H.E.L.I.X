
import logging
import random
from contextlib import asynccontextmanager
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
import uvicorn
import httpx

from rules_engine import FraudRulesEngine, FraudScore as RulesFraudScore
from ml_detector import MLFraudDetector

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ================================================================================
# Lifespan Management
# ================================================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize fraud detection service on startup"""
    logger.info("🤖 CorruptGuard Fraud Detection Engine Starting...")
    app.state.fraud_service = FraudDetectionService()
    logger.info(f"📊 Loaded {len(app.state.fraud_service.rules_engine.historical_claims)} historical claims")
    logger.info("✅ Fraud Detection Engine Ready")
    yield

app = FastAPI(
    title="H.E.L.I.X. Fraud Detection Engine",
    version="2.0.0",
    description="AI-powered hybrid fraud detection for government procurement",
    lifespan=lifespan
)

# ================================================================================
# Data Models
# ================================================================================

class ClaimData(BaseModel):
    claim_id: int
    vendor_id: str
    amount: float
    budget_id: int
    allocation_id: int
    invoice_hash: str
    deputy_id: str
    area: str
    timestamp: datetime
    vendor_history: Optional[Dict] = None

class FinalFraudScore(BaseModel):
    claim_id: int
    score: int  # 0-100, higher = more suspicious
    risk_level: str  # "low", "medium", "high", "critical"
    flags: List[str]
    reasoning: str
    confidence: float
    analysis_time_ms: float

class FraudAlert(BaseModel):
    claim_id: int
    alert_type: str
    severity: str
    description: str
    auto_generated: bool = True
    timestamp: datetime

# ================================================================================
# Main Fraud Detection Service
# ================================================================================

class FraudDetectionService:
    """
    Main fraud detection service combining a rules engine with a dynamic RAG LLM.
    """
    
    def __init__(self):
        self.rules_engine = FraudRulesEngine()
        self.ml_detector = MLFraudDetector()
        self.icp_canister_url = "http://localhost:8000"  # Backend API endpoint
        self._initialize_demo_data()
    
    def _initialize_demo_data(self):
        """Initialize with realistic demo data"""
        logger.info("Initializing with demo data...")
        base_date = datetime.now() - timedelta(days=365)
        vendors = [f"vendor_{i}" for i in range(25)]
        areas = [
            "Road Construction", "School Building", "Hospital Equipment", 
            "IT Infrastructure", "Water Supply", "Public Transport",
            "Government Buildings", "Educational Technology"
        ]
        
        for i in range(150):
            claim = ClaimData(
                claim_id=i,
                vendor_id=random.choice(vendors),
                amount=random.uniform(50000, 5000000),
                budget_id=random.randint(1, 10),
                allocation_id=random.randint(0, 5),
                invoice_hash=f"hash_{i}_{random.randint(1000, 9999)}",
                deputy_id=f"deputy_{random.randint(1, 15)}",
                area=random.choice(areas),
                timestamp=base_date + timedelta(days=random.randint(0, 365))
            )
            self.rules_engine.add_historical_claim(claim)
        
        logger.info(f"Loaded {len(self.rules_engine.historical_claims)} historical claims")
    
    async def analyze_claim(self, claim_data: ClaimData) -> FinalFraudScore:
        """
        Analyzes a claim using a hybrid rules-and-ML approach.
        """
        start_time = datetime.now()
        
        try:
            logger.info(f"Analyzing claim {claim_data.claim_id} with hybrid engine...")
            
            # 1. Get analysis from the rules engine
            rules_analysis = self.rules_engine.analyze_claim(claim_data)
            
            # 2. Get the final probability from the ML detector, using rules output as context
            ml_probability = self.ml_detector.predict_fraud_probability(
                claim_data, 
                self.rules_engine.historical_claims,
                rules_analysis
            )
            
            # 3. The final score is determined by the LLM's sophisticated analysis
            final_score = int(ml_probability * 100)
            
            # 4. Determine risk level based on the LLM's score
            if final_score >= 85:
                risk_level = "critical"
            elif final_score >= 70:
                risk_level = "high"
            elif final_score >= 40:
                risk_level = "medium"
            else:
                risk_level = "low"
            
            # 5. Combine reasoning from both systems
            reasoning = (
                f"LLM Final Score: {final_score}/100. "
                f"Rules-Based Flags: {', '.join(rules_analysis.flags) if rules_analysis.flags else 'None'}. "
                f"Rules Reasoning: {rules_analysis.reasoning}."
            )
            
            analysis_time = (datetime.now() - start_time).total_seconds() * 1000
            
            final_fraud_score = FinalFraudScore(
                claim_id=claim_data.claim_id,
                score=final_score,
                risk_level=risk_level,
                flags=rules_analysis.flags, # Use the flags from the rules engine
                reasoning=reasoning,
                confidence=ml_probability,
                analysis_time_ms=round(analysis_time, 2)
            )
            
            self.rules_engine.add_historical_claim(claim_data)
            await self._update_backend_fraud_score(final_fraud_score)
            
            if final_score >= 70:
                await self._generate_fraud_alert(claim_data, final_fraud_score)
            
            logger.info(f"Claim {claim_data.claim_id} analysis complete: {final_score}/100 ({risk_level})")
            return final_fraud_score
            
        except Exception as e:
            logger.error(f"Error in hybrid analysis for claim {claim_data.claim_id}: {str(e)}")
            analysis_time = (datetime.now() - start_time).total_seconds() * 1000
            return FinalFraudScore(
                claim_id=claim_data.claim_id, score=50, risk_level="medium",
                flags=["ANALYSIS_ERROR"], reasoning=f"Analysis failed: {str(e)}",
                confidence=0.1, analysis_time_ms=round(analysis_time, 2)
            )
    
    async def _update_backend_fraud_score(self, fraud_score: FinalFraudScore):
        """Send fraud score back to backend API"""
        try:
            async with httpx.AsyncClient() as client:
                await client.post(
                    f"{self.icp_canister_url}/api/v1/fraud/update-score",
                    json=fraud_score.model_dump(), timeout=5.0
                )
        except Exception as e:
            logger.error(f"Failed to update backend fraud score: {str(e)}")
    
    async def _generate_fraud_alert(self, claim_data: ClaimData, fraud_score: FinalFraudScore):
        """Generate fraud alert for high-risk claims"""
        alert = FraudAlert(
            claim_id=claim_data.claim_id, alert_type="high_fraud_risk",
            severity=fraud_score.risk_level,
            description=f"Claim scored {fraud_score.score}/100. Flags: {', '.join(fraud_score.flags)}",
            timestamp=datetime.now()
        )
        try:
            async with httpx.AsyncClient() as client:
                await client.post(
                    f"{self.icp_canister_url}/api/v1/fraud/alert",
                    json=alert.model_dump(), timeout=5.0
                )
            logger.warning(f"🚨 FRAUD ALERT: Claim {claim_data.claim_id} - {fraud_score.score}/100 risk")
        except Exception as e:
            logger.error(f"Failed to generate fraud alert: {str(e)}")

# ================================================================================
# FastAPI Routes
# ================================================================================

@app.post("/analyze-claim")
async def analyze_claim_endpoint(claim_data: ClaimData):
    """Analyze a claim for fraud indicators"""
    try:
        fraud_service = app.state.fraud_service
        fraud_score = await fraud_service.analyze_claim(claim_data)
        return {
            "success": True,
            "fraud_analysis": fraud_score.model_dump(),
            "message": f"Claim {claim_data.claim_id} analyzed successfully"
        }
    except Exception as e:
        logger.error(f"Error in analyze_claim_endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "CorruptGuard Fraud Detection Engine",
        "version": app.version,
        "timestamp": datetime.now().isoformat(),
        "components": {
            "rules_engine": "active",
            "ml_detector_model": app.state.fraud_service.ml_detector.model_version,
            "historical_data_points": len(app.state.fraud_service.rules_engine.historical_claims)
        }
    }

if __name__ == "__main__":
    logger.info("🚀 Starting CorruptGuard Fraud Detection Engine...")
    uvicorn.run(app, host="0.0.0.0", port=8080, log_level="info")
