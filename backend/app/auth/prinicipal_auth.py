# backend/app/auth/principal_auth.py
from typing import Optional, Dict, Any, List
from fastapi import HTTPException, status
from datetime import datetime, timedelta
import jwt
import logging
import hashlib
from ..config.settings import settings
from ..icp.agent import get_icp_agent
from ..icp.canister_calls import CanisterService
from ..auth.icp_auth import ii_auth

logger = logging.getLogger(__name__)

class PrincipalAuthService:
    """
    Handles principal-based authentication for CorruptGuard
    Integrates Internet Identity with role-based access control
    """
    
    def __init__(self):
        self.canister_service = CanisterService()
        self.secret_key = settings.JWT_SECRET_KEY
        self.algorithm = "HS256"
        self.access_token_expire_minutes = 30  # 30 minutes for security
    
    async def verify_internet_identity(self, principal_id: str, delegation_chain: List[Dict], domain: Optional[str] = None) -> bool:
        """
        Verify Internet Identity delegation chain
        """
        try:
            logger.info(f"Verifying Internet Identity for principal: {principal_id}")
            
            # Validate delegation chain using II helper
            is_valid = await ii_auth.validate_delegation_chain(
                delegation_chain=delegation_chain,
                expected_principal=principal_id,
                domain=domain
            )
            
            if is_valid:
                logger.info(f"✅ Internet Identity verified for {principal_id}")
                return True
            else:
                logger.warning(f"❌ Internet Identity verification failed for {principal_id}")
                return False
                
        except Exception as e:
            logger.error(f"Internet Identity verification error for {principal_id}: {e}")
            return False
    
    async def get_user_role_from_canister(self, principal_id: str) -> Optional[str]:
        """
        Determine user role from ICP canister
        """
        try:
            if settings.demo_mode:
                # In demo mode, use a simple role mapping
                return self._get_demo_role(principal_id)
            
            # Real canister integration
            agent = await get_icp_agent()
            
            # Check if principal is main government
            if await self.canister_service.is_main_government(principal_id):
                return "main_government"
            
            # Check if principal is state head
            if await self.canister_service.is_state_head(principal_id):
                return "state_head"
            
            # Check if principal is deputy
            if await self.canister_service.is_deputy(principal_id):
                return "deputy"
            
            # Check if principal is vendor
            if await self.canister_service.is_vendor(principal_id):
                return "vendor"
            
            # Default to citizen
            return "citizen"
            
        except Exception as e:
            logger.error(f"Role determination failed for {principal_id}: {e}")
            # Fallback to demo role mapping
            return self._get_demo_role(principal_id)
    
    def _get_demo_role(self, principal_id: str) -> str:
        """
        Simple demo role mapping based on principal ID patterns
        """
        try:
            # Use last few characters of principal for role assignment
            last_chars = principal_id[-4:].lower()
            
            # Simple hash-based role assignment for demo
            hash_value = int(hashlib.md5(principal_id.encode()).hexdigest()[:8], 16)
            role_index = hash_value % 5
            
            roles = ["citizen", "vendor", "deputy", "state_head", "main_government"]
            return roles[role_index]
            
        except Exception:
            return "citizen"  # Default fallback
    
    async def authenticate_user(self, principal_id: str, delegation_chain: List[Dict], domain: Optional[str] = None) -> Dict[str, Any]:
        """
        Complete Internet Identity authentication flow
        """
        try:
            # Verify Internet Identity delegation chain
            if not await self.verify_internet_identity(principal_id, delegation_chain, domain):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid Internet Identity credentials"
                )
            
            # Get user role from canister or demo mapping
            role = await self.get_user_role_from_canister(principal_id)
            if not role:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Unable to determine user role"
                )
            
            # Create access token
            access_token = self.create_access_token(
                data={"principal_id": principal_id, "role": role}
            )
            
            # Get additional user info based on role
            user_info = await self.get_user_info(principal_id, role)
            
            return {
                "access_token": access_token,
                "token_type": "bearer",
                "principal_id": principal_id,
                "role": role,
                "user_info": user_info,
                "expires_in": self.access_token_expire_minutes * 60,
                "demo_mode": settings.demo_mode
            }
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Authentication failed: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Authentication service error"
            )
    
    def create_access_token(self, data: dict) -> str:
        """
        Create JWT access token
        """
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(minutes=self.access_token_expire_minutes)
        to_encode.update({"exp": expire})
        
        encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
        return encoded_jwt
    
    async def verify_token(self, token: str) -> Dict[str, Any]:
        """
        Verify and decode JWT token
        """
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            principal_id: str = payload.get("principal_id")
            role: str = payload.get("role")
            
            if principal_id is None or role is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token payload"
                )
            
            # Re-verify role with canister (security check)
            current_role = await self.get_user_role_from_canister(principal_id)
            if current_role != role:
                logger.warning(f"Role mismatch for {principal_id}: token={role}, current={current_role}")
                # Update role if changed
                role = current_role
            
            return {
                "principal_id": principal_id,
                "role": role,
                "valid": True
            }
            
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired"
            )
        except jwt.JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
    
    async def get_user_info(self, principal_id: str, role: str) -> Dict[str, Any]:
        """
        Get additional user information based on role
        """
        try:
            base_info = {
                "principal_id": principal_id,
                "role": role,
                "authenticated_at": datetime.utcnow().isoformat()
            }
            
            if role == "main_government":
                # Get government statistics
                try:
                    stats = await self.canister_service.get_system_stats()
                except:
                    stats = {"total_users": 150, "active_projects": 25, "fraud_cases": 8}
                
                base_info.update({
                    "name": "Government Authority",
                    "title": "Main Government Authority",
                    "permissions": ["budget_control", "role_management", "fraud_oversight", "system_administration"],
                    "system_stats": stats
                })
            
            elif role == "state_head":
                base_info.update({
                    "name": "State Administrator",
                    "title": "State Head",
                    "permissions": ["budget_allocation", "deputy_management", "regional_oversight"],
                    "state": "Maharashtra"  # TODO: Get from canister
                })
            
            elif role == "deputy":
                base_info.update({
                    "name": "District Officer",
                    "title": "District Deputy",
                    "permissions": ["vendor_selection", "project_management", "claim_review"],
                    "district": "Mumbai"  # TODO: Get from canister
                })
            
            elif role == "vendor":
                base_info.update({
                    "name": "Contractor",
                    "title": "Registered Vendor",
                    "permissions": ["claim_submission", "payment_tracking", "supplier_management"],
                    "vendor_status": "approved"  # TODO: Get from canister
                })
            
            else:  # citizen
                base_info.update({
                    "name": "Community Member",
                    "title": "Citizen Observer",
                    "permissions": ["transparency_access", "corruption_reporting", "community_verification"],
                    "stake_balance": "1.5"  # TODO: Get ICP balance
                })
            
            return base_info
            
        except Exception as e:
            logger.error(f"Failed to get user info for {principal_id}: {e}")
            return {
                "principal_id": principal_id,
                "role": role,
                "name": role.replace("_", " ").title(),
                "title": role.replace("_", " ").title(),
                "permissions": [],
                "error": "Failed to load user details"
            }

# Singleton instance
principal_auth_service = PrincipalAuthService()