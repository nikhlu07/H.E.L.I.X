# backend/app/api/vendor.py - INTEGRATED
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, BackgroundTasks
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import logging
from datetime import datetime
import hashlib
import json

from ..auth.middleware import require_vendor_operations, get_current_user
from ..icp.canister_calls import canister_service
from ..schemas.vendor import ClaimSubmissionRequest, SupplierPaymentRequest

logger = logging.getLogger(__name__)
router = APIRouter()

# ================================================================================
# Claim Management Endpoints
# ================================================================================

@router.post("/claim/submit")
async def submit_claim(
    claim_request: ClaimSubmissionRequest,
    background_tasks: BackgroundTasks,
    current_user: dict = Depends(require_vendor_operations)
):
    """
    Submit a vendor claim for payment
    Only approved vendors can submit claims
    """
    try:
        logger.info(f"Vendor {current_user['principal_id']} submitting claim for {claim_request.amount}")
        
        # Generate invoice hash from claim data
        invoice_data = {
            "amount": claim_request.amount,
            "description": claim_request.description,
            "work_details": claim_request.work_details,
            "vendor": current_user['principal_id'],
            "timestamp": datetime.now().isoformat()
        }
        invoice_string = json.dumps(invoice_data, sort_keys=True)
        
        # Call ICP canister to submit claim
        result = await canister_service.submit_claim(
            budget_id=claim_request.budget_id,
            allocation_id=claim_request.allocation_id,
            amount=claim_request.amount,
            invoice_data=invoice_string
        )
        
        if result["success"]:
            claim_id = result["claim_id"]
            
            # Add background task for fraud detection
            background_tasks.add_task(trigger_fraud_analysis, claim_id, invoice_data)
            
            return {
                "success": True,
                "claim_id": claim_id,
                "message": f"Claim submitted successfully with ID {claim_id}",
                "claim_details": {
                    "claim_id": claim_id,
                    "amount": claim_request.amount,
                    "budget_id": claim_request.budget_id,
                    "allocation_id": claim_request.allocation_id,
                    "description": claim_request.description,
                    "vendor": current_user['principal_id'],
                    "submitted_at": datetime.now().isoformat(),
                    "status": "pending_review",
                    "fraud_detection": "initiated"
                }
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result.get("error", "Failed to submit claim")
            )
    
    except Exception as e:
        logger.error(f"Error submitting claim: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to submit claim"
        )

@router.get("/claims/my-claims")
async def get_my_claims(
    current_user: dict = Depends(require_vendor_operations)
):
    """
    Get all claims submitted by the current vendor
    """
    try:
        # Get all claims from canister
        all_claims = await canister_service.get_all_claims()
        
        # Filter claims for current vendor
        vendor_principal = current_user['principal_id']
        my_claims = []
        
        for claim_id, claim_summary in all_claims:
            # Get detailed claim info
            claim_details = await canister_service.get_claim(claim_id)
            
            if claim_details and claim_details.vendor == vendor_principal:
                # Get fraud alerts for this claim
                fraud_alerts = await canister_service.get_fraud_alerts(claim_id)
                
                my_claims.append({
                    "claim_id": claim_id,
                    "amount": claim_details.amount,
                    "formatted_amount": canister_service.format_amount(claim_details.amount),
                    "invoice_hash": claim_details.invoice_hash,
                    "deputy": canister_service.format_principal(claim_details.deputy),
                    "ai_approved": claim_details.ai_approved,
                    "flagged": claim_details.flagged,
                    "paid": claim_details.paid,
                    "fraud_score": claim_details.fraud_score,
                    "risk_level": canister_service.calculate_fraud_risk_level(claim_details.fraud_score),
                    "challenge_count": claim_details.challenge_count,
                    "total_paid_to_suppliers": claim_details.total_paid_to_suppliers,
                    "status": get_claim_status(claim_details),
                    "alerts": [
                        {
                            "type": alert.alert_type,
                            "severity": alert.severity,
                            "description": alert.description,
                            "timestamp": alert.timestamp,
                            "resolved": alert.resolved
                        }
                        for alert in fraud_alerts
                    ]
                })
        
        # Sort by claim_id descending (newest first)
        my_claims.sort(key=lambda x: x["claim_id"], reverse=True)
        
        return {
            "success": True,
            "claims": my_claims,
            "total_claims": len(my_claims),
            "total_amount": sum(claim["amount"] for claim in my_claims),
            "pending_claims": len([c for c in my_claims if c["status"] == "pending"]),
            "approved_claims": len([c for c in my_claims if c["status"] == "approved"]),
            "flagged_claims": len([c for c in my_claims if c["status"] == "flagged"]),
            "vendor": current_user['principal_id']
        }
    
    except Exception as e:
        logger.error(f"Error getting vendor claims: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve vendor claims"
        )

