"""
CorruptGuard Deputy API Routes
Deputy management endpoints for vendor selection and project oversight
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional, Dict, Any
from datetime import datetime

from app.schemas.base import (
    ProjectCreate, ProjectResponse, ClaimResponse,
    VendorResponse, ResponseSchema, ClaimStatus
)
from app.api.deps import (
    get_deputy_user, get_any_government_user,
    PaginationParams, SearchParams, get_client_info,
    validate_principal_id, validate_amount
)
from app.utils.logging import log_user_action, get_logger

logger = get_logger(__name__)
router = APIRouter()

# ===== VENDOR SELECTION ENDPOINTS =====

@router.post("/vendor/select")
async def select_vendor(
    budget_id: int,
    allocation_id: int,
    vendor_principal: str,
    user: Dict[str, Any] = Depends(get_deputy_user),
    client_info: Dict[str, Any] = Depends(get_client_info)
):
    """
    Select a vendor for a specific budget allocation
    Maps to: selectVendor(budgetId, allocationId, vendor) in Motoko contract
    """
    vendor_principal = validate_principal_id(vendor_principal)
    logger.info(f"Deputy selecting vendor {vendor_principal} for budget {budget_id}")
    
    try:
        # TODO: Call ICP canister selectVendor function
        # Validate that:
        # 1. Budget allocation exists and belongs to this deputy
        # 2. Vendor is approved and available
        # 3. No vendor already selected for this allocation
        
        log_user_action(
            user_principal=user["principal"],
            action="SELECT_VENDOR",
            resource=f"budget/{budget_id}/allocation/{allocation_id}",
            details={
                "budget_id": budget_id,
                "allocation_id": allocation_id,
                "vendor_principal": vendor_principal,
                "client_ip": client_info.get("ip")
            }
        )
        
        return ResponseSchema(
            message=f"Vendor {vendor_principal} selected for allocation {allocation_id}",
            data={
                "budget_id": budget_id,
                "allocation_id": allocation_id,
                "vendor_principal": vendor_principal,
                "selected_at": datetime.utcnow()
            }
        )
        
    except Exception as e:
        logger.error(f"Error selecting vendor: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to select vendor")

@router.get("/vendors/available", response_model=List[VendorResponse])
async def get_available_vendors(
    pagination: PaginationParams = Depends(),
    search: SearchParams = Depends(),
    user: Dict[str, Any] = Depends(get_deputy_user)
):
    """
    Get list of available approved vendors for selection
    """
    logger.info(f"Deputy requesting available vendors: {user['principal']}")
    
    try:
        # TODO: Query ICP canister for approved vendors
        # Return mock data for now
        vendors = [
            VendorResponse(
                id=1,
                principal_id="vendor-principal-101",
                name="ABC Construction Ltd",
                registration_number="REG123456",
                contact_email="contact@abc-construction.com",
                phone="+91-98765-43210",
                approved=True,
                risk_score=25,
                rating=4.2,
                total_projects=15,
                total_earnings=2500000.0,
                last_activity=datetime.utcnow(),
                created_at=datetime.utcnow()
            ),
            VendorResponse(
                id=2,
                principal_id="vendor-principal-102",
                name="XYZ Infrastructure Pvt Ltd",
                registration_number="REG789012",
                contact_email="info@xyz-infra.com",
                phone="+91-87654-32109",
                approved=True,
                risk_score=15,
                rating=4.7,
                total_projects=22,
                total_earnings=4200000.0,
                last_activity=datetime.utcnow(),
                created_at=datetime.utcnow()
            )
        ]
        
        return vendors
        
    except Exception as e:
        logger.error(f"Error getting available vendors: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get available vendors")

# ===== PROJECT MANAGEMENT ENDPOINTS =====

@router.post("/projects/create", response_model=ProjectResponse)
async def create_project(
    project: ProjectCreate,
    user: Dict[str, Any] = Depends(get_deputy_user),
    client_info: Dict[str, Any] = Depends(get_client_info)
):
    """
    Create a new project under deputy's jurisdiction
    """
    logger.info(f"Deputy creating project: {project.name}")
    
    try:
        # TODO: Store project in database and link to deputy
        project_response = ProjectResponse(
            id=123,
            name=project.name,
            description=project.description,
            area=project.area,
            location=project.location,
            allocated_budget=project.estimated_cost,
            spent_amount=0.0,
            assigned_deputy=user["principal"],
            completion_percentage=0.0,
            created_at=datetime.utcnow()
        )
        
        log_user_action(
            user_principal=user["principal"],
            action="CREATE_PROJECT",
            resource=f"project/{project_response.id}",
            details={
                "project_name": project.name,
                "estimated_cost": project.estimated_cost,
                "client_ip": client_info.get("ip")
            }
        )
        
        return project_response
        
    except Exception as e:
        logger.error(f"Error creating project: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create project")

@router.get("/projects", response_model=List[ProjectResponse])
async def get_deputy_projects(
    pagination: PaginationParams = Depends(),
    search: SearchParams = Depends(),
    user: Dict[str, Any] = Depends(get_deputy_user)
):
    """
    Get all projects assigned to this deputy
    """
    logger.info(f"Deputy requesting projects: {user['principal']}")
    
    try:
        # TODO: Query database for projects assigned to this deputy
        projects = [
            ProjectResponse(
                id=1,
                name="Highway Maintenance Phase 2",
                description="Repair and maintenance of 50km highway stretch",
                area="Infrastructure",
                location="Mumbai-Pune Highway",
                allocated_budget=5000000.0,
                spent_amount=1200000.0,
                assigned_deputy=user["principal"],
                assigned_vendor="vendor-principal-101",
                completion_percentage=24.0,
                created_at=datetime.utcnow()
            ),
            ProjectResponse(
                id=2,
                name="School Building Construction",
                description="Construction of new primary school building",
                area="Education",
                location="Thane District",
                allocated_budget=3000000.0,
                spent_amount=800000.0,
                assigned_deputy=user["principal"],
                completion_percentage=26.7,
                created_at=datetime.utcnow()
            )
        ]
        
        return projects
        
    except Exception as e:
        logger.error(f"Error getting deputy projects: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get projects")

# ===== CLAIM REVIEW ENDPOINTS =====

@router.get("/claims/pending", response_model=List[ClaimResponse])
async def get_pending_claims(
    pagination: PaginationParams = Depends(),
    search: SearchParams = Depends(),
    user: Dict[str, Any] = Depends(get_deputy_user)
):
    """
    Get all pending claims for deputy review
    Maps to queries from Motoko contract getClaim() for deputy's claims
    """
    logger.info(f"Deputy requesting pending claims: {user['principal']}")
    
    try:
        # TODO: Query ICP canister for claims assigned to this deputy
        claims = [
            ClaimResponse(
                id=101,
                budget_id=1,
                allocation_id=0,
                amount=250000.0,
                description="Highway pothole repair - Section A",
                vendor_principal="vendor-principal-101",
                deputy_principal=user["principal"],
                status=ClaimStatus.PENDING,
                fraud_score=15,
                ai_approved=False,
                flagged=False,
                paid=False,
                total_paid_to_suppliers=0.0,
                challenge_count=0,
                created_at=datetime.utcnow()
            ),
            ClaimResponse(
                id=102,
                budget_id=2,
                allocation_id=0,
                amount=180000.0,
                description="School foundation work completion",
                vendor_principal="vendor-principal-102",
                deputy_principal=user["principal"],
                status=ClaimStatus.UNDER_REVIEW,
                fraud_score=85,  # High risk
                ai_approved=False,
                flagged=True,
                paid=False,
                total_paid_to_suppliers=0.0,
                challenge_count=1,
                created_at=datetime.utcnow()
            )
        ]
        
        return claims
        
    except Exception as e:
        logger.error(f"Error getting pending claims: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get pending claims")

@router.post("/claims/{claim_id}/review")
async def review_claim(
    claim_id: int,
    approve: bool,
    notes: Optional[str] = None,
    user: Dict[str, Any] = Depends(get_deputy_user),
    client_info: Dict[str, Any] = Depends(get_client_info)
):
    """
    Review and approve/reject a vendor claim
    This adds deputy oversight before final AI/fraud processing
    """
    logger.info(f"Deputy reviewing claim {claim_id}: {'approve' if approve else 'reject'}")
    
    try:
        # TODO: Update claim status in database
        # TODO: If approved, trigger fraud detection analysis
        
        log_user_action(
            user_principal=user["principal"],
            action="REVIEW_CLAIM",
            resource=f"claim/{claim_id}",
            details={
                "claim_id": claim_id,
                "approved": approve,
                "notes": notes,
                "client_ip": client_info.get("ip")
            }
        )
        
        status = "approved for processing" if approve else "rejected"
        return ResponseSchema(
            message=f"Claim {claim_id} {status}",
            data={
                "claim_id": claim_id,
                "approved": approve,
                "notes": notes,
                "reviewed_by": user["principal"],
                "reviewed_at": datetime.utcnow()
            }
        )
        
    except Exception as e:
        logger.error(f"Error reviewing claim: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to review claim")

# ===== ALLOCATION MANAGEMENT ENDPOINTS =====

@router.get("/allocations", response_model=List[Dict[str, Any]])
async def get_deputy_allocations(
    pagination: PaginationParams = Depends(),
    user: Dict[str, Any] = Depends(get_deputy_user)
):
    """
    Get all budget allocations assigned to this deputy
    """
    logger.info(f"Deputy requesting allocations: {user['principal']}")
    
    try:
        # TODO: Query ICP canister for allocations assigned to this deputy
        allocations = [
            {
                "budget_id": 1,
                "allocation_id": 0,
                "amount": 5000000.0,
                "area": "Highway Maintenance",
                "state_head": "state-head-principal-456",
                "assigned": True,
                "vendor_assigned": "vendor-principal-101",
                "remaining_amount": 3800000.0,
                "utilized_amount": 1200000.0
            },
            {
                "budget_id": 2,
                "allocation_id": 0,
                "amount": 3000000.0,
                "area": "School Infrastructure",
                "state_head": "state-head-principal-456",
                "assigned": True,
                "vendor_assigned": "vendor-principal-102",
                "remaining_amount": 2200000.0,
                "utilized_amount": 800000.0
            }
        ]
        
        return allocations
        
    except Exception as e:
        logger.error(f"Error getting deputy allocations: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get allocations")

# ===== REPORTING ENDPOINTS =====

@router.get("/dashboard/stats")
async def get_deputy_dashboard_stats(
    user: Dict[str, Any] = Depends(get_deputy_user)
):
    """
    Get dashboard statistics for deputy
    """
    logger.info(f"Deputy requesting dashboard stats: {user['principal']}")
    
    try:
        # TODO: Calculate real statistics from database/canister
        stats = {
            "total_allocations": 2,
            "total_allocated_amount": 8000000.0,
            "total_utilized_amount": 2000000.0,
            "active_projects": 2,
            "pending_claims": 2,
            "high_risk_claims": 1,
            "completed_projects": 0,
            "vendor_performance_avg": 4.45
        }
        
        return ResponseSchema(
            message="Deputy dashboard stats retrieved",
            data=stats
        )
        
    except Exception as e:
        logger.error(f"Error getting deputy dashboard stats: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get dashboard stats")

@router.get("/reports/utilization")
async def get_budget_utilization_report(
    user: Dict[str, Any] = Depends(get_deputy_user)
):
    """
    Get budget utilization report for deputy's allocations
    """
    logger.info(f"Deputy requesting utilization report: {user['principal']}")
    
    try:
        # TODO: Generate actual utilization report from data
        report = {
            "total_allocated": 8000000.0,
            "total_utilized": 2000000.0,
            "utilization_percentage": 25.0,
            "by_project": [
                {
                    "project_name": "Highway Maintenance Phase 2",
                    "allocated": 5000000.0,
                    "utilized": 1200000.0,
                    "percentage": 24.0
                },
                {
                    "project_name": "School Building Construction",
                    "allocated": 3000000.0,
                    "utilized": 800000.0,
                    "percentage": 26.7
                }
            ],
            "efficiency_score": 85.5,
            "on_budget_projects": 2,
            "over_budget_projects": 0
        }
        
        return ResponseSchema(
            message="Budget utilization report generated",
            data=report
        )
        
    except Exception as e:
        logger.error(f"Error generating utilization report: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate report")