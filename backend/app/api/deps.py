"""
CorruptGuard API Dependencies
Common dependencies for FastAPI endpoints
"""

from typing import Optional, Dict, Any
from fastapi import Depends, Request, Query, Header
from functools import lru_cache

from app.auth.middleware import get_current_user
from app.config.settings import get_settings, Settings
from app.utils.exceptions import AuthenticationError, ValidationError
from app.utils.logging import get_logger

logger = get_logger(__name__)

# Settings dependency
@lru_cache()
def get_cached_settings() -> Settings:
    """Get cached application settings"""
    return get_settings()

# Authentication dependencies
async def get_authenticated_user(request: Request) -> Dict[str, Any]:
    """
    Get authenticated user information
    
    Args:
        request: HTTP request
        
    Returns:
        User information dictionary
    """
    return await get_current_user(request)

async def get_optional_user(request: Request) -> Optional[Dict[str, Any]]:
    """
    Get user information if authenticated, None otherwise
    
    Args:
        request: HTTP request
        
    Returns:
        User information dictionary or None
    """
    try:
        return await get_current_user(request)
    except AuthenticationError:
        return None

# Role-specific dependencies
async def get_main_government_user(user: Dict[str, Any] = Depends(get_authenticated_user)) -> Dict[str, Any]:
    """Get main government user"""
    if user["role"] != "main_government":
        raise AuthenticationError("Main government role required")
    return user

async def get_state_head_user(user: Dict[str, Any] = Depends(get_authenticated_user)) -> Dict[str, Any]:
    """Get state head user (includes main government)"""
    if user["role"] not in ["main_government", "state_head"]:
        raise AuthenticationError("State head role required")
    return user

async def get_deputy_user(user: Dict[str, Any] = Depends(get_authenticated_user)) -> Dict[str, Any]:
    """Get deputy user (includes higher roles)"""
    if user["role"] not in ["main_government", "state_head", "deputy"]:
        raise AuthenticationError("Deputy role required")
    return user

async def get_vendor_user(user: Dict[str, Any] = Depends(get_authenticated_user)) -> Dict[str, Any]:
    """Get vendor user"""
    if user["role"] != "vendor":
        raise AuthenticationError("Vendor role required")
    return user

async def get_any_government_user(user: Dict[str, Any] = Depends(get_authenticated_user)) -> Dict[str, Any]:
    """Get any government role user"""
    if user["role"] not in ["main_government", "state_head", "deputy"]:
        raise AuthenticationError("Government role required")
    return user

# Pagination dependencies
class PaginationParams:
    """Pagination parameters"""
    
    def __init__(
        self,
        page: int = Query(1, ge=1, description="Page number (1-based)"),
        per_page: int = Query(20, ge=1, le=100, description="Items per page (max 100)"),
    ):
        self.page = page
        self.per_page = per_page
        self.offset = (page - 1) * per_page
    
    @property
    def limit(self) -> int:
        return self.per_page

# Search and filtering dependencies
class SearchParams:
    """Search and filtering parameters"""
    
    def __init__(
        self,
        search: Optional[str] = Query(None, description="Search term"),
        status: Optional[str] = Query(None, description="Filter by status"),
        risk_level: Optional[str] = Query(None, description="Filter by risk level"),
        date_from: Optional[str] = Query(None, description="Filter from date (YYYY-MM-DD)"),
        date_to: Optional[str] = Query(None, description="Filter to date (YYYY-MM-DD)"),
        sort_by: Optional[str] = Query("created_at", description="Sort field"),
        sort_order: str = Query("desc", regex="^(asc|desc)$", description="Sort order"),
    ):
        self.search = search
        self.status = status
        self.risk_level = risk_level
        self.date_from = date_from
        self.date_to = date_to
        self.sort_by = sort_by
        self.sort_order = sort_order

# Request metadata dependencies
async def get_client_info(
    request: Request,
    user_agent: Optional[str] = Header(None),
    x_forwarded_for: Optional[str] = Header(None),
) -> Dict[str, Any]:
    """
    Get client information from request
    
    Args:
        request: HTTP request
        user_agent: User agent header
        x_forwarded_for: Forwarded IP header
        
    Returns:
        Client information dictionary
    """
    
    # Get client IP
    client_ip = None
    if x_forwarded_for:
        # Use first IP in forwarded chain
        client_ip = x_forwarded_for.split(",")[0].strip()
    elif request.client:
        client_ip = request.client.host
    
    return {
        "ip": client_ip,
        "user_agent": user_agent,
        "method": request.method,
        "path": request.url.path,
        "query_params": dict(request.query_params)
    }

