# backend/app/schemas/government.py - NEW
from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime

class BudgetCreateRequest(BaseModel):
    amount: int = Field(..., gt=0, description="Budget amount in base currency units")
    purpose: str = Field(..., min_length=5, max_length=200, description="Purpose of the budget")
    
    @validator('amount')
    def validate_amount(cls, v):
        if v > 100_000_000:  # 100M limit
            raise ValueError('Budget amount exceeds maximum limit')
        return v
    
    @validator('purpose')
    def validate_purpose(cls, v):
        if not v.strip():
            raise ValueError('Purpose cannot be empty')
        return v.strip()

class BudgetAllocationRequest(BaseModel):
    amount: int = Field(..., gt=0, description="Amount to allocate")
    area: str = Field(..., min_length=3, max_length=100, description="Area/region for allocation")
    deputy: str = Field(..., min_length=10, description="Deputy principal ID")
    
    @validator('deputy')
    def validate_deputy_principal(cls, v):
        # Basic principal ID validation
        if len(v) < 20:
            raise ValueError('Invalid deputy principal ID format')
        return v

class StateHeadProposal(BaseModel):
    principal_id: str = Field(..., min_length=20, description="Principal ID of proposed state head")
    reason: Optional[str] = Field(None, max_length=500, description="Reason for proposal")
    
    @validator('principal_id')
    def validate_principal_id(cls, v):
        if len(v) < 20:
            raise ValueError('Invalid principal ID format')
        return v

class VendorProposal(BaseModel):
    principal_id: str = Field(..., min_length=20, description="Vendor principal ID")
    company_name: str = Field(..., min_length=2, max_length=100, description="Company name")
    business_type: str = Field(..., max_length=50, description="Type of business")
    contact_info: Optional[str] = Field(None, max_length=200, description="Contact information")
    
    @validator('company_name')
    def validate_company_name(cls, v):
        if not v.strip():
            raise ValueError('Company name cannot be empty')
        return v.strip()

class FraudScoreUpdate(BaseModel):
    claim_id: int = Field(..., gt=0, description="Claim ID to update")
    score: int = Field(..., ge=0, le=100, description="Fraud score (0-100)")
    reason: Optional[str] = Field(None, max_length=500, description="Reason for score update")

class ClaimApprovalRequest(BaseModel):
    claim_id: int = Field(..., gt=0, description="Claim ID to approve/reject")
    approve: bool = Field(..., description="Whether to approve the claim")
    reason: str = Field(..., min_length=5, max_length=500, description="Reason for decision")

# backend/app/schemas/vendor.py - NEW
class ClaimSubmissionRequest(BaseModel):
    budget_id: int = Field(..., gt=0, description="Budget ID for the claim")
    allocation_id: int = Field(..., ge=0, description="Allocation ID within the budget")
    amount: int = Field(..., gt=0, description="Claim amount")
    description: str = Field(..., min_length=10, max_length=500, description="Work description")
    work_details: str = Field(..., min_length=20, max_length=2000, description="Detailed work information")
    
    @validator('amount')
    def validate_claim_amount(cls, v):
        if v > 10_000_000:  # 10M limit for single claim
            raise ValueError('Claim amount exceeds maximum limit')
        return v

class SupplierPaymentRequest(BaseModel):
    claim_id: int = Field(..., gt=0, description="Claim ID to pay from")
    supplier_principal: str = Field(..., min_length=20, description="Supplier principal ID")
    amount: int = Field(..., gt=0, description="Payment amount")
    invoice_reference: str = Field(..., min_length=5, max_length=100, description="Invoice reference")
    description: str = Field(..., min_length=5, max_length=300, description="Payment description")

# backend/app/schemas/citizen.py - NEW
class ChallengeStakeRequest(BaseModel):
    invoice_hash: str = Field(..., min_length=10, description="Invoice hash to challenge")
    reason: str = Field(..., min_length=10, max_length=500, description="Reason for challenge")
    evidence: str = Field(..., min_length=10, max_length=2000, description="Evidence supporting the challenge")
    stake_amount: Optional[int] = Field(None, gt=0, description="Amount to stake (optional)")

class TransparencyRequest(BaseModel):
    search_query: Optional[str] = Field(None, max_length=100, description="Search query")
    budget_id: Optional[int] = Field(None, gt=0, description="Specific budget ID")
    date_from: Optional[datetime] = Field(None, description="Start date filter")
    date_to: Optional[datetime] = Field(None, description="End date filter")
    amount_min: Optional[int] = Field(None, ge=0, description="Minimum amount filter")
    amount_max: Optional[int] = Field(None, gt=0, description="Maximum amount filter")

# backend/app/schemas/fraud.py - NEW
class FraudAnalysisRequest(BaseModel):
    claim_id: int = Field(..., gt=0, description="Claim ID to analyze")
    force_reanalysis: bool = Field(False, description="Force re-analysis even if already analyzed")

class FraudAlertCreate(BaseModel):
    claim_id: int = Field(..., gt=0, description="Claim ID for the alert")
    alert_type: str = Field(..., max_length=50, description="Type of fraud alert")
    severity: str = Field(..., regex="^(low|medium|high|critical)$", description="Alert severity")
    description: str = Field(..., min_length=10, max_length=500, description="Alert description")
    auto_generated: bool = Field(True, description="Whether alert was auto-generated")

class FraudReportRequest(BaseModel):
    date_from: Optional[datetime] = Field(None, description="Report start date")
    date_to: Optional[datetime] = Field(None, description="Report end date")
    include_resolved: bool = Field(False, description="Include resolved alerts")
    severity_filter: Optional[List[str]] = Field(None, description="Filter by severity levels")

# Response schemas
class APIResponse(BaseModel):
    success: bool
    message: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.now)

class BudgetResponse(APIResponse):
    budget_id: Optional[int] = None
    budget: Optional[dict] = None

class ClaimResponse(APIResponse):
    claim_id: Optional[int] = None
    claim_details: Optional[dict] = None

class SystemStatsResponse(APIResponse):
    statistics: Optional[dict] = None

class TransparencyResponse(APIResponse):
    budgets: Optional[List[dict]] = None
    claims: Optional[List[dict]] = None
    total_count: Optional[int] = None

class FraudAnalysisResponse(APIResponse):
    fraud_score: Optional[int] = None
    risk_level: Optional[str] = None
    alerts: Optional[List[dict]] = None
    analysis_details: Optional[dict] = None