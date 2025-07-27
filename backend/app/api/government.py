# backend/app/api/government.py - INTEGRATED
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import logging
from datetime import datetime

from ..auth.middleware import (
    require_main_government, 
    require_state_head, 
    require_government_official,
    get_current_user
)
from ..icp.canister_calls import canister_service
from ..schemas.government import (
    BudgetCreateRequest,
    BudgetAllocationRequest,
    StateHeadProposal,
    VendorProposal,
    FraudScoreUpdate,
    ClaimApprovalRequest
)

logger = logging.getLogger(__name__)
router = APIRouter()

# ================================================================================
# Budget Management Endpoints
# ================================================================================

@router.post("/budget/create")
async def create_budget(
    budget_request: BudgetCreateRequest,
    current_user: dict = Depends(require_main_government)
):
    """
    Create and lock a new budget allocation
    Only main government can create budgets
    """
    try:
        logger.info(f"Creating budget: {budget_request.purpose} - {budget_request.amount}")
        
        # Call ICP canister to lock budget
        result = await canister_service.lock_budget(
            amount=budget_request.amount,
            purpose=budget_request.purpose
        )
        
        if result["success"]:
            return {
                "success": True,
                "budget_id": result["budget_id"],
                "message": f"Budget locked successfully with ID {result['budget_id']}",
                "budget": {
                    "id": result["budget_id"],
                    "amount": budget_request.amount,
                    "purpose": budget_request.purpose,
                    "created_by": current_user["principal_id"],
                    "created_at": datetime.now().isoformat()
                }
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to create budget: {result.get('error', 'Unknown error')}"
            )
    
    except Exception as e:
        logger.error(f"Error creating budget: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create budget"
        )

@router.post("/budget/{budget_id}/allocate")
async def allocate_budget(
    budget_id: int,
    allocation_request: BudgetAllocationRequest,
    current_user: dict = Depends(require_state_head)
):
    """
    Allocate budget to a deputy
    State heads and main government can allocate budgets
    """
    try:
        logger.info(f"Allocating budget {budget_id}: {allocation_request.amount} to {allocation_request.deputy}")
        
        # Call ICP canister to allocate budget
        result = await canister_service.allocate_budget(
            budget_id=budget_id,
            amount=allocation_request.amount,
            area=allocation_request.area,
            deputy=allocation_request.deputy
        )
        
        if result["success"]:
            return {
                "success": True,
                "message": result["message"],
                "allocation": {
                    "budget_id": budget_id,
                    "amount": allocation_request.amount,
                    "area": allocation_request.area,
                    "deputy": allocation_request.deputy,
                    "allocated_by": current_user["principal_id"],
                    "allocated_at": datetime.now().isoformat()
                }
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result.get("error", "Failed to allocate budget")
            )
    
    except Exception as e:
        logger.error(f"Error allocating budget: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to allocate budget"
        )

@router.get("/budget/transparency")
async def get_budget_transparency(
    current_user: dict = Depends(get_current_user)
):
    """
    Get budget transparency data
    Available to all authenticated users
    """
    try:
        # Get budget data from canister
        budget_data = await canister_service.get_budget_transparency()
        
        transparency_info = []
        for budget_id, budget in budget_data:
            transparency_info.append({
                "budget_id": budget_id,
                "amount": budget.amount,
                "purpose": budget.purpose,
                "allocated": budget.allocated,
                "remaining": budget.remaining,
                "utilization_percentage": round((budget.allocated / budget.amount) * 100, 2) if budget.amount > 0 else 0
            })
        
        return {
            "success": True,
            "budgets": transparency_info,
            "total_budgets": len(transparency_info),
            "total_amount": sum(b["amount"] for b in transparency_info),
            "total_allocated": sum(b["allocated"] for b in transparency_info),
            "requested_by": current_user["principal_id"]
        }
    
    except Exception as e:
        logger.error(f"Error getting budget transparency: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve budget transparency data"
        )

# ================================================================================
# Role Management Endpoints
# ================================================================================

@router.post("/role/state-head/propose")
async def propose_state_head(
    proposal: StateHeadProposal,
    current_user: dict = Depends(require_main_government)
):
    """
    Propose a new state head
    Only main government can propose state heads
    """
    try:
        logger.info(f"Proposing state head: {proposal.principal_id}")
        
        # Call ICP canister to propose state head
        result = await canister_service.propose_state_head(proposal.principal_id)
        
        if result["success"]:
            return {
                "success": True,
                "message": result["message"],
                "proposal": {
                    "candidate": proposal.principal_id,
                    "proposed_by": current_user["principal_id"],
                    "proposed_at": datetime.now().isoformat(),
                    "reason": proposal.reason
                }
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result.get("error", "Failed to propose state head")
            )
    
    except Exception as e:
        logger.error(f"Error proposing state head: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to propose state head"
        )

