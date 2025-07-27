"""
CorruptGuard Citizen API Routes
Public transparency endpoints for citizen oversight and corruption reporting
"""

from fastapi import APIRouter, Depends, HTTPException, Query, File, UploadFile
from typing import List, Optional, Dict, Any
from datetime import datetime

from app.schemas.base import (
    ChallengeCreate, ChallengeResponse, ChallengeStatus,
    ClaimResponse, ResponseSchema, SystemStats
)
from app.api.deps import (
    get_citizen_user, get_optional_user,
    PaginationParams, SearchParams, get_client_info,
    validate_amount
)
from app.utils.logging import log_user_action, get_logger

logger = get_logger(__name__)
router = APIRouter()

# ===== PUBLIC TRANSPARENCY ENDPOINTS =====

@router.get("/spending/overview")
async def get_public_spending_overview(
    pagination: PaginationParams = Depends(),
    search: SearchParams = Depends(),
    user: Optional[Dict[str, Any]] = Depends(get_optional_user)
):
    """
    Get public overview of government spending
    Available to everyone (no authentication required)
    Maps to: getBudgetTransparency() in Motoko contract
    """
    logger.info("Public spending overview requested")
    
    try:
        # TODO: Query ICP canister getBudgetTransparency
        spending_data = [
            {
                "budget_id": 1,
                "purpose": "Highway Development Phase 2",
                "total_amount": 10000000.0,
                "allocated_amount": 7500000.0,
                "spent_amount": 2000000.0,
                "remaining_amount": 2500000.0,
                "utilization_percentage": 26.7,
                "projects": 3,
                "status": "active"
            },
            {
                "budget_id": 2,
                "purpose": "School Infrastructure Upgrade",
                "total_amount": 5000000.0,
                "allocated_amount": 3200000.0,
                "spent_amount": 800000.0,
                "remaining_amount": 1800000.0,
                "utilization_percentage": 25.0,
                "projects": 2,
                "status": "active"
            }
        ]
        
        summary = {
            "total_budget": sum(d["total_amount"] for d in spending_data),
            "total_allocated": sum(d["allocated_amount"] for d in spending_data),
            "total_spent": sum(d["spent_amount"] for d in spending_data),
            "avg_utilization": sum(d["utilization_percentage"] for d in spending_data) / len(spending_data),
            "active_budgets": len([d for d in spending_data if d["status"] == "active"])
        }
        
        return ResponseSchema(
            message="Public spending overview retrieved",
            data={
                "summary": summary,
                "budgets": spending_data
            }
        )
        
    except Exception as e:
        logger.error(f"Error getting spending overview: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get spending overview")

@router.get("/claims/public")
async def get_public_claims(
    pagination: PaginationParams = Depends(),
    search: SearchParams = Depends(),
    risk_level: Optional[str] = Query(None, description="Filter by risk level"),
    user: Optional[Dict[str, Any]] = Depends(get_optional_user)
):
    """
    Get public view of government claims (anonymized)
    Available to everyone for transparency
    Maps to: getAllClaims() in Motoko contract
    """
    logger.info("Public claims data requested")
    
    try:
        # TODO: Query ICP canister getAllClaims
        # Return anonymized data for public consumption
        claims = [
            {
                "claim_id": 101,
                "amount": 250000.0,
                "area": "Infrastructure",
                "description": "Highway repair work",
                "status": "under_review",
                "fraud_score": 15,
                "risk_level": "low",
                "challenge_count": 0,
                "submitted_date": datetime.utcnow(),
                "location": "Mumbai-Pune Highway"
            },
            {
                "claim_id": 102,
                "amount": 850000.0,
                "area": "Infrastructure", 
                "description": "Bridge construction",
                "status": "flagged",
                "fraud_score": 85,
                "risk_level": "high",
                "challenge_count": 2,
                "submitted_date": datetime.utcnow(),
                "location": "Thane District"
            },
            {
                "claim_id": 103,
                "amount": 180000.0,
                "area": "Education",
                "description": "School building work",
                "status": "approved",
                "fraud_score": 12,
                "risk_level": "low",
                "challenge_count": 0,
                "submitted_date": datetime.utcnow(),
                "location": "Pune District"
            }
        ]
        
        # Apply risk level filter
        if risk_level:
            claims = [c for c in claims if c["risk_level"] == risk_level]
        
        # Calculate statistics
        total_amount = sum(c["amount"] for c in claims)
        high_risk_count = len([c for c in claims if c["fraud_score"] >= 70])
        flagged_count = len([c for c in claims if c["status"] == "flagged"])
        
        return ResponseSchema(
            message="Public claims data retrieved",
            data={
                "claims": claims,
                "statistics": {
                    "total_claims": len(claims),
                    "total_amount": total_amount,
                    "high_risk_claims": high_risk_count,
                    "flagged_claims": flagged_count,
                    "avg_fraud_score": sum(c["fraud_score"] for c in claims) / len(claims) if claims else 0
                }
            }
        )
        
    except Exception as e:
        logger.error(f"Error getting public claims: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get public claims")

