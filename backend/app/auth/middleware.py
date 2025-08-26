# backend/app/auth/middleware.py - UPDATED
from fastapi import Request, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional, List
import logging
from .prinicipal_auth import principal_auth_service

logger = logging.getLogger(__name__)

# Security scheme for JWT tokens
security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """
    Get current authenticated user from JWT token
    """
    try:
        token = credentials.credentials
        
        # Handle demo tokens
        if token.startswith('demo_token_'):
            return parse_demo_token(token)
        
        # Handle real ICP tokens
        user_data = await principal_auth_service.verify_token(token)
        return user_data
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Authentication error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed"
        )

def parse_demo_token(token: str) -> dict:
    """
    Parse demo token to extract user information
    """
    try:
        # Extract role from demo token format: demo_token_{role}_{timestamp}
        parts = token.split('_')
        if len(parts) >= 3 and parts[0] == 'demo' and parts[1] == 'token':
            role = parts[2]
            
            # Generate consistent demo user data
            demo_users = {
                'main_government': {
                    'principal_id': f'demo-principal-main-government-12345',
                    'role': 'main_government',
                    'name': 'Rajesh Kumar (Admin)',
                    'title': 'Secretary, Ministry of Finance',
                    'permissions': ['budget_control', 'role_management', 'fraud_oversight', 'system_administration']
                },
                'state_head': {
                    'principal_id': f'demo-principal-state-head-12345',
                    'role': 'state_head', 
                    'name': 'Dr. Priya Sharma',
                    'title': 'Chief Secretary, Uttar Pradesh',
                    'permissions': ['budget_allocation', 'deputy_management', 'regional_oversight']
                },
                'deputy': {
                    'principal_id': f'demo-principal-deputy-12345',
                    'role': 'deputy',
                    'name': 'Amit Singh',
                    'title': 'District Collector, Lucknow', 
                    'permissions': ['vendor_selection', 'project_management', 'claim_review']
                },
                'vendor': {
                    'principal_id': f'demo-principal-vendor-12345',
                    'role': 'vendor',
                    'name': 'BuildCorp Industries',
                    'title': 'Project Manager',
                    'permissions': ['claim_submission', 'payment_tracking', 'supplier_management']
                },
                'sub_supplier': {
                    'principal_id': f'demo-principal-sub-supplier-12345',
                    'role': 'sub_supplier',
                    'name': 'Materials Plus Ltd',
                    'title': 'Supply Chain Head',
                    'permissions': ['delivery_submission', 'quality_assurance', 'vendor_coordination']
                },
                'citizen': {
                    'principal_id': f'demo-principal-citizen-12345',
                    'role': 'citizen',
                    'name': 'Rahul Verma',
                    'title': 'Software Engineer',
                    'permissions': ['transparency_access', 'corruption_reporting', 'community_verification']
                }
            }
            
            if role in demo_users:
                return demo_users[role]
        
        raise ValueError("Invalid demo token format")
        
    except Exception as e:
        logger.error(f"Demo token parsing error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid demo token"
        )

class AuthenticationMiddleware:
    """
    FastAPI middleware for authentication
    """
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        # For now, just pass through - authentication is handled by dependencies
        await self.app(scope, receive, send)

class RoleChecker:
    """
    Role-based access control checker
    """
    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, user: dict = Depends(get_current_user)):
        if user["role"] not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Role '{user['role']}' not authorized for this operation. Required: {self.allowed_roles}"
            )
        return user

async def get_optional_user(request: Request) -> Optional[dict]:
    """
    Get user if authenticated, but don't require authentication
    Used for public endpoints that show different data for authenticated users
    """
    try:
        authorization: str = request.headers.get("Authorization")
        if not authorization or not authorization.startswith("Bearer "):
            return None
        
        token = authorization.split(" ")[1]
        user_data = await principal_auth_service.verify_token(token)
        return user_data
    except Exception:
        return None

# Role-based dependency injection
require_main_government = RoleChecker(["main_government"])
require_state_head = RoleChecker(["main_government", "state_head"])
require_deputy = RoleChecker(["main_government", "state_head", "deputy"])
require_vendor = RoleChecker(["vendor"])
require_government_official = RoleChecker(["main_government", "state_head", "deputy"])
require_any_role = RoleChecker(["main_government", "state_head", "deputy", "vendor", "sub_supplier", "citizen"])

# Specific permission checkers
async def require_budget_control(user: dict = Depends(get_current_user)) -> dict:
    """Only main government can control budgets"""
    if user["role"] != "main_government":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Budget control requires main government authority"
        )
    return user

async def require_fraud_oversight(user: dict = Depends(get_current_user)) -> dict:
    """Only main government can manage fraud detection"""
    if user["role"] != "main_government":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Fraud oversight requires main government authority"
        )
    return user

async def require_allocation_rights(user: dict = Depends(get_current_user)) -> dict:
    """State heads and main government can allocate budgets"""
    if user["role"] not in ["main_government", "state_head"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Budget allocation requires state head or main government authority"
        )
    return user

async def require_vendor_operations(user: dict = Depends(get_current_user)) -> dict:
    """Only vendors can submit claims and manage suppliers"""
    if user["role"] != "vendor":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This operation is restricted to registered vendors"
        )
    return user

# Utility functions for role checking
def has_permission(user: dict, permission: str) -> bool:
    """
    Check if user has specific permission
    """
    role_permissions = {
        "main_government": [
            "budget_control", "role_management", "fraud_oversight", 
            "budget_allocation", "vendor_approval", "system_admin"
        ],
        "state_head": [
            "budget_allocation", "deputy_management", "regional_oversight",
            "vendor_proposal", "claim_review"
        ],
        "deputy": [
            "vendor_selection", "project_management", "claim_review",
            "local_oversight"
        ],
        "vendor": [
            "claim_submission", "payment_tracking", "supplier_management"
        ],
        "citizen": [
            "transparency_access", "corruption_reporting", "community_verification"
        ]
    }
    
    user_permissions = role_permissions.get(user["role"], [])
    return permission in user_permissions

def get_user_principal(user: dict) -> str:
    """Extract principal ID from authenticated user"""
    return user["principal_id"]

def get_user_role(user: dict) -> str:
    """Extract role from authenticated user"""
    return user["role"]

# Logging middleware for authentication events
async def log_auth_event(request: Request, user: Optional[dict] = None):
    """
    Log authentication events for audit trail
    """
    try:
        event_data = {
            "timestamp": request.state.start_time if hasattr(request.state, 'start_time') else None,
            "method": request.method,
            "path": str(request.url.path),
            "client_ip": request.client.host if request.client else "unknown",
            "user_agent": request.headers.get("user-agent", "unknown"),
            "principal_id": user["principal_id"] if user else "anonymous",
            "role": user["role"] if user else "none"
        }
        
        logger.info(f"Auth Event: {event_data}")
        
    except Exception as e:
        logger.error(f"Failed to log auth event: {e}")

# Example usage in route protection:
"""
# Protect routes with role-based access:

@router.post("/budget/create")
async def create_budget(
    budget_data: BudgetCreate,
    user: dict = Depends(require_main_government)
):
    # Only main government can create budgets
    pass

@router.post("/allocation/create") 
async def allocate_budget(
    allocation_data: AllocationCreate,
    user: dict = Depends(require_allocation_rights)
):
    # State heads and main government can allocate
    pass

@router.get("/transparency/claims")
async def get_public_claims(
    user: Optional[dict] = Depends(get_optional_user)
):
    # Public endpoint with optional enhanced data for authenticated users
    pass
"""