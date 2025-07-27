"""
ICP Integration Layer
Handles communication between Python fraud detection backend and ICP canisters
"""

import asyncio
import aiohttp
import json
import logging
from typing import Dict, List, Optional
from dataclasses import asdict
from datetime import datetime

logger = logging.getLogger(__name__)

class ICPCanisterClient:
    """
    Client for interacting with ICP canisters
    Handles authentication, method calls, and error handling
    """
    
    def __init__(self, canister_id: str, host: str = "http://localhost:8000"):
        self.canister_id = canister_id
        self.host = host
        self.session = None
    
    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    async def call_canister_method(self, method_name: str, args: Dict = None) -> Dict:
        """
        Call a canister method with given arguments
        In production, this would use the IC agent
        """
        if not self.session:
            raise RuntimeError("Client not initialized. Use async context manager.")
        
        url = f"{self.host}/api/v2/canister/{self.canister_id}/call"
        
        payload = {
            "method_name": method_name,
            "method_type": "update" if method_name in ["updateFraudScore", "addFraudAlert"] else "query",
            "args": args or {}
        }
        
        try:
            async with self.session.post(url, json=payload) as response:
                if response.status == 200:
                    result = await response.json()
                    return result
                else:
                    error_text = await response.text()
                    raise Exception(f"Canister call failed: {response.status} - {error_text}")
        
        except Exception as e:
            logger.error(f"Failed to call canister method {method_name}: {str(e)}")
            raise

class FraudDetectionIntegrator:
    """
    Integrates fraud detection with ICP canister
    Handles real-time scoring and alert generation
    """
    
    def __init__(self, procurement_canister_id: str):
        self.procurement_canister_id = procurement_canister_id
        self.fraud_api_url = "http://localhost:8080"  # Fraud detection API
    
    async def process_claim_submission(self, claim_id: int, claim_data: Dict) -> Dict:
        """
        Process a new claim submission through fraud detection pipeline
        """
        try:
            # Step 1: Call fraud detection API
            fraud_result = await self._analyze_claim_fraud(claim_data)
            
            # Step 2: Update canister with fraud score
            await self._update_canister_fraud_score(claim_id, fraud_result["fraud_score"]["score"])
            
            # Step 3: Generate alerts if high risk
            if fraud_result["fraud_score"]["score"] >= 70:
                await self._create_fraud_alert(claim_id, fraud_result["fraud_score"])
            
            # Step 4: Auto-flag critical risk claims
            if fraud_result["fraud_score"]["score"] >= 80:
                await self._flag_claim_for_review(claim_id, fraud_result["fraud_score"]["reasoning"])
            
            return {
                "success": True,
                "fraud_score": fraud_result["fraud_score"]["score"],
                "risk_level": fraud_result["fraud_score"]["risk_level"],
                "action_taken": "scored_and_processed"
            }
        
        except Exception as e:
            logger.error(f"Error processing claim {claim_id}: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "action_taken": "error_logged"
            }
    
    async def _analyze_claim_fraud(self, claim_data: Dict) -> Dict:
        """Call fraud detection API to analyze claim"""
        async with aiohttp.ClientSession() as session:
            url = f"{self.fraud_api_url}/analyze-claim"
            
            # Convert claim data to required format
            fraud_claim_data = {
                "claim_id": claim_data["claim_id"],
                "vendor_id": claim_data["vendor"],
                "amount": float(claim_data["amount"]),
                "budget_id": claim_data.get("budget_id", 1),
                "allocation_id": claim_data.get("allocation_id", 0),
                "invoice_hash": claim_data["invoice_hash"],
                "deputy_id": claim_data.get("deputy", "unknown"),
                "area": claim_data.get("area", "unknown"),
                "timestamp": datetime.now().isoformat()
            }
            
            async with session.post(url, json=fraud_claim_data) as response:
                if response.status == 200:
                    return await response.json()
                else:
                    raise Exception(f"Fraud API call failed: {response.status}")
    
    async def _update_canister_fraud_score(self, claim_id: int, score: int):
        """Update fraud score in the canister"""
        async with ICPCanisterClient(self.procurement_canister_id) as client:
            result = await client.call_canister_method(
                "updateFraudScore",
                {"claimId": claim_id, "score": score}
            )
            logger.info(f"Updated fraud score for claim {claim_id}: {score}")
            return result
    
    async def _create_fraud_alert(self, claim_id: int, fraud_score: Dict):
        """Create fraud alert in the canister"""
        async with ICPCanisterClient(self.procurement_canister_id) as client:
            result = await client.call_canister_method(
                "addFraudAlert",
                {
                    "claimId": claim_id,
                    "alertType": "high_fraud_risk",
                    "severity": fraud_score["risk_level"],
                    "description": f"Fraud score {fraud_score['score']}/100. Flags: {', '.join(fraud_score['flags'])}"
                }
            )
            logger.warning(f"Created fraud alert for claim {claim_id}")
            return result
    
    async def _flag_claim_for_review(self, claim_id: int, reason: str):
        """Flag claim for manual review"""
        async with ICPCanisterClient(self.procurement_canister_id) as client:
            result = await client.call_canister_method(
                "approveClaimByAI",
                {
                    "claimId": claim_id,
                    "approve": False,
                    "flagReason": f"Auto-flagged: {reason}"
                }
            )
            logger.warning(f"Auto-flagged claim {claim_id} for review")
            return result

