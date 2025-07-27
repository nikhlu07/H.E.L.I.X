"""
CorruptGuard Internet Identity Authentication
Integration with ICP Internet Identity for secure authentication
"""

import jwt
import json
import time
import hashlib
from typing import Dict, Any, Optional, List
from datetime import datetime, timedelta

from ic.principal import Principal
from ic.identity import Identity

from app.config.settings import get_settings
from app.utils.logging import get_logger, log_security_event
from app.utils.exceptions import AuthenticationError, ValidationError

logger = get_logger(__name__)


class InternetIdentityAuth:
    """
    Internet Identity authentication handler
    """
    
    def __init__(self):
        self.settings = get_settings()
        self.jwt_secret = getattr(self.settings, 'JWT_SECRET_KEY', 'dev-secret-key')
        self.jwt_algorithm = 'HS256'
        self.token_expiry_hours = 24
        
        # Internet Identity canister ID (mainnet)
        self.ii_canister_id = "rdmx6-jaaaa-aaaah-qcaiq-cai"
        
        # Mock user database (in production, use actual database)
        self.user_principals = {}
    
    async def authenticate_with_internet_identity(self, delegation_chain: List[Dict],
                                                 client_principal: str) -> Dict[str, Any]:
        """
        Authenticate user with Internet Identity delegation chain
        
        Args:
            delegation_chain: IC delegation chain from Internet Identity
            client_principal: Client's Principal ID
            
        Returns:
            Authentication result with user info and JWT token
        """
        try:
            logger.info(f"🔐 Authenticating with Internet Identity: {client_principal}")
            
            # Validate delegation chain
            if not await self.validate_delegation_chain(delegation_chain, client_principal):
                raise AuthenticationError("Invalid delegation chain")
            
            # Extract user information
            user_info = await self.get_user_info_from_principal(client_principal)
            
            # Generate JWT token
            jwt_token = self.generate_jwt_token(user_info)
            
            # Log successful authentication
            log_security_event(
                event_type="AUTHENTICATION_SUCCESS",
                description=f"User authenticated via Internet Identity",
                user_principal=client_principal,
                severity="low"
            )
            
            return {
                "success": True,
                "user": user_info,
                "token": jwt_token,
                "expires_at": (datetime.utcnow() + timedelta(hours=self.token_expiry_hours)).isoformat()
            }
            
        except Exception as e:
            logger.error(f"❌ Internet Identity authentication failed: {str(e)}")
            
            log_security_event(
                event_type="AUTHENTICATION_FAILURE",
                description=f"Internet Identity authentication failed: {str(e)}",
                user_principal=client_principal,
                severity="medium"
            )
            
            raise AuthenticationError(f"Authentication failed: {str(e)}")
    
    async def validate_delegation_chain(self, delegation_chain: List[Dict],
                                       expected_principal: str) -> bool:
        """
        Validate Internet Identity delegation chain
        
        Args:
            delegation_chain: IC delegation chain
            expected_principal: Expected principal ID
            
        Returns:
            True if valid, False otherwise
        """
        try:
            # Basic validation of delegation chain structure
            if not delegation_chain or not isinstance(delegation_chain, list):
                logger.warning("❌ Invalid delegation chain structure")
                return False
            
            # Validate each delegation in chain
            for i, delegation in enumerate(delegation_chain):
                if not self.validate_single_delegation(delegation, i == 0):
                    logger.warning(f"❌ Invalid delegation at index {i}")
                    return False
            
            # Validate that chain leads to expected principal
            if not self.validate_principal_in_chain(delegation_chain, expected_principal):
                logger.warning("❌ Principal not found in delegation chain")
                return False
            
            # Check expiration times
            if not self.validate_delegation_expiry(delegation_chain):
                logger.warning("❌ Delegation chain expired")
                return False
            
            logger.info("✅ Delegation chain validation successful")
            return True
            
        except Exception as e:
            logger.error(f"❌ Delegation chain validation error: {str(e)}")
            return False
    
    def validate_single_delegation(self, delegation: Dict, is_root: bool) -> bool:
        """
        Validate a single delegation in the chain
        """
        required_fields = ['delegation', 'signature']
        
        # Check required fields
        for field in required_fields:
            if field not in delegation:
                return False
        
        delegation_data = delegation['delegation']
        
        # Validate delegation data structure
        if not isinstance(delegation_data, dict):
            return False
        
        # Check required delegation fields
        required_delegation_fields = ['pubkey', 'expiration']
        if is_root:
            required_delegation_fields.extend(['targets'])
        
        for field in required_delegation_fields:
            if field not in delegation_data:
                return False
        
        return True
    
    def validate_principal_in_chain(self, delegation_chain: List[Dict],
                                   expected_principal: str) -> bool:
        """
        Validate that the expected principal is in the delegation chain
        """
        try:
            # Extract public key from first delegation
            first_delegation = delegation_chain[0]['delegation']
            public_key = first_delegation.get('pubkey')
            
            if not public_key:
                return False
            
            # Derive principal from public key (simplified)
            # In production, use proper IC principal derivation
            derived_principal = self.derive_principal_from_pubkey(public_key)
            
            return derived_principal == expected_principal
            
        except Exception as e:
            logger.error(f"❌ Principal validation error: {str(e)}")
            return False
    
    def validate_delegation_expiry(self, delegation_chain: List[Dict]) -> bool:
        """
        Validate that delegation chain is not expired
        """
        try:
            current_time_ns = int(time.time() * 1_000_000_000)  # Current time in nanoseconds
            
            for delegation in delegation_chain:
                expiration = delegation['delegation'].get('expiration')
                if not expiration:
                    continue
                
                # Convert expiration to nanoseconds if needed
                if isinstance(expiration, int) and expiration < current_time_ns:
                    return False
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Expiry validation error: {str(e)}")
            return False
    
    def derive_principal_from_pubkey(self, public_key: bytes) -> str:
        """
        Derive principal from public key (simplified implementation)
        """
        try:
            # This is a simplified version. In production, use proper IC derivation
            principal_hash = hashlib.sha224(public_key).digest()
            principal = Principal(principal_hash[:29])  # IC principals are 29 bytes
            return str(principal)
            
        except Exception as e:
            logger.error(f"❌ Principal derivation error: {str(e)}")
            return ""
    
    async def get_user_info_from_principal(self, principal_id: str) -> Dict[str, Any]:
        """
        Get user information from Principal ID
        
        Args:
            principal_id: User's Principal ID
            
        Returns:
            User information dictionary
        """
        try:
            # Check if user exists in our system
            if principal_id in self.user_principals:
                return self.user_principals[principal_id]
            
            # For new users, determine role and create profile
            user_info = await self.create_user_profile(principal_id)
            
            return user_info
            
        except Exception as e:
            logger.error(f"❌ Failed to get user info: {str(e)}")
            raise AuthenticationError("Failed to retrieve user information")
    
    async def create_user_profile(self, principal_id: str) -> Dict[str, Any]:
        """
        Create user profile for new Principal ID
        """
        try:
            # Determine user role based on Principal ID or registration
            role = await self.determine_user_role(principal_id)
            
            user_info = {
                "principal": principal_id,
                "role": role,
                "created_at": datetime.utcnow().isoformat(),
                "last_login": datetime.utcnow().isoformat(),
                "active": True
            }
            
            # Store user info (in production, save to database)
            self.user_principals[principal_id] = user_info
            
            logger.info(f"✅ Created user profile for {principal_id} with role {role}")
            return user_info
            
        except Exception as e:
            logger.error(f"❌ Failed to create user profile: {str(e)}")
            raise AuthenticationError("Failed to create user profile")
    
    async def determine_user_role(self, principal_id: str) -> str:
        """
        Determine user role based on Principal ID or other criteria
        """
        # In production, this would check against:
        # 1. Pre-registered government officials
        # 2. Approved vendor list
        # 3. Role assignment from admin
        # 4. Default to citizen for unknown principals
        
        # Mock role assignment logic
        if "main-gov" in principal_id.lower():
            return "main_government"
        elif "state" in principal_id.lower():
            return "state_head"
        elif "deputy" in principal_id.lower():
            return "deputy"
        elif "vendor" in principal_id.lower():
            return "vendor"
        else:
            return "citizen"  # Default role
    
    def generate_jwt_token(self, user_info: Dict[str, Any]) -> str:
        """
        Generate JWT token for authenticated user
        
        Args:
            user_info: User information dictionary
            
        Returns:
            JWT token string
        """
        try:
            payload = {
                "principal": user_info["principal"],
                "role": user_info["role"],
                "iat": int(time.time()),
                "exp": int(time.time()) + (self.token_expiry_hours * 3600),
                "iss": "corruptguard-api",
                "aud": "corruptguard-frontend"
            }
            
            token = jwt.encode(payload, self.jwt_secret, algorithm=self.jwt_algorithm)
            
            logger.debug(f"✅ JWT token generated for {user_info['principal']}")
            return token
            
        except Exception as e:
            logger.error(f"❌ JWT token generation failed: {str(e)}")
            raise AuthenticationError("Token generation failed")
    
    def verify_jwt_token(self, token: str) -> Dict[str, Any]:
        """
        Verify and decode JWT token
        
        Args:
            token: JWT token string
            
        Returns:
            Decoded token payload
        """
        try:
            payload = jwt.decode(
                token, 
                self.jwt_secret, 
                algorithms=[self.jwt_algorithm],
                options={"verify_exp": True}
            )
            
            logger.debug(f"✅ JWT token verified for {payload.get('principal')}")
            return payload
            
        except jwt.ExpiredSignatureError:
            logger.warning("❌ JWT token expired")
            raise AuthenticationError("Token expired")
        
        except jwt.InvalidTokenError as e:
            logger.warning(f"❌ Invalid JWT token: {str(e)}")
            raise AuthenticationError("Invalid token")
        
        except Exception as e:
            logger.error(f"❌ JWT verification error: {str(e)}")
            raise AuthenticationError("Token verification failed")
    
    async def refresh_token(self, current_token: str) -> Dict[str, Any]:
        """
        Refresh JWT token with new expiration
        
        Args:
            current_token: Current JWT token
            
        Returns:
            New token information
        """
        try:
            # Verify current token
            payload = self.verify_jwt_token(current_token)
            
            # Get updated user info
            user_info = await self.get_user_info_from_principal(payload["principal"])
            
            # Generate new token
            new_token = self.generate_jwt_token(user_info)
            
            return {
                "success": True,
                "token": new_token,
                "expires_at": (datetime.utcnow() + timedelta(hours=self.token_expiry_hours)).isoformat()
            }
            
        except Exception as e:
            logger.error(f"❌ Token refresh failed: {str(e)}")
            raise AuthenticationError("Token refresh failed")
    
    async def logout(self, token: str, principal_id: str) -> Dict[str, Any]:
        """
        Logout user and invalidate token
        
        Args:
            token: JWT token to invalidate
            principal_id: User's Principal ID
            
        Returns:
            Logout result
        """
        try:
            # In production, add token to blacklist/revocation list
            
            # Log security event
            log_security_event(
                event_type="USER_LOGOUT",
                description="User logged out",
                user_principal=principal_id,
                severity="low"
            )
            
            logger.info(f"✅ User logged out: {principal_id}")
            
            return {
                "success": True,
                "message": "Logged out successfully"
            }
            
        except Exception as e:
            logger.error(f"❌ Logout failed: {str(e)}")
            raise AuthenticationError("Logout failed")


# Global Internet Identity instance
ii_auth = InternetIdentityAuth()


# Convenience functions
async def authenticate_user(delegation_chain: List[Dict], 
                           client_principal: str) -> Dict[str, Any]:
    """
    Authenticate user with Internet Identity
    """
    return await ii_auth.authenticate_with_internet_identity(delegation_chain, client_principal)


def verify