@router.get("/claim/{claim_id}/details")
async def get_claim_details(
    claim_id: int,
    current_user: dict = Depends(require_vendor_operations)
):
    """
    Get detailed information about a specific claim
    Only the vendor who submitted the claim can view details
    """
    try:
        # Get claim from canister
        claim = await canister_service.get_claim(claim_id)
        
        if not claim:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Claim not found"
            )
        
        # Verify the claim belongs to the current vendor
        if claim.vendor != current_user['principal_id']:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only view your own claims"
            )
        
        # Get fraud alerts
        fraud_alerts = await canister_service.get_fraud_alerts(claim_id)
        
        return {
            "success": True,
            "claim": {
                "claim_id": claim_id,
                "amount": claim.amount,
                "formatted_amount": canister_service.format_amount(claim.amount),
                "invoice_hash": claim.invoice_hash,
                "vendor": claim.vendor,
                "deputy": claim.deputy,
                "ai_approved": claim.ai_approved,
                "flagged": claim.flagged,
                "paid": claim.paid,
                "escrow_time": claim.escrow_time,
                "total_paid_to_suppliers": claim.total_paid_to_suppliers,
                "fraud_score": claim.fraud_score,
                "risk_level": canister_service.calculate_fraud_risk_level(claim.fraud_score),
                "challenge_count": claim.challenge_count,
                "status": get_claim_status(claim),
                "payment_progress": {
                    "total_amount": claim.amount,
                    "paid_to_suppliers": claim.total_paid_to_suppliers,
                    "remaining": claim.amount - claim.total_paid_to_suppliers,
                    "percentage_paid": round((claim.total_paid_to_suppliers / claim.amount) * 100, 2) if claim.amount > 0 else 0
                }
            },
            "fraud_alerts": [
                {
                    "alert_type": alert.alert_type,
                    "severity": alert.severity,
                    "description": alert.description,
                    "timestamp": alert.timestamp,
                    "resolved": alert.resolved
                }
                for alert in fraud_alerts
            ]
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting claim details: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve claim details"
        )

# ================================================================================
# Supplier Payment Management
# ================================================================================

@router.post("/payment/supplier")
async def pay_supplier(
    payment_request: SupplierPaymentRequest,
    current_user: dict = Depends(require_vendor_operations)
):
    """
    Pay a supplier/subcontractor
    Only vendors can make supplier payments from their approved claims
    """
    try:
        logger.info(f"Vendor {current_user['principal_id']} paying supplier {payment_request.supplier_principal}")
        
        # First verify the claim belongs to this vendor
        claim = await canister_service.get_claim(payment_request.claim_id)
        
        if not claim:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Claim not found"
            )
        
        if claim.vendor != current_user['principal_id']:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only make payments from your own claims"
            )
        
        if not claim.ai_approved or claim.flagged:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot make payments from unapproved or flagged claims"
            )
        
        # Check if payment amount is valid
        remaining_amount = claim.amount - claim.total_paid_to_suppliers
        if payment_request.amount > remaining_amount:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Payment amount exceeds remaining claim balance. Available: {remaining_amount}"
            )
        
        # TODO: In production, call canister's paySupplier method
        # For demo, we'll simulate the payment
        logger.info(f"Demo: Processing supplier payment of {payment_request.amount} to {payment_request.supplier_principal}")
        
        return {
            "success": True,
            "message": "Supplier payment processed successfully",
            "payment": {
                "claim_id": payment_request.claim_id,
                "supplier": payment_request.supplier_principal,
                "amount": payment_request.amount,
                "formatted_amount": canister_service.format_amount(payment_request.amount),
                "invoice_reference": payment_request.invoice_reference,
                "description": payment_request.description,
                "paid_by": current_user['principal_id'],
                "paid_at": datetime.now().isoformat(),
                "remaining_claim_balance": remaining_amount - payment_request.amount
            }
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing supplier payment: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process supplier payment"
        )