class CanisterEventListener:
    """
    Listens for events from ICP canister and triggers fraud detection
    """
    
    def __init__(self, integrator: FraudDetectionIntegrator):
        self.integrator = integrator
        self.is_listening = False
    
    async def start_listening(self):
        """Start listening for canister events"""
        self.is_listening = True
        logger.info("Started listening for canister events")
        
        while self.is_listening:
            try:
                # In production, this would subscribe to canister events
                # For demo, we'll simulate periodic checking
                await self._check_for_new_claims()
                await asyncio.sleep(5)  # Check every 5 seconds
                
            except Exception as e:
                logger.error(f"Error in event listener: {str(e)}")
                await asyncio.sleep(10)  # Wait longer on error
    
    async def stop_listening(self):
        """Stop listening for events"""
        self.is_listening = False
        logger.info("Stopped listening for canister events")
    
    async def _check_for_new_claims(self):
        """Check for new claims that need fraud analysis"""
        try:
            async with ICPCanisterClient(self.integrator.procurement_canister_id) as client:
                # Get all claims and find unscored ones
                claims = await client.call_canister_method("getAllClaims")
                
                for claim_id, claim_data in claims.get("claims", []):
                    if claim_data.get("fraudScore") is None:
                        # This claim needs fraud analysis
                        await self.integrator.process_claim_submission(claim_id, claim_data)
        
        except Exception as e:
            # Don't log every polling error to avoid spam
            pass

# Example usage and testing functions
async def demo_integration():
    """
    Demo function showing integration between canister and fraud detection
    """
    print("🚀 Starting ClearGov Fraud Detection Integration Demo")
    
    # Initialize components
    canister_id = "rdmx6-jaaaa-aaaah-qcaiq-cai"  # Example canister ID
    integrator = FraudDetectionIntegrator(canister_id)
    
    # Simulate claim submission
    test_claim = {
        "claim_id": 101,
        "vendor": "vendor_suspicious_123",
        "amount": 999999,  # Suspiciously round number
        "invoice_hash": "test_hash_12345",
        "area": "Road Construction",
        "deputy": "deputy_001"
    }
    
    print(f"📝 Processing claim: {test_claim}")
    
    # Process through fraud detection
    result = await integrator.process_claim_submission(101, test_claim)
    
    print(f"✅ Fraud detection result: {result}")
    
    if result["success"]:
        print(f"🎯 Fraud Score: {result['fraud_score']}/100")
        print(f"⚠️  Risk Level: {result['risk_level']}")
        print(f"🔧 Action: {result['action_taken']}")
    else:
        print(f"❌ Error: {result['error']}")

if __name__ == "__main__":
    # Run demo
    asyncio.run(demo_integration())