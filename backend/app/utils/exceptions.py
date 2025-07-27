"""
CorruptGuard Custom Exception Classes
Professional error handling for government-grade software
"""

from typing import Any, Dict, Optional
from fastapi import HTTPException

class CorruptGuardException(HTTPException):
    """Base exception class for CorruptGuard application"""
    
    def __init__(
        self,
        status_code: int,
        detail: str,
        headers: Optional[Dict[str, Any]] = None,
        error_code: Optional[str] = None
    ):
        super().__init__(status_code=status_code, detail=detail, headers=headers)
        self.error_code = error_code

class ValidationError(CorruptGuardException):
    """Data validation errors"""
    
    def __init__(self, detail: str, field: Optional[str] = None):
        super().__init__(
            status_code=422,
            detail=detail,
            error_code="VALIDATION_ERROR"
        )
        self.field = field

class AuthenticationError(CorruptGuardException):
    """Authentication and authorization errors"""
    
    def __init__(self, detail: str = "Authentication failed"):
        super().__init__(
            status_code=401,
            detail=detail,
            error_code="AUTH_ERROR"
        )

class PermissionError(CorruptGuardException):
    """Permission and access control errors"""
    
    def __init__(self, detail: str = "Insufficient permissions"):
        super().__init__(
            status_code=403,
            detail=detail,
            error_code="PERMISSION_ERROR"
        )

class NotFoundError(CorruptGuardException):
    """Resource not found errors"""
    
    def __init__(self, resource: str, identifier: str):
        super().__init__(
            status_code=404,
            detail=f"{resource} with identifier '{identifier}' not found",
            error_code="NOT_FOUND"
        )

class ConflictError(CorruptGuardException):
    """Resource conflict errors"""
    
    def __init__(self, detail: str):
        super().__init__(
            status_code=409,
            detail=detail,
            error_code="CONFLICT_ERROR"
        )

class ICPError(CorruptGuardException):
    """ICP canister and blockchain related errors"""
    
    def __init__(self, detail: str, canister_id: Optional[str] = None):
        super().__init__(
            status_code=502,
            detail=detail,
            error_code="ICP_ERROR"
        )
        self.canister_id = canister_id

class FraudDetectionError(CorruptGuardException):
    """Fraud detection system errors"""
    
    def __init__(self, detail: str, claim_id: Optional[str] = None):
        super().__init__(
            status_code=500,
            detail=detail,
            error_code="FRAUD_DETECTION_ERROR"
        )
        self.claim_id = claim_id

class DatabaseError(CorruptGuardException):
    """Database operation errors"""
    
    def __init__(self, detail: str, operation: Optional[str] = None):
        super().__init__(
            status_code=500,
            detail=detail,
            error_code="DATABASE_ERROR"
        )
        self.operation = operation

class RateLimitError(CorruptGuardException):
    """Rate limiting errors"""
    
    def __init__(self, detail: str = "Rate limit exceeded"):
        super().__init__(
            status_code=429,
            detail=detail,
            error_code="RATE_LIMIT_ERROR"
        )