@router.get("/payment/history")
async def get_payment_history(
    current_user: dict = Depends(require_vendor_operations)
):
    """
    Get payment history for the current vendor
    Shows all payments made to suppliers
    """
    try:
        # TODO: In production, get actual payment history from canister
        # For demo, return simulated data
        
        payment_history = [
            {
                "payment_id": 1,
                "claim_id": 1,
                "supplier": "supplier_demo_1",
                "amount": 500000,
                "formatted_amount": canister_service.format_amount(500000),
                "description": "Materials supply for road construction",
                "paid_at": "2024-01-15T10:30:00Z",
                "status": "completed"
            },
            {
                "payment_id": 2,
                "claim_id": 1,
                "supplier": "supplier_demo_2",
                "amount": 300000,
                "formatted_amount": canister_service.format_amount(300000),
                "description": "Labor costs for project phase 1",
                "paid_at": "2024-01-20T14:45:00Z",
                "status": "completed"
            }
        ]
        
        total_paid = sum(p["amount"] for p in payment_history)
        
        return {
            "success": True,
            "payments": payment_history,
            "total_payments": len(payment_history),
            "total_amount_paid": total_paid,
            "formatted_total": canister_service.format_amount(total_paid),
            "vendor": current_user['principal_id']
        }
    
    except Exception as e:
        logger.error(f"Error getting payment history: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve payment history"
        )

# ================================================================================
# Vendor Performance and Analytics
# ================================================================================

@router.get("/performance/dashboard")
async def get_vendor_dashboard(
    current_user: dict = Depends(require_vendor_operations)
):
    """
    Get vendor performance dashboard data
    Shows key metrics and analytics for the vendor
    """
    try:
        # Get all vendor claims for analysis
        all_claims = await canister_service.get_all_claims()
        vendor_principal = current_user['principal_id']
        
        vendor_claims = []
        for claim_id, claim_summary in all_claims:
            claim_details = await canister_service.get_claim(claim_id)
            if claim_details and claim_details.vendor == vendor_principal:
                vendor_claims.append((claim_id, claim_details))
        
        # Calculate performance metrics
        total_claims = len(vendor_claims)
        total_amount = sum(claim.amount for _, claim in vendor_claims)
        approved_claims = sum(1 for _, claim in vendor_claims if claim.ai_approved)
        flagged_claims = sum(1 for _, claim in vendor_claims if claim.flagged)
        paid_claims = sum(1 for _, claim in vendor_claims if claim.paid)
        
        # Calculate average fraud score
        fraud_scores = [claim.fraud_score for _, claim in vendor_claims if claim.fraud_score is not None]
        avg_fraud_score = sum(fraud_scores) / len(fraud_scores) if fraud_scores else 0
        
        # Risk assessment
        risk_level = "low"
        if avg_fraud_score > 70:
            risk_level = "high"
        elif avg_fraud_score > 40:
            risk_level = "medium"
        
        return {
            "success": True,
            "dashboard": {
                "vendor_info": {
                    "principal_id": vendor_principal,
                    "formatted_principal": canister_service.format_principal(vendor_principal),
                    "registration_status": "approved",
                    "risk_level": risk_level
                },
                "claim_statistics": {
                    "total_claims": total_claims,
                    "approved_claims": approved_claims,
                    "flagged_claims": flagged_claims,
                    "paid_claims": paid_claims,
                    "pending_claims": total_claims - approved_claims - flagged_claims,
                    "approval_rate": round((approved_claims / total_claims) * 100, 2) if total_claims > 0 else 0,
                    "success_rate": round((paid_claims / total_claims) * 100, 2) if total_claims > 0 else 0
                },
                "financial_metrics": {
                    "total_claimed": total_amount,
                    "formatted_total": canister_service.format_amount(total_amount),
                    "average_claim_size": total_amount // total_claims if total_claims > 0 else 0,
                    "largest_claim": max((claim.amount for _, claim in vendor_claims), default=0),
                    "total_paid_to_suppliers": sum(claim.total_paid_to_suppliers for _, claim in vendor_claims)
                },
                "fraud_metrics": {
                    "average_fraud_score": round(avg_fraud_score, 2),
                    "fraud_score_trend": "stable",  # TODO: Calculate trend
                    "total_challenges": sum(claim.challenge_count for _, claim in vendor_claims),
                    "compliance_rating": "good" if avg_fraud_score < 40 else "fair" if avg_fraud_score < 70 else "poor"
                }
            }
        }
    
    except Exception as e:
        logger.error(f"Error getting vendor dashboard: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve vendor dashboard"
        )