# ===== CORRUPTION CHALLENGE ENDPOINTS =====

@router.post("/challenges/submit", response_model=ChallengeResponse)
async def submit_challenge(
    challenge: ChallengeCreate,
    user: Dict[str, Any] = Depends(get_citizen_user),
    client_info: Dict[str, Any] = Depends(get_client_info)
):
    """
    Submit a corruption challenge against a claim
    Maps to: stakeChallenge(invoiceHash, reason, evidence) in Motoko contract
    """
    challenge.stake_amount = validate_amount(challenge.stake_amount)
    logger.info(f"Citizen submitting challenge: {challenge.invoice_hash}")
    
    try:
        # TODO: Call ICP canister stakeChallenge function
        # This will:
        # 1. Validate invoice hash exists
        # 2. Transfer ICP stake from citizen
        # 3. Record challenge with evidence
        
        challenge_response = ChallengeResponse(
            id=123,  # Would come from canister
            invoice_hash=challenge.invoice_hash,
            reason=challenge.reason,
            evidence=challenge.evidence,
            challenger_principal=user["principal"],
            stake_amount=challenge.stake_amount,
            status=ChallengeStatus.SUBMITTED,
            withdrawn=False,
            created_at=datetime.utcnow()
        )
        
        log_user_action(
            user_principal=user["principal"],
            action="SUBMIT_CHALLENGE",
            resource=f"challenge/{challenge_response.id}",
            details={
                "challenge_id": challenge_response.id,
                "invoice_hash": challenge.invoice_hash,
                "stake_amount": challenge.stake_amount,
                "reason": challenge.reason[:100],  # Truncate for logging
                "client_ip": client_info.get("ip")
            }
        )
        
        return challenge_response
        
    except Exception as e:
        logger.error(f"Error submitting challenge: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to submit challenge")

@router.post("/challenges/{challenge_id}/evidence/upload")
async def upload_challenge_evidence(
    challenge_id: int,
    files: List[UploadFile] = File(...),
    description: Optional[str] = Query(None, description="Evidence description"),
    user: Dict[str, Any] = Depends(get_citizen_user)
):
    """
    Upload evidence files for a corruption challenge
    """
    logger.info(f"Citizen uploading evidence for challenge {challenge_id}")
    
    try:
        # TODO: Process and store evidence files
        # TODO: Update challenge with evidence hashes
        
        evidence_hashes = []
        for file in files:
            # Simulate evidence processing
            file_hash = f"ipfs_evidence_{file.filename}_{datetime.utcnow().timestamp()}"
            evidence_hashes.append({
                "filename": file.filename,
                "hash": file_hash,
                "size": file.size if hasattr(file, 'size') else 0,
                "uploaded_at": datetime.utcnow()
            })
        
        log_user_action(
            user_principal=user["principal"],
            action="UPLOAD_EVIDENCE",
            resource=f"challenge/{challenge_id}",
            details={
                "challenge_id": challenge_id,
                "evidence_count": len(files),
                "description": description,
                "evidence": evidence_hashes
            }
        )
        
        return ResponseSchema(
            message=f"Uploaded {len(files)} evidence files for challenge {challenge_id}",
            data={
                "challenge_id": challenge_id,
                "evidence": evidence_hashes,
                "description": description
            }
        )
        
    except Exception as e:
        logger.error(f"Error uploading evidence: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to upload evidence")

