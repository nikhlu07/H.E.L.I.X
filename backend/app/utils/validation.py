"""
CorruptGuard Enhanced Validation Utilities
Additional validation functions for business logic and security
"""

import re
import hashlib
from typing import Any, Dict, List, Optional, Union
from datetime import datetime, date
from decimal import Decimal, InvalidOperation

from app.utils.exceptions import ValidationError
from app.utils.logging import get_logger

logger = get_logger(__name__)


class ValidationUtils:
    """
    Enhanced validation utilities for CorruptGuard application
    """
    
    # Validation patterns
    EMAIL_PATTERN = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
    PHONE_PATTERN = re.compile(r'^\+?[\d\s\-\(\)]{10,15}$')
    PRINCIPAL_ID_PATTERN = re.compile(r'^[a-z0-9\-]+\.cai$')
    
    # Indian-specific patterns
    INDIAN_PHONE_PATTERN = re.compile(r'^(\+91|91)?[6-9]\d{9}$')
    INDIAN_PINCODE_PATTERN = re.compile(r'^[1-9][0-9]{5}$')
    PAN_PATTERN = re.compile(r'^[A-Z]{5}[0-9]{4}[A-Z]{1}$')
    AADHAAR_PATTERN = re.compile(r'^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$')
    
    @staticmethod
    def validate_principal_id(principal_id: str) -> str:
        """
        Validate ICP Principal ID format
        """
        if not principal_id:
            raise ValidationError("Principal ID is required")
        
        if not isinstance(principal_id, str):
            raise ValidationError("Principal ID must be a string")
        
        # Remove whitespace
        principal_id = principal_id.strip()
        
        if len(principal_id) < 10 or len(principal_id) > 100:
            raise ValidationError("Principal ID length must be between 10 and 100 characters")
        
        # Check format (simplified validation)
        if not principal_id.endswith("-cai"):
            raise ValidationError("Principal ID must end with '-cai'")
        
        # Check valid characters (base32 + hyphen)
        valid_chars = set("abcdefghijklmnopqrstuvwxyz234567-")
        if not all(c.lower() in valid_chars for c in principal_id):
            raise ValidationError("Principal ID contains invalid characters")
        
        return principal_id
    
    @staticmethod
    def validate_amount(amount: Union[int, float, str, Decimal], min_value: float = 0, max_value: float = 1e9) -> float:
        """
        Validate monetary amount
        """
        try:
            if isinstance(amount, str):
                # Remove commas and currency symbols
                amount = re.sub(r'[,₹$]', '', amount.strip())
                amount = float(amount)
            elif isinstance(amount, Decimal):
                amount = float(amount)
            elif not isinstance(amount, (int, float)):
                raise ValidationError("Amount must be a number")
            
            if amount < min_value:
                raise ValidationError(f"Amount cannot be less than {min_value}")
            
            if amount > max_value:
                raise ValidationError(f"Amount cannot exceed {max_value}")
            
            # Check for reasonable decimal places (2 decimal places max)
            rounded_amount = round(amount, 2)
            if abs(amount - rounded_amount) > 1e-10:
                raise ValidationError("Amount cannot have more than 2 decimal places")
            
            return rounded_amount
            
        except (ValueError, TypeError, InvalidOperation) as e:
            raise ValidationError(f"Invalid amount format: {str(e)}")
    
    @staticmethod
    def validate_email(email: str) -> str:
        """
        Validate email address format
        """
        if not email:
            raise ValidationError("Email is required")
        
        email = email.strip().lower()
        
        if len(email) > 254:
            raise ValidationError("Email address is too long")
        
        if not ValidationUtils.EMAIL_PATTERN.match(email):
            raise ValidationError("Invalid email format")
        
        # Check for dangerous characters
        dangerous_chars = ['<', '>', '"', '\'', '&']
        if any(char in email for char in dangerous_chars):
            raise ValidationError("Email contains invalid characters")
        
        return email
    
    @staticmethod
    def validate_phone(phone: str, country_code: str = "IN") -> str:
        """
        Validate phone number format
        """
        if not phone:
            raise ValidationError("Phone number is required")
        
        # Remove all non-digit characters except +
        cleaned_phone = re.sub(r'[^\d+]', '', phone.strip())
        
        if country_code == "IN":
            if not ValidationUtils.INDIAN_PHONE_PATTERN.match(cleaned_phone):
                raise ValidationError("Invalid Indian phone number format")
        else:
            if not ValidationUtils.PHONE_PATTERN.match(cleaned_phone):
                raise ValidationError("Invalid phone number format")
        
        return cleaned_phone
    
    @staticmethod
    def validate_fraud_score(score: Union[int, float, str]) -> int:
        """
        Validate fraud score (0-100)
        """
        try:
            if isinstance(score, str):
                score = int(score.strip())
            elif isinstance(score, float):
                score = int(score)
            elif not isinstance(score, int):
                raise ValidationError("Fraud score must be a number")
            
            if score < 0 or score > 100:
                raise ValidationError("Fraud score must be between 0 and 100")
            
            return score
            
        except (ValueError, TypeError) as e:
            raise ValidationError(f"Invalid fraud score: {str(e)}")
    
    @staticmethod
    def validate_text_content(text: str, min_length: int = 1, max_length: int = 1000, 
                            allow_html: bool = False) -> str:
        """
        Validate text content with length and security checks
        """
        if not text:
            if min_length > 0:
                raise ValidationError("Text content is required")
            return ""
        
        text = text.strip()
        
        if len(text) < min_length:
            raise ValidationError(f"Text must be at least {min_length} characters long")
        
        if len(text) > max_length:
            raise ValidationError(f"Text cannot exceed {max_length} characters")
        
        # Security checks
        if not allow_html:
            # Check for HTML/script tags
            html_pattern = re.compile(r'<[^>]+>', re.IGNORECASE)
            if html_pattern.search(text):
                raise ValidationError("HTML tags are not allowed")
        
        # Check for suspicious patterns
        suspicious_patterns = [
            r'javascript:', r'vbscript:', r'onload=', r'onerror=',
            r'<script', r'</script>', r'<iframe', r'</iframe>'
        ]
        
        for pattern in suspicious_patterns:
            if re.search(pattern, text, re.IGNORECASE):
                raise ValidationError("Text contains potentially unsafe content")
        
        return text
    
    @staticmethod
    def sanitize_input(value: str, remove_html: bool = True, max_length: int = None) -> str:
        """
        Sanitize user input for security
        """
        if not value:
            return ""
        
        # Basic sanitization
        sanitized = str(value).strip()
        
        # Remove HTML tags if requested
        if remove_html:
            sanitized = re.sub(r'<[^>]+>', '', sanitized)
        
        # Remove dangerous characters
        dangerous_chars = {
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '&': '&amp;'
        }
        
        for char, replacement in dangerous_chars.items():
            sanitized = sanitized.replace(char, replacement)
        
        # Limit length if specified
        if max_length and len(sanitized) > max_length:
            sanitized = sanitized[:max_length]
        
        return sanitized


