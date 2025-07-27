# backend/app/icp/canister_calls.py - ENHANCED
import asyncio
import logging
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import dataclass
from datetime import datetime
import json

logger = logging.getLogger(__name__)

@dataclass
class ClaimData:
    claim_id: int
    vendor: str
    amount: int
    invoice_hash: str
    deputy: str
    ai_approved: bool
    flagged: bool
    paid: bool
    escrow_time: int
    total_paid_to_suppliers: int
    fraud_score: Optional[int] = None
    challenge_count: int = 0

@dataclass
class BudgetData:
    budget_id: int
    amount: int
    purpose: str
    allocated: int
    remaining: int

@dataclass
class FraudAlert:
    claim_id: int
    alert_type: str
    severity: str
    description: str
    timestamp: int
    resolved: bool

@dataclass
class SystemStats:
    total_budget: int
    active_claims: int
    flagged_claims: int
    total_challenges: int
    vendor_count: int

class CanisterService:
    """
    Service for interacting with the ICP canister
    Handles all contract function calls and data transformation
    """
    
    def __init__(self):
        self.canister_id = "rdmx6-jaaaa-aaaah-qcaiq-cai"  # Your canister ID
        self.agent = None
        self.actor = None
        self.demo_mode = True  # Set to False for real canister calls
        
        # Demo data for testing
        self._init_demo_data()
    
    def _init_demo_data(self):
        """Initialize demo data for testing without actual canister"""
        self.demo_claims = {
            1: ClaimData(
                claim_id=1,
                vendor="vendor_demo_1",
                amount=2500000,
                invoice_hash="inv_hash_001",
                deputy="deputy_demo_1",
                ai_approved=False,
                flagged=False,
                paid=False,
                escrow_time=0,
                total_paid_to_suppliers=0,
                fraud_score=45,
                challenge_count=0
            ),
            2: ClaimData(
                claim_id=2,
                vendor="vendor_demo_2",
                amount=1200000,
                invoice_hash="inv_hash_002",
                deputy="deputy_demo_2",
                ai_approved=True,
                flagged=False,
                paid=True,
                escrow_time=1640995200,
                total_paid_to_suppliers=800000,
                fraud_score=25,
                challenge_count=0
            ),
            3: ClaimData(
                claim_id=3,
                vendor="vendor_demo_3",
                amount=5000000,
                invoice_hash="inv_hash_003",
                deputy="deputy_demo_1",
                ai_approved=False,
                flagged=True,
                paid=False,
                escrow_time=0,
                total_paid_to_suppliers=0,
                fraud_score=85,
                challenge_count=2
            )
        }
        
        self.demo_budgets = {
            1: BudgetData(
                budget_id=1,
                amount=50000000,
                purpose="Infrastructure Development",
                allocated=35000000,
                remaining=15000000
            ),
            2: BudgetData(
                budget_id=2,
                amount=25000000,
                purpose="Education Reform",
                allocated=18000000,
                remaining=7000000
            )
        }
        
        self.demo_fraud_alerts = {
            3: [
                FraudAlert(
                    claim_id=3,
                    alert_type="high_amount",
                    severity="critical",
                    description="Amount significantly above threshold for vendor type",
                    timestamp=int(datetime.now().timestamp()),
                    resolved=False
                ),
                FraudAlert(
                    claim_id=3,
                    alert_type="round_number",
                    severity="high",
                    description="Suspiciously round invoice amount detected",
                    timestamp=int(datetime.now().timestamp()),
                    resolved=False
                )
            ]
        }
        
        self.demo_system_stats = SystemStats(
            total_budget=75000000,
            active_claims=15,
            flagged_claims=3,
            total_challenges=5,
            vendor_count=25
        )
    
    async def init_canister_connection(self):
        """Initialize connection to ICP canister"""
        if self.demo_mode:
            logger.info("Running in demo mode - canister calls will be simulated")
            return
        
        try:
            # TODO: Initialize actual ICP agent and actor
            # from ic.agent import Agent
            # from ic.principal import Principal
            # from ic.client import Client
            
            # self.agent = Agent()
            # self.actor = await self.agent.create_actor(self.canister_id, idl_factory)
            
            logger.info("ICP canister connection initialized")
        except Exception as e:
            logger.error(f"Failed to initialize canister connection: {e}")
            raise
    
    # Role Management Functions
    async def is_main_government(self, principal_id: str) -> bool:
        """Check if principal is main government"""
        if self.demo_mode:
            return principal_id == "rdmx6-jaaaa-aaaah-qcaiq-cai"
        
        # TODO: Implement actual canister call
        # return await self.actor.is_main_government(principal_id)
        return False
    
    async def is_state_head(self, principal_id: str) -> bool:
        """Check if principal is state head"""
        if self.demo_mode:
            state_head_principals = [
                "renrk-eyaaa-aaaah-qcaia-cai",
                "state-head-2",
                "state-head-3"
            ]
            return principal_id in state_head_principals
        
        # TODO: Implement actual canister call
        return False
    
    async def is_deputy(self, principal_id: str) -> bool:
        """Check if principal is deputy"""
        if self.demo_mode:
            deputy_principals = [
                "rrkah-fqaaa-aaaah-qcaiq-cai",
                "deputy-2",
                "deputy-3",
                "deputy-4"
            ]
            return principal_id in deputy_principals
        
        # TODO: Implement actual canister call
        return False
    
    async def is_vendor(self, principal_id: str) -> bool:
        """Check if principal is approved vendor"""
        if self.demo_mode:
            vendor_principals = [
                "radvj-tiaaa-aaaah-qcaiq-cai",
                "vendor-2",
                "vendor-3"
            ]
            return principal_id in vendor_principals
        
        # TODO: Implement actual canister call
        return False
    
    # Government Functions
    async def propose_state_head(self, principal_id: str) -> Dict[str, Any]:
        """Propose a new state head"""
        if self.demo_mode:
            logger.info(f"Demo: Proposing state head {principal_id}")
            return {"success": True, "message": f"State head {principal_id} proposed"}
        
        # TODO: Implement actual canister call
        # result = await self.actor.propose_state_head(principal_id)
        # return self._handle_canister_result(result)
        return {"success": False, "error": "Not implemented"}
    
    async def confirm_state_head(self, principal_id: str) -> Dict[str, Any]:
        """Confirm a proposed state head"""
        if self.demo_mode:
            logger.info(f"Demo: Confirming state head {principal_id}")
            return {"success": True, "message": f"State head {principal_id} confirmed"}
        
        # TODO: Implement actual canister call
        return {"success": False, "error": "Not implemented"}
    
    async def lock_budget(self, amount: int, purpose: str) -> Dict[str, Any]:
        """Lock budget for allocation"""
        if self.demo_mode:
            budget_id = len(self.demo_budgets) + 1
            new_budget = BudgetData(
                budget_id=budget_id,
                amount=amount,
                purpose=purpose,
                allocated=0,
                remaining=amount
            )
            self.demo_budgets[budget_id] = new_budget
            
            logger.info(f"Demo: Locked budget {budget_id} for {amount} - {purpose}")
            return {"success": True, "budget_id": budget_id}
        
        # TODO: Implement actual canister call
        return {"success": False, "error": "Not implemented"}
    
    async def allocate_budget(
        self, 
        budget_id: int, 
        amount: int, 
        area: str, 
        deputy: str
    ) -> Dict[str, Any]:
        """Allocate budget to deputy"""
        if self.demo_mode:
            if budget_id in self.demo_budgets:
                budget = self.demo_budgets[budget_id]
                if amount <= budget.remaining:
                    budget.allocated += amount
                    budget.remaining -= amount
                    
                    logger.info(f"Demo: Allocated {amount} from budget {budget_id} to {deputy} for {area}")
                    return {"success": True, "message": "Budget allocated successfully"}
                else:
                    return {"success": False, "error": "Insufficient budget remaining"}
            else:
                return {"success": False, "error": "Budget not found"}
        
        # TODO: Implement actual canister call
        return {"success": False, "error": "Not implemented"}
    
    # Vendor Functions
    async def propose_vendor(self, principal_id: str) -> Dict[str, Any]:
        """Propose a new vendor"""
        if self.demo_mode:
            logger.info(f"Demo: Proposing vendor {principal_id}")
            return {"success": True, "message": f"Vendor {principal_id} proposed"}
        
        # TODO: Implement actual canister call
        return {"success": False, "error": "Not implemented"}
    
    async def approve_vendor(self, principal_id: str) -> Dict[str, Any]:
        """Approve a proposed vendor"""
        if self.demo_mode:
            logger.info(f"Demo: Approving vendor {principal_id}")
            return {"success": True, "message": f"Vendor {principal_id} approved"}
        
        # TODO: Implement actual canister call
        return {"success": False, "error": "Not implemented"}
    
    async def submit_claim(
        self, 
        budget_id: int, 
        allocation_id: int, 
        amount: int, 
        invoice_data: str
    ) -> Dict[str, Any]:
        """Submit a vendor claim"""
        if self.demo_mode:
            claim_id = len(self.demo_claims) + 1
            invoice_hash = f"hash_{claim_id}_{hash(invoice_data) % 10000}"
            
            new_claim = ClaimData(
                claim_id=claim_id,
                vendor=f"vendor_demo_{claim_id}",
                amount=amount,
                invoice_hash=invoice_hash,
                deputy=f"deputy_demo_1",
                ai_approved=False,
                flagged=False,
                paid=False,
                escrow_time=0,
                total_paid_to_suppliers=0,
                fraud_score=None,
                challenge_count=0
            )
            
            self.demo_claims[claim_id] = new_claim
            
            logger.info(f"Demo: Submitted claim {claim_id} for amount {amount}")
            
            # Trigger fraud detection
            await self._trigger_fraud_detection(new_claim)
            
            return {"success": True, "claim_id": claim_id}
        
        # TODO: Implement actual canister call
        return {"success": False, "error": "Not implemented"}
    
    # Fraud Detection Functions
    async def update_fraud_score(self, claim_id: int, score: int) -> Dict[str, Any]:
        """Update fraud score for a claim"""
        if self.demo_mode:
            if claim_id in self.demo_claims:
                self.demo_claims[claim_id].fraud_score = score
                
                # Auto-flag high-risk claims
                if score >= 80:
                    self.demo_claims[claim_id].flagged = True
                
                logger.info(f"Demo: Updated fraud score for claim {claim_id} to {score}")
                return {"success": True, "message": "Fraud score updated"}
            else:
                return {"success": False, "error": "Claim not found"}
        
        # TODO: Implement actual canister call
        return {"success": False, "error": "Not implemented"}
    
    async def approve_claim_by_ai(self, claim_id: int, approve: bool, reason: str) -> Dict[str, Any]:
        """Approve or reject claim by AI"""
        if self.demo_mode:
            if claim_id in self.demo_claims:
                claim = self.demo_claims[claim_id]
                
                if approve:
                    claim.ai_approved = True
                    claim.escrow_time = int(datetime.now().timestamp())
                    logger.info(f"Demo: AI approved claim {claim_id}")
                else:
                    claim.flagged = True
                    # Add fraud alert
                    if claim_id not in self.demo_fraud_alerts:
                        self.demo_fraud_alerts[claim_id] = []
                    
                    alert = FraudAlert(
                        claim_id=claim_id,
                        alert_type="ai_review",
                        severity="high",
                        description=reason,
                        timestamp=int(datetime.now().timestamp()),
                        resolved=False
                    )
                    self.demo_fraud_alerts[claim_id].append(alert)
                    logger.warning(f"Demo: AI flagged claim {claim_id} - {reason}")
                
                return {"success": True, "message": f"Claim {claim_id} {'approved' if approve else 'flagged'} by AI"}
            else:
                return {"success": False, "error": "Claim not found"}
        
        # TODO: Implement actual canister call
        return {"success": False, "error": "Not implemented"}
    
    async def add_fraud_alert(
        self, 
        claim_id: int, 
        alert_type: str, 
        severity: str, 
        description: str
    ) -> Dict[str, Any]:
        """Add a fraud alert for a claim"""
        if self.demo_mode:
            if claim_id not in self.demo_fraud_alerts:
                self.demo_fraud_alerts[claim_id] = []
            
            alert = FraudAlert(
                claim_id=claim_id,
                alert_type=alert_type,
                severity=severity,
                description=description,
                timestamp=int(datetime.now().timestamp()),
                resolved=False
            )
            
            self.demo_fraud_alerts[claim_id].append(alert)
            logger.warning(f"Demo: Added fraud alert for claim {claim_id} - {description}")
            
            return {"success": True, "message": "Fraud alert added"}
        
        # TODO: Implement actual canister call
        return {"success": False, "error": "Not implemented"}
    
    # Challenge System
    async def stake_challenge(self, invoice_hash: str, reason: str, evidence: str) -> Dict[str, Any]:
        """Stake a challenge against an invoice"""
        if self.demo_mode:
            # Find claim by invoice hash
            claim_id = None
            for cid, claim in self.demo_claims.items():
                if claim.invoice_hash == invoice_hash:
                    claim_id = cid
                    break
            
            if claim_id:
                self.demo_claims[claim_id].challenge_count += 1
                logger.info(f"Demo: Challenge staked against claim {claim_id} - {reason}")
                return {"success": True, "message": f"Challenge staked against claim {claim_id}"}
            else:
                return {"success": False, "error": "Invoice not found"}
        
        # TODO: Implement actual canister call
        return {"success": False, "error": "Not implemented"}
    
    # Query Functions
    async def get_claim(self, claim_id: int) -> Optional[ClaimData]:
        """Get claim details"""
        if self.demo_mode:
            return self.demo_claims.get(claim_id)
        
        # TODO: Implement actual canister call
        return None
    
    async def get_all_claims(self) -> List[Tuple[int, ClaimData]]:
        """Get all claims"""
        if self.demo_mode:
            return [(cid, claim) for cid, claim in self.demo_claims.items()]
        
        # TODO: Implement actual canister call
        return []
    
    async def get_high_risk_claims(self) -> List[Tuple[int, int]]:
        """Get high-risk claims with their fraud scores"""
        if self.demo_mode:
            high_risk = []
            for cid, claim in self.demo_claims.items():
                if claim.fraud_score and claim.fraud_score >= 70:
                    high_risk.append((cid, claim.fraud_score))
            return high_risk
        
        # TODO: Implement actual canister call
        return []
    
    async def get_fraud_alerts(self, claim_id: int) -> List[FraudAlert]:
        """Get fraud alerts for a claim"""
        if self.demo_mode:
            return self.demo_fraud_alerts.get(claim_id, [])
        
        # TODO: Implement actual canister call
        return []
    
    async def get_budget_transparency(self) -> List[Tuple[int, BudgetData]]:
        """Get budget transparency data"""
        if self.demo_mode:
            return [(bid, budget) for bid, budget in self.demo_budgets.items()]
        
        # TODO: Implement actual canister call
        return []
    
    async def get_system_stats(self) -> SystemStats:
        """Get system statistics"""
        if self.demo_mode:
            # Update stats based on current demo data
            flagged_count = sum(1 for claim in self.demo_claims.values() if claim.flagged)
            challenge_count = sum(claim.challenge_count for claim in self.demo_claims.values())
            
            self.demo_system_stats.active_claims = len(self.demo_claims)
            self.demo_system_stats.flagged_claims = flagged_count
            self.demo_system_stats.total_challenges = challenge_count
            
            return self.demo_system_stats
        
        # TODO: Implement actual canister call
        return SystemStats(0, 0, 0, 0, 0)
    
    # Helper Functions
    async def _trigger_fraud_detection(self, claim: ClaimData):
        """Trigger fraud detection for a new claim"""
        try:
            # In demo mode, simulate basic fraud detection
            if self.demo_mode:
                # Simple fraud scoring based on amount and patterns
                score = 10  # Base score
                
                # High amount penalty
                if claim.amount > 1_000_000:
                    score += 40
                
                # Round number penalty
                if str(claim.amount).endswith('00000'):
                    score += 30
                
                # Random variation for demo
                import random
                score += random.randint(0, 20)
                
                # Update the claim with fraud score
                await self.update_fraud_score(claim.claim_id, score)
                
                # Generate alerts for high-risk claims
                if score >= 70:
                    await self.add_fraud_alert(
                        claim.claim_id,
                        "automated_detection",
                        "high" if score < 85 else "critical",
                        f"Automated fraud detection scored this claim at {score}/100"
                    )
                
                logger.info(f"Demo: Fraud detection completed for claim {claim.claim_id} - Score: {score}")
        
        except Exception as e:
            logger.error(f"Error in fraud detection trigger: {e}")
    
    def _handle_canister_result(self, result: Any) -> Dict[str, Any]:
        """Handle result from canister calls"""
        # Handle Motoko Result type: { ok: T } or { err: Text }
        if isinstance(result, dict):
            if "ok" in result:
                return {"success": True, "data": result["ok"]}
            elif "err" in result:
                return {"success": False, "error": result["err"]}
        
        return {"success": True, "data": result}
    
    # Utility Functions
    def format_principal(self, principal: str) -> str:
        """Format principal ID for display"""
        if len(principal) > 10:
            return f"{principal[:6]}...{principal[-4:]}"
        return principal
    
    def format_amount(self, amount: int) -> str:
        """Format amount for display"""
        return f"₹{amount:,}"
    
    def calculate_fraud_risk_level(self, score: Optional[int]) -> str:
        """Calculate risk level from fraud score"""
        if score is None:
            return "unknown"
        elif score >= 80:
            return "critical"
        elif score >= 60:
            return "high"
        elif score >= 30:
            return "medium"
        else:
            return "low"
    
    # Demo Data Management
    def add_demo_claim(self, vendor: str, amount: int, deputy: str) -> int:
        """Add a demo claim for testing"""
        claim_id = len(self.demo_claims) + 1
        new_claim = ClaimData(
            claim_id=claim_id,
            vendor=vendor,
            amount=amount,
            invoice_hash=f"demo_hash_{claim_id}",
            deputy=deputy,
            ai_approved=False,
            flagged=False,
            paid=False,
            escrow_time=0,
            total_paid_to_suppliers=0,
            fraud_score=None,
            challenge_count=0
        )
        
        self.demo_claims[claim_id] = new_claim
        return claim_id
    
    def reset_demo_data(self):
        """Reset demo data to initial state"""
        self._init_demo_data()
        logger.info("Demo data reset to initial state")

# Singleton instance
canister_service = CanisterService()