@router.get("/challenges/my", response_model=List[ChallengeResponse])
async def get_my_challenges(
    pagination: PaginationParams = Depends(),
    status: Optional[ChallengeStatus] = Query(None, description="Filter by status"),
    user: Dict[str, Any] = Depends(get_citizen_user)
):
    """
    Get all challenges submitted by this citizen
    """
    logger.info(f"Citizen requesting their challenges: {user['principal']}")
    
    try:
        # TODO: Query database for citizen's challenges
        challenges = [
            ChallengeResponse(
                id=101,
                invoice_hash="invoice_hash_suspicious_claim",
                reason="Claimed road repair work not visible at location",
                evidence="ipfs_hash_photos_location",
                challenger_principal=user["principal"],
                stake_amount=1000.0,
                status=ChallengeStatus.INVESTIGATING,
                withdrawn=False,
                created_at=datetime.utcnow()
            ),
            ChallengeResponse(
                id=98,
                invoice_hash="invoice_hash_overpriced_supplies",
                reason="School supplies quoted 60% above market rate",
                evidence="ipfs_hash_market_comparison",
                challenger_principal=user["principal"],
                stake_amount=1000.0,
                status=ChallengeStatus.RESOLVED,
                withdrawn=False,
                reward_amount=5000.0,
                created_at=datetime.utcnow()
            )
        ]
        
        # Apply status filter
        if status:
            challenges = [c for c in challenges if c.status == status]
        
        return challenges
        
    except Exception as e:
        logger.error(f"Error getting citizen challenges: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get challenges")

# ===== PROJECT VERIFICATION ENDPOINTS =====

@router.post("/projects/{project_id}/verify")
async def verify_project_existence(
    project_id: int,
    exists: bool,
    notes: Optional[str] = None,
    location_lat: Optional[float] = Query(None, description="Latitude of verification"),
    location_lng: Optional[float] = Query(None, description="Longitude of verification"),
    user: Dict[str, Any] = Depends(get_citizen_user),
    client_info: Dict[str, Any] = Depends(get_client_info)
):
    """
    Verify whether a claimed project actually exists at the specified location
    """
    logger.info(f"Citizen verifying project {project_id}: {'exists' if exists else 'does not exist'}")
    
    try:
        # TODO: Store project verification in database
        # TODO: Link to project and update verification status
        
        verification = {
            "project_id": project_id,
            "verified_by": user["principal"],
            "exists": exists,
            "notes": notes,
            "location": {
                "lat": location_lat,
                "lng": location_lng
            } if location_lat and location_lng else None,
            "verified_at": datetime.utcnow()
        }
        
        log_user_action(
            user_principal=user["principal"],
            action="VERIFY_PROJECT",
            resource=f"project/{project_id}",
            details={
                "project_id": project_id,
                "exists": exists,
                "notes": notes,
                "location": verification["location"],
                "client_ip": client_info.get("ip")
            }
        )
        
        return ResponseSchema(
            message=f"Project {project_id} verification recorded",
            data=verification
        )
        
    except Exception as e:
        logger.error(f"Error verifying project: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to verify project")

@router.post("/projects/{project_id}/photos/upload")
async def upload_project_photos(
    project_id: int,
    photos: List[UploadFile] = File(...),
    description: Optional[str] = Query(None, description="Photo description"),
    user: Dict[str, Any] = Depends(get_citizen_user)
):
    """
    Upload photos of a project site for verification
    """
    logger.info(f"Citizen uploading photos for project {project_id}")
    
    try:
        # TODO: Process and store project photos
        # TODO: Extract metadata (GPS, timestamp) if available
        
        photo_hashes = []
        for photo in photos:
            # Simulate photo processing
            photo_hash = f"ipfs_photo_{photo.filename}_{datetime.utcnow().timestamp()}"
            photo_hashes.append({
                "filename": photo.filename,
                "hash": photo_hash,
                "size": photo.size if hasattr(photo, 'size') else 0,
                "uploaded_at": datetime.utcnow()
            })
        
        log_user_action(
            user_principal=user["principal"],
            action="UPLOAD_PROJECT_PHOTOS",
            resource=f"project/{project_id}",
            details={
                "project_id": project_id,
                "photo_count": len(photos),
                "description": description,
                "photos": photo_hashes
            }
        )
        
        return ResponseSchema(
            message=f"Uploaded {len(photos)} photos for project {project_id}",
            data={
                "project_id": project_id,
                "photos": photo_hashes,
                "description": description
            }
        )
        
    except Exception as e:
        logger.error(f"Error uploading project photos: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to upload photos")

# ===== CITIZEN STATISTICS ENDPOINTS =====