# ICP-specific dependencies
async def get_icp_headers(
    x_principal_id: Optional[str] = Header(None, alias="X-Principal-ID"),
    x_signature: Optional[str] = Header(None, alias="X-Signature"),
    x_nonce: Optional[str] = Header(None, alias="X-Nonce"),
) -> Dict[str, Optional[str]]:
    """
    Get ICP-specific headers
    
    Returns:
        Dictionary with ICP headers
    """
    return {
        "principal_id": x_principal_id,
        "signature": x_signature,
        "nonce": x_nonce
    }

# Validation dependencies
def validate_principal_id(principal_id: str) -> str:
    """
    Validate Principal ID format
    
    Args:
        principal_id: Principal ID to validate
        
    Returns:
        Validated Principal ID
        
    Raises:
        ValidationError: If Principal ID is invalid
    """
    if not principal_id:
        raise ValidationError("Principal ID is required")
    
    if len(principal_id) < 10 or len(principal_id) > 100:
        raise ValidationError("Principal ID length invalid")
    
    if not principal_id.endswith("-cai"):
        raise ValidationError("Principal ID must end with '-cai'")
    
    # Basic character validation
    valid_chars = set("abcdefghijklmnopqrstuvwxyz234567-")
    if not all(c.lower() in valid_chars for c in principal_id):
        raise ValidationError("Principal ID contains invalid characters")
    
    return principal_id

def validate_amount(amount: float) -> float:
    """
    Validate monetary amount
    
    Args:
        amount: Amount to validate
        
    Returns:
        Validated amount
        
    Raises:
        ValidationError: If amount is invalid
    """
    if amount < 0:
        raise ValidationError("Amount cannot be negative")
    
    if amount > 1000000000:  # 1 billion limit
        raise ValidationError("Amount exceeds maximum limit")
    
    # Check for reasonable decimal places (2 decimal places max)
    if round(amount, 2) != amount:
        raise ValidationError("Amount cannot have more than 2 decimal places")
    
    return amount

def validate_fraud_score(score: int) -> int:
    """
    Validate fraud score
    
    Args:
        score: Fraud score to validate
        
    Returns:
        Validated fraud score
        
    Raises:
        ValidationError: If score is invalid
    """
    if not isinstance(score, int):
        raise ValidationError("Fraud score must be an integer")
    
    if score < 0 or score > 100:
        raise ValidationError("Fraud score must be between 0 and 100")
    
    return score

# Cache dependencies
class CacheParams:
    """Cache control parameters"""
    
    def __init__(
        self,
        no_cache: bool = Query(False, description="Skip cache and fetch fresh data"),
        cache_ttl: Optional[int] = Query(None, ge=1, le=3600, description="Cache TTL in seconds"),
    ):
        self.no_cache = no_cache
        self.cache_ttl = cache_ttl

# Rate limiting dependencies
async def check_rate_limit(
    request: Request,
    client_info: Dict[str, Any] = Depends(get_client_info),
    settings: Settings = Depends(get_cached_settings)
) -> None:
    """
    Check rate limiting for requests
    
    Args:
        request: HTTP request
        client_info: Client information
        settings: Application settings
        
    Raises:
        RateLimitError: If rate limit exceeded
    """
    
    if not settings.RATE_LIMIT_ENABLED:
        return
    
    # TODO: Implement actual rate limiting logic
    # This would typically use Redis or in-memory store
    # to track request counts per IP/user
    
    client_ip = client_info.get("ip", "unknown")
    logger.debug(f"Rate limit check for {client_ip}")

# Health check dependencies
async def check_service_health() -> Dict[str, str]:
    """
    Check health of dependent services
    
    Returns:
        Service health status
    """
    health_status = {
        "database": "healthy",
        "icp_canister": "healthy",
        "fraud_engine": "healthy",
        "cache": "healthy"
    }
    
    # TODO: Implement actual health checks
    # - Database connectivity
    # - ICP canister accessibility  
    # - Cache service availability
    # - External service dependencies
    
    return health_status

# Common response headers
async def add_security_headers(response_headers: Dict[str, str] = None) -> Dict[str, str]:
    """
    Add security headers to responses
    
    Args:
        response_headers: Existing headers
        
    Returns:
        Headers with security additions
    """
    headers = response_headers or {}
    
    # Add security headers
    headers.update({
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "X-XSS-Protection": "1; mode=block",
        "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
        "Content-Security-Policy": "default-src 'self'",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Permissions-Policy": "geolocation=(), microphone=(), camera=()"
    })
    
    return headers

# Database dependencies (will be implemented in database layer)
# async def get_db_session():
#     """Get database session"""
#     pass

# ICP agent dependencies (will be implemented in ICP layer)
# async def get_icp_agent():
#     """Get ICP agent for canister calls"""
#     pass

# Fraud detection dependencies (will be implemented in fraud layer)
# async def get_fraud_engine():
#     """Get fraud detection engine"""
#     pass