# ================================================================================
# Document Management
# ================================================================================

@router.post("/documents/upload")
async def upload_claim_document(
    file: UploadFile = File(...),
    claim_id: Optional[int] = None,
    document_type: str = "invoice",
    current_user: dict = Depends(require_vendor_operations)
):
    """
    Upload supporting documents for claims
    """
    try:
        # Validate file type
        allowed_types = [".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"]
        file_extension = "." + file.filename.split(".")[-1].lower()
        
        if file_extension not in allowed_types:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File type {file_extension} not allowed. Allowed types: {allowed_types}"
            )
        
        # Read file content
        content = await file.read()
        
        # Generate file hash
        file_hash = hashlib.sha256(content).hexdigest()
        
        # TODO: In production, store file in secure storage and record in canister
        logger.info(f"Uploaded document: {file.filename} ({len(content)} bytes) for vendor {current_user['principal_id']}")
        
        return {
            "success": True,
            "message": "Document uploaded successfully",
            "document": {
                "filename": file.filename,
                "file_size": len(content),
                "file_hash": file_hash,
                "document_type": document_type,
                "claim_id": claim_id,
                "uploaded_by": current_user['principal_id'],
                "uploaded_at": datetime.now().isoformat()
            }
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error uploading document: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to upload document"
        )

# ================================================================================
# Helper Functions
# ================================================================================

def get_claim_status(claim) -> str:
    """Determine claim status based on claim properties"""
    if claim.paid:
        return "paid"
    elif claim.flagged:
        return "flagged"
    elif claim.ai_approved:
        return "approved"
    else:
        return "pending"

async def trigger_fraud_analysis(claim_id: int, invoice_data: dict):
    """
    Background task to trigger fraud analysis
    """
    try:
        logger.info(f"Triggering fraud analysis for claim {claim_id}")
        
        # TODO: In production, call fraud detection microservice
        # For demo, simulate analysis delay
        import asyncio
        await asyncio.sleep(3)
        
        # Simulate fraud scoring
        import random
        base_score = 15
        
        # Add penalties based on amount
        if invoice_data.get("amount", 0) > 1000000:
            base_score += 30
        
        # Add random variation
        final_score = base_score + random.randint(0, 25)
        
        # Update fraud score in canister
        await canister_service.update_fraud_score(claim_id, final_score)
        
        logger.info(f"Fraud analysis completed for claim {claim_id} - Score: {final_score}")
        
    except Exception as e:
        logger.error(f"Error in fraud analysis: {e}")