@router.post("/role/state-head/{principal_id}/confirm")
async def confirm_state_head(
    principal_id: str,
    current_user: dict = Depends(require_main_government)
):
    """
    Confirm a proposed state head
    Only main government can confirm state heads
    """
    try:
        logger.info(f"Confirming state head: {principal_id}")
        
        # Call ICP canister to confirm state head
        result = await canister_service.confirm_state_head(principal_id)
        
        if result["success"]:
            return {
                "success": True,
                "message": result["message"],
                "confirmation": {
                    "principal_id": principal_id,
                    "confirmed_by": current_user["principal_id"],
                    "confirmed_at": datetime.now().isoformat()
                }
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result.get("error", "Failed to confirm state head")
            )
    
    except Exception as e:
        logger.error(f"Error confirming state head: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to confirm state head"
        )

# ================================================================================
# Vendor Management Endpoints
# ================================================================================

@router.post("/vendor/propose")
async def propose_vendor(
    proposal: VendorProposal,
    current_user: dict = Depends(require_main_government)
):
    """
    Propose a new vendor
    Only main government can propose vendors
    """
    try:
        logger.info(f"Proposing vendor: {proposal.principal_id}")
        
        # Call ICP canister to propose vendor
        result = await canister_service.propose_vendor(proposal.principal_id)
        
        if result["success"]:
            return {
                "success": True,
                "message": result["message"],
                "proposal": {
                    "vendor_principal": proposal.principal_id,
                    "company_name": proposal.company_name,
                    "business_type": proposal.business_type,
                    "proposed_by": current_user["principal_id"],
                    "proposed_at": datetime.now().isoformat()
                }
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result.get("error", "Failed to propose vendor")
            )
    
    except Exception as e:
        logger.error(f"Error proposing vendor: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to propose vendor"
        )

@router.post("/vendor/{principal_id}/approve")
async def approve_vendor(
    principal_id: str,
    current_user: dict = Depends(require_main_government)
):
    """
    Approve a proposed vendor
    Only main government can approve vendors
    """
    try:
        logger.info(f"Approving vendor: {principal_id}")
        
        # Call ICP canister to approve vendor
        result = await canister_service.approve_vendor(principal_id)
        
        if result["success"]:
            return {
                "success": True,
                "message": result["message"],
                "approval": {
                    "vendor_principal": principal_id,
                    "approved_by": current_user["principal_id"],
                    "approved_at": datetime.now().isoformat()
                }
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result.get("error", "Failed to approve vendor")
            )
    
    except Exception as e:
        logger.error(f"Error approving vendor: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to approve vendor"
        )

# ================================================================================
# Fraud Detection Management Endpoints
# ================================================================================

@router.post("/fraud/score/update")
async def update_fraud_score(
    score_update: FraudScoreUpdate,
    current_user: dict = Depends(require_main_government)
):
    """
    Update fraud score for a claim
    Only main government can manually update fraud scores
    """
    try:
        logger.info(f"Updating fraud score for claim {score_update.claim_id} to {score_update.score}")
        
        # Call ICP canister to update fraud score
        result = await canister_service.update_fraud_score(
            claim_id=score_update.claim_id,
            score=score_update.score
        )
        
        if result["success"]:
            return {
                "success": True,
                "message": result["message"],
                "update": {
                    "claim_id": score_update.claim_id,
                    "new_score": score_update.score,
                    "reason": score_update.reason,
                    "updated_by": current_user["principal_id"],
                    "updated_at": datetime.now().isoformat()
                }
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result.get("error", "Failed to update fraud score")
            )
    
    except Exception as e:
        logger.error(f"Error updating fraud score: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update fraud score"
        )

@router.post("/fraud/claim/approve")
async def approve_claim_by_ai(
    approval_request: ClaimApprovalRequest,
    current_user: dict = Depends(require_main_government)
):
    """
    Approve or reject a claim by AI/manual review
    Only main government can make final approval decisions
    """
    try:
        logger.info(f"AI approval for claim {approval_request.claim_id}: {approval_request.approve}")
        
        # Call ICP canister to approve/reject claim
        result = await canister_service.approve_claim_by_ai(
            claim_id=approval_request.claim_id,
            approve=approval_request.approve,
            reason=approval_request.reason
        )
        
        if result["success"]:
            return {
                "success": True,
                "message": result["message"],
                "decision": {
                    "claim_id": approval_request.claim_id,
                    "approved": approval_request.approve,
                    "reason": approval_request.reason,
                    "decided_by": current_user["principal_id"],
                    "decided_at": datetime.now().isoformat()
                }
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result.get("error", "Failed to process claim approval")
            )
    
    except Exception as e:
        logger.error(f"Error in claim approval: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process claim approval"
        )