@router.get("/statistics/corruption-prevention")
async def get_corruption_prevention_stats(
    user: Optional[Dict[str, Any]] = Depends(get_optional_user)
):
    """
    Get statistics about corruption prevention efforts
    Available to everyone for transparency
    Maps to: getSystemStats() in Motoko contract
    """
    logger.info("Corruption prevention statistics requested")
    
    try:
        # TODO: Query ICP canister getSystemStats
        stats = {
            "corruption_prevented": {
                "total_amount": 2500000.0,
                "cases_blocked": 15,
                "avg_case_amount": 166666.67,
                "this_month": 340000.0
            },
            "citizen_participation": {
                "total_challenges": 47,
                "successful_challenges": 12,
                "success_rate": 25.5,
                "active_citizens": 1240,
                "rewards_distributed": 60000.0
            },
            "fraud_detection": {
                "total_claims_analyzed": 1247,
                "high_risk_detected": 89,
                "detection_accuracy": 85.3,
                "ai_approvals": 1104,
                "manual_reviews": 143
            },
            "transparency_metrics": {
                "public_budget": 50000000.0,
                "allocated_budget": 35000000.0,
                "spent_amount": 8500000.0,
                "utilization_rate": 24.3
            }
        }
        
        return ResponseSchema(
            message="Corruption prevention statistics retrieved",
            data=stats
        )
        
    except Exception as e:
        logger.error(f"Error getting corruption stats: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get corruption statistics")

@router.get("/leaderboard/corruption-fighters")
async def get_corruption_fighters_leaderboard(
    pagination: PaginationParams = Depends(),
    user: Optional[Dict[str, Any]] = Depends(get_optional_user)
):
    """
    Get leaderboard of citizens who have successfully identified corruption
    (Anonymized for privacy)
    """
    logger.info("Corruption fighters leaderboard requested")
    
    try:
        # TODO: Query database for successful challenge statistics
        # Return anonymized data
        leaderboard = [
            {
                "rank": 1,
                "citizen_id": "citizen_***789",
                "successful_challenges": 5,
                "corruption_prevented": 450000.0,
                "rewards_earned": 25000.0,
                "accuracy_rate": 83.3
            },
            {
                "rank": 2,
                "citizen_id": "citizen_***456",
                "successful_challenges": 4,
                "corruption_prevented": 380000.0,
                "rewards_earned": 20000.0,
                "accuracy_rate": 80.0
            },
            {
                "rank": 3,
                "citizen_id": "citizen_***123",
                "successful_challenges": 3,
                "corruption_prevented": 280000.0,
                "rewards_earned": 15000.0,
                "accuracy_rate": 75.0
            }
        ]
        
        return ResponseSchema(
            message="Corruption fighters leaderboard retrieved",
            data={
                "leaderboard": leaderboard,
                "total_participants": 1240,
                "total_rewards": 60000.0,
                "last_updated": datetime.utcnow()
            }
        )
        
    except Exception as e:
        logger.error(f"Error getting leaderboard: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get leaderboard")

# ===== CITIZEN DASHBOARD ENDPOINTS =====

@router.get("/dashboard/stats")
async def get_citizen_dashboard_stats(
    user: Dict[str, Any] = Depends(get_citizen_user)
):
    """
    Get dashboard statistics for citizen
    """
    logger.info(f"Citizen requesting dashboard stats: {user['principal']}")
    
    try:
        # TODO: Calculate citizen-specific statistics
        stats = {
            "my_challenges": {
                "total_submitted": 3,
                "under_investigation": 1,
                "resolved_successful": 2,
                "resolved_unsuccessful": 0,
                "total_staked": 3000.0,
                "total_rewards": 10000.0
            },
            "my_verifications": {
                "projects_verified": 8,
                "photos_uploaded": 24,
                "accuracy_score": 92.5
            },
            "impact": {
                "corruption_prevented": 830000.0,
                "community_rank": 15,
                "contribution_score": 850
            },
            "recent_activity": [
                {
                    "action": "Challenge submitted",
                    "target": "Claim #102",
                    "date": datetime.utcnow(),
                    "status": "investigating"
                },
                {
                    "action": "Project verified",
                    "target": "Highway repair project",
                    "date": datetime.utcnow(),
                    "status": "completed"
                }
            ]
        }
        
        return ResponseSchema(
            message="Citizen dashboard stats retrieved",
            data=stats
        )
        
    except Exception as e:
        logger.error(f"Error getting citizen dashboard stats: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get dashboard stats")