# Business logic validators
class BusinessValidators:
    """
    Business-specific validation rules for CorruptGuard
    """
    
    @staticmethod
    def validate_budget_allocation(budget_amount: float, allocation_amount: float) -> bool:
        """
        Validate budget allocation doesn't exceed available budget
        """
        if allocation_amount > budget_amount:
            raise ValidationError(f"Allocation amount ({allocation_amount}) exceeds budget ({budget_amount})")
        return True
    
    @staticmethod
    def validate_claim_amount(claim_amount: float, allocation_amount: float) -> bool:
        """
        Validate claim amount doesn't exceed allocation
        """
        if claim_amount > allocation_amount:
            raise ValidationError(f"Claim amount ({claim_amount}) exceeds allocation ({allocation_amount})")
        return True
    
    @staticmethod
    def validate_role_hierarchy(assigner_role: str, assignee_role: str) -> bool:
        """
        Validate role assignment follows hierarchy rules
        """
        role_hierarchy = {
            "main_government": ["state_head", "deputy", "vendor"],
            "state_head": ["deputy"],
            "deputy": [],
            "vendor": [],
            "citizen": []
        }
        
        allowed_roles = role_hierarchy.get(assigner_role, [])
        if assignee_role not in allowed_roles:
            raise ValidationError(f"Role {assigner_role} cannot assign role {assignee_role}")
        
        return True