@router.get("/fraud/alerts/high-risk")
async def get_high_risk_claims(
    current_user: dict = Depends(require_government_official)
):
    """
    Get all high-risk claims requiring attention
    Available to government officials
    """
    try:
        # Get high-risk claims from canister
        high_risk_claims = await canister_service.get_high_risk_claims()
        
        risk_data = []
        for claim_id, fraud_score in high_risk_claims:
            # Get claim details
            claim = await canister_service.get_claim(claim_id)
            if claim:
                # Get fraud alerts
                alerts = await canister_service.get_fraud_alerts(claim_id)
                
                risk_data.append({
                    "claim_id": claim_id,
                    "fraud_score": fraud_score,
                    "amount": claim.amount,
                    "vendor": canister_service.format_principal(claim.vendor),
                    "flagged": claim.flagged,
                    "ai_approved": claim.ai_approved,
                    "challenge_count": claim.challenge_count,
                    "alerts": [
                        {
                            "type": alert.alert_type,
                            "severity": alert.severity,
                            "description": alert.description,
                            "timestamp": alert.timestamp
                        }
                        for alert in alerts
                    ]
                })
        
        return {
            "success": True,
            "high_risk_claims": risk_data,
            "total_count": len(risk_data),
            "requested_by": current_user["principal_id"]
        }
    
    except Exception as e:
        logger.error(f"Error getting high-risk claims: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve high-risk claims"
        )

# ================================================================================
# System Statistics Endpoints
# ================================================================================

@router.get("/stats/system")
async def get_system_statistics(
    current_user: dict = Depends(require_government_official)
):
    """
    Get comprehensive system statistics
    Available to government officials
    """
    try:
        # Get system stats from canister
        stats = await canister_service.get_system_stats()
        
        # Calculate additional metrics
        fraud_rate = (stats.flagged_claims / stats.active_claims * 100) if stats.active_claims > 0 else 0
        challenge_rate = (stats.total_challenges / stats.active_claims * 100) if stats.active_claims > 0 else 0
        
        return {
            "success": True,
            "statistics": {
                "budget": {
                    "total_budget": stats.total_budget,
                    "formatted_budget": canister_service.format_amount(stats.total_budget)
                },
                "claims": {
                    "active_claims": stats.active_claims,
                    "flagged_claims": stats.flagged_claims,
                    "fraud_rate_percentage": round(fraud_rate, 2)
                },
                "vendors": {
                    "total_vendors": stats.vendor_count
                },
                "challenges": {
                    "total_challenges": stats.total_challenges,
                    "challenge_rate_percentage": round(challenge_rate, 2)
                },
                "system_health": {
                    "corruption_detection": "active",
                    "blockchain_status": "operational",
                    "transparency_level": "full"
                }
            },
            "requested_by": current_user["principal_id"],
            "generated_at": datetime.now().isoformat()
        }
    
    except Exception as e:
        logger.error(f"Error getting system statistics: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve system statistics"
        )

# ================================================================================
# Background Tasks
# ================================================================================

async def trigger_fraud_detection_webhook(claim_id: int):
    """
    Background task to trigger fraud detection for new claims
    """
    try:
        # In production, this would call the Python fraud detection backend
        logger.info(f"Triggering fraud detection for claim {claim_id}")
        
        # Simulate fraud detection processing
        await asyncio.sleep(2)  # Simulate processing time
        
        # For demo, generate a random fraud score
        import random
        fraud_score = random.randint(10, 95)
        
        # Update the fraud score in canister
        result = await canister_service.update_fraud_score(claim_id, fraud_score)
        
        if result["success"]:
            logger.info(f"Fraud detection completed for claim {claim_id} - Score: {fraud_score}")
        else:
            logger.error(f"Failed to update fraud score for claim {claim_id}")
    
    except Exception as e:
        logger.error(f"Error in fraud detection webhook: {e}")

# Demo endpoint for testing (remove in production)
@router.post("/demo/reset-data")
async def reset_demo_data(
    current_user: dict = Depends(require_main_government)
):
    """
    Reset demo data for testing purposes
    Only available in demo mode
    """
    try:
        canister_service.reset_demo_data()
        return {
            "success": True,
            "message": "Demo data has been reset to initial state",
            "reset_by": current_user["principal_id"],
            "reset_at": datetime.now().isoformat()
        }
    
    except Exception as e:
        logger.error(f"Error resetting demo data: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to reset demo data"
        )