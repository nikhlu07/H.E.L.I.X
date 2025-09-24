# """
# CorruptGuard Authentication API Endpoints
# Internet Identity authentication and session management
# """

# from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
# from typing import Dict, Any, List, Optional
# from datetime import datetime, timedelta

# from app.schemas.base import ResponseSchema, UserRole
# from app.auth.icp_auth import (
#     ii_auth, authenticate_user, verify_token, refresh_user_token, logout_user,
#     MockInternetIdentity, create_auth_response, session_manager
# )
# from app.api.deps import get_client_info, get_optional_user
# from app.utils.logging import get_logger, log_security_event
# from app.utils.exceptions import AuthenticationError, ValidationError

# logger = get_logger(__name__)
# router = APIRouter()


# # ===== AUTHENTICATION ENDPOINTS =====

# @router.post("/login/internet-identity")
# async def login_with_internet_identity(
#     delegation_data: Dict[str, Any],
#     request: Request,
#     client_info: Dict[str, Any] = Depends(get_client_info)
# ):
#     """
#     Authenticate user with Internet Identity delegation chain
    
#     Expected payload:
#     {
#         "delegation_chain": [...],
#         "user_principal": "principal-id"
#     }
#     """
#     try:
#         logger.info("🔐 Internet Identity login attempt")
        
#         # Extract delegation chain and principal
#         delegation_chain = delegation_data.get("delegation_chain", [])
#         user_principal = delegation_data.get("user_principal")
        
#         if not delegation_chain:
#             raise ValidationError("Delegation chain is required")
        
#         if not user_principal:
#             raise ValidationError("User principal is required")
        
#         # Authenticate with Internet Identity
#         auth_result = await authenticate_user(delegation_chain, user_principal)
        
#         if not auth_result["success"]:
#             raise AuthenticationError("Internet Identity authentication failed")
        
#         # Create session
#         session_id = session_manager.create_session(
#             user_principal, 
#             auth_result["token"]
#         )
        
#         # Log successful authentication
#         log_security_event(
#             event_type="INTERNET_IDENTITY_LOGIN",
#             description=f"User authenticated via Internet Identity",
#             user_principal=user_principal,
#             client_ip=client_info.get("ip"),
#             severity="low"
#         )
        
#         # Create response with auth data
#         response_data = create_auth_response(
#             auth_result["user"], 
#             auth_result["token"]
#         )
#         response_data["session_id"] = session_id
        
#         return ResponseSchema(
#             message="Authentication successful",
#             data=response_data
#         )
        
#     except Exception as e:
#         logger.error(f"❌ Internet Identity login failed: {str(e)}")
        
#         # Log failed authentication
#         log_security_event(
#             event_type="AUTHENTICATION_FAILURE",
#             description=f"Internet Identity login failed: {str(e)}",
#             user_principal=delegation_data.get("user_principal", "unknown"),
#             client_ip=client_info.get("ip"),
#             severity="medium"
#         )
        
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail=str(e)
#         )


# @router.post("/login/demo")
# async def demo_login(
#     demo_data: Dict[str, Any],
#     request: Request,
#     client_info: Dict[str, Any] = Depends(get_client_info)
# ):
#     """
#     Demo authentication for development and testing
    
#     Expected payload:
#     {
#         "principal_id": "demo-principal-123",
#         "role": "citizen"
#     }
#     """
#     try:
#         # Only allow in development mode
#         settings = ii_auth.settings
#         if not settings.DEBUG:
#             raise AuthenticationError("Demo authentication only available in development mode")
        
#         principal_id = demo_data.get("principal_id")
#         role = demo_data.get("role", "citizen")
        
#         if not principal_id:
#             raise ValidationError("Principal ID is required for demo login")
        
#         # Validate role
#         if role not in [r.value for r in UserRole]:
#             raise ValidationError(f"Invalid role: {role}")
        
#         logger.info(f"🎭 Demo authentication for {principal_id} as {role}")
        
#         # Use mock authentication
#         auth_result = await MockInternetIdentity.mock_authenticate(principal_id, role)
        
#         # Create session
#         session_id = session_manager.create_session(
#             principal_id, 
#             auth_result["token"]
#         )
        
#         # Create response
#         response_data = create_auth_response(
#             auth_result["user"], 
#             auth_result["token"]
#         )
#         response_data["session_id"] = session_id
#         response_data["demo_mode"] = True
        
#         return ResponseSchema(
#             message="Demo authentication successful",
#             data=response_data
#         )
        
#     except Exception as e:
#         logger.error(f"❌ Demo login failed: {str(e)}")
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail=str(e)
#         )


# @router.post("/refresh")
# async def refresh_token(
#     refresh_data: Dict[str, Any],
#     request: Request,
#     client_info: Dict[str, Any] = Depends(get_client_info)
# ):
#     """
#     Refresh authentication token
    
#     Expected payload:
#     {
#         "token": "current-jwt-token"
#     }
#     """
#     try:
#         current_token = refresh_data.get("token")
        
#         if not current_token:
#             raise ValidationError("Current token is required")
        
#         # Check if token is blacklisted
#         if session_manager.is_token_blacklisted(current_token):
#             raise AuthenticationError("Token has been revoked")
        
#         # Refresh token
#         refresh_result = await refresh_user_token(current_token)
        
#         if not refresh_result["success"]:
#             raise AuthenticationError("Token refresh failed")
        
#         logger.info("🔄 Token refreshed successfully")
        
#         return ResponseSchema(
#             message="Token refreshed successfully",
#             data=refresh_result
#         )
        
#     except Exception as e:
#         logger.error(f"❌ Token refresh failed: {str(e)}")
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail=str(e)
#         )


# @router.post("/logout")
# async def logout(
#     logout_data: Dict[str, Any],
#     request: Request,
#     user: Optional[Dict[str, Any]] = Depends(get_optional_user),
#     client_info: Dict[str, Any] = Depends(get_client_info)
# ):
#     """
#     Logout user and invalidate session
    
#     Expected payload:
#     {
#         "token": "jwt-token",
#         "session_id": "session-id"
#     }
#     """
#     try:
#         token = logout_data.get("token")
#         session_id = logout_data.get("session_id")
        
#         # Get user principal from token or user object
#         user_principal = "unknown"
#         if user:
#             user_principal = user.get("principal", "unknown")
#         elif token:
#             try:
#                 payload = verify_token(token)
#                 user_principal = payload.get("principal", "unknown")
#             except:
#                 pass
        
#         # Logout user
#         if token:
#             logout_result = await logout_user(token, user_principal)
        
#         # Invalidate session
#         if session_id:
#             session_manager.invalidate_session(session_id)
        
#         # Log logout
#         log_security_event(
#             event_type="USER_LOGOUT",
#             description="User logged out",
#             user_principal=user_principal,
#             client_ip=client_info.get("ip"),
#             severity="low"
#         )
        
#         logger.info(f"👋 User logged out: {user_principal}")
        
#         return ResponseSchema(
#             message="Logout successful",
#             data={"logged_out": True}
#         )
        
#     except Exception as e:
#         logger.error(f"❌ Logout failed: {str(e)}")
#         return ResponseSchema(
#             message="Logout completed",
#             data={"logged_out": True}
#         )


# # ===== USER PROFILE ENDPOINTS =====

# @router.get("/profile")
# async def get_user_profile(
#     user: Dict[str, Any] = Depends(get_optional_user)
# ):
#     """
#     Get current user profile information
#     """
#     if not user:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Authentication required"
#         )
    
#     try:
#         # Get detailed user profile
#         profile = {
#             "principal": user["principal"],
#             "role": user["role"],
#             "permissions": user.get("permissions", []),
#             "created_at": user.get("created_at"),
#             "last_login": user.get("last_login"),
#             "last_activity": user.get("last_activity"),
#             "active": user.get("active", True),
#             "session_info": {
#                 "authenticated": True,
#                 "auth_method": "internet_identity" if not user.get("mock_user") else "demo",
#                 "token_expires": user.get("exp")
#             }
#         }
        
#         return ResponseSchema(
#             message="User profile retrieved",
#             data=profile
#         )
        
#     except Exception as e:
#         logger.error(f"❌ Failed to get user profile: {str(e)}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail="Failed to retrieve user profile"
#         )


# @router.put("/profile")
# async def update_user_profile(
#     profile_data: Dict[str, Any],
#     user: Dict[str, Any] = Depends(get_optional_user)
# ):
#     """
#     Update user profile information
#     """
#     if not user:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Authentication required"
#         )
    
#     try:
#         # Extract updateable fields
#         allowed_fields = ["name", "email", "organization", "preferences"]
#         updates = {k: v for k, v in profile_data.items() if k in allowed_fields}
        
#         if not updates:
#             raise ValidationError("No valid fields to update")
        
#         # TODO: Update user profile in database
        
#         logger.info(f"📝 Profile updated for user: {user['principal']}")
        
#         return ResponseSchema(
#             message="Profile updated successfully",
#             data={
#                 "updated_fields": list(updates.keys()),
#                 "updated_at": datetime.utcnow().isoformat()
#             }
#         )
        
#     except Exception as e:
#         logger.error(f"❌ Failed to update user profile: {str(e)}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e)
#         )


# # ===== SESSION MANAGEMENT ENDPOINTS =====

# @router.get("/sessions")
# async def get_user_sessions(
#     user: Dict[str, Any] = Depends(get_optional_user)
# ):
#     """
#     Get active sessions for current user
#     """
#     if not user:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Authentication required"
#         )
    
#     try:
#         user_principal = user["principal"]
        
#         # Get user's active sessions
#         user_sessions = []
#         for session_id, session_data in session_manager.active_sessions.items():
#             if session_data["principal_id"] == user_principal and session_data["active"]:
#                 user_sessions.append({
#                     "session_id": session_id,
#                     "created_at": session_data["created_at"].isoformat(),
#                     "last_activity": session_data["last_activity"].isoformat(),
#                     "active": session_data["active"]
#                 })
        
#         return ResponseSchema(
#             message="Active sessions retrieved",
#             data={
#                 "sessions": user_sessions,
#                 "total_sessions": len(user_sessions)
#             }
#         )
        
#     except Exception as e:
#         logger.error(f"❌ Failed to get user sessions: {str(e)}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail="Failed to retrieve sessions"
#         )


# @router.delete("/sessions/{session_id}")
# async def terminate_session(
#     session_id: str,
#     user: Dict[str, Any] = Depends(get_optional_user)
# ):
#     """
#     Terminate a specific session
#     """
#     if not user:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Authentication required"
#         )
    
#     try:
#         user_principal = user["principal"]
        
#         # Check if session belongs to user
#         session = session_manager.active_sessions.get(session_id)
#         if not session or session["principal_id"] != user_principal:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail="Session not found"
#             )
        
#         # Invalidate session
#         session_manager.invalidate_session(session_id)
        
#         logger.info(f"🔌 Session terminated: {session_id}")
        
#         return ResponseSchema(
#             message="Session terminated successfully",
#             data={"session_id": session_id, "terminated": True}
#         )
        
#     except Exception as e:
#         logger.error(f"❌ Failed to terminate session: {str(e)}")
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e)
#         )


# # ===== ROLE MANAGEMENT ENDPOINTS =====

# @router.get("/roles")
# async def get_available_roles():
#     """
#     Get available user roles and their descriptions
#     """
#     roles = {
#         "main_government": {
#             "name": "Main Government",
#             "description": "Central government authority with full system access",
#             "permissions": ["create_budget", "manage_roles", "system_admin", "fraud_management"]
#         },
#         "state_head": {
#             "name": "State Head",
#             "description": "State-level government official managing regional operations",
#             "permissions": ["allocate_budget", "manage_deputies", "regional_oversight"]
#         },
#         "deputy": {
#             "name": "Deputy",
#             "description": "District-level official managing local projects and vendors",
#             "permissions": ["select_vendors", "review_claims", "manage_projects"]
#         },
#         "vendor": {
#             "name": "Vendor",
#             "description": "Approved contractor for government projects",
#             "permissions": ["submit_claims", "pay_suppliers", "manage_projects"]
#         },
#         "citizen": {
#             "name": "Citizen",
#             "description": "Public user with transparency and oversight access",
#             "permissions": ["view_public_data", "submit_challenges", "verify_projects"]
#         }
#     }
    
#     return ResponseSchema(
#         message="Available roles retrieved",
#         data=roles
#     )


# @router.get("/permissions")
# async def get_user_permissions(
#     user: Dict[str, Any] = Depends(get_optional_user)
# ):
#     """
#     Get current user's permissions
#     """
#     if not user:
#         return ResponseSchema(
#             message="User permissions (unauthenticated)",
#             data={"permissions": ["view_public_data"]}
#         )
    
#     permissions = user.get("permissions", [])
    
#     return ResponseSchema(
#         message="User permissions retrieved",
#         data={
#             "role": user["role"],
#             "permissions": permissions,
#             "is_authenticated": True
#         }
#     )


# # ===== AUTHENTICATION STATUS ENDPOINTS =====

# @router.get("/status")
# async def get_auth_status(
#     user: Optional[Dict[str, Any]] = Depends(get_optional_user)
# ):
#     """
#     Get current authentication status
#     """
#     if not user:
#         return ResponseSchema(
#             message="Not authenticated",
#             data={
#                 "authenticated": False,
#                 "user": None,
#                 "permissions": ["view_public_data"]
#             }
#         )
    
#     return ResponseSchema(
#         message="Authentication status",
#         data={
#             "authenticated": True,
#             "user": {
#                 "principal": user["principal"],
#                 "role": user["role"],
#                 "permissions": user.get("permissions", [])
#             },
#             "session_valid": True,
#             "token_expires": user.get("exp")
#         }
#     )


class VerifyTokenRequest(BaseModel):
    token: str = Field(..., description="JWT access token to verify")

@router.post("/verify-token")
async def verify_auth_token(req: VerifyTokenRequest):
    """
    Verify if a JWT token is valid and return principal and role if so
    """
    try:
        result = await principal_auth_service.verify_token(req.token)
        return {
            "message": "Token is valid",
            "data": {
                "valid": True,
                "principal": result.get("principal_id"),
                "role": result.get("role")
            }
        }
    except HTTPException as e:
        # Return a 200 with valid False to simplify client handling on frontend
        return {
            "message": "Token verification failed",
            "data": {"valid": False, "error": e.detail}
        }
    except Exception:
        return {
            "message": "Token verification failed",
            "data": {"valid": False, "error": "Token verification failed"}
        }


# # ===== DEVELOPMENT ENDPOINTS =====

# @router.get("/dev/mock-users")
# async def get_mock_users():
#     """
#     Get available mock users for development
#     Only available in development mode
#     """
#     settings = ii_auth.settings
#     if not settings.DEBUG:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="Endpoint not available in production"
#         )
    
#     mock_users = [
#         {
#             "principal_id": "main-gov-principal-123",
#             "role": "main_government",
#             "name": "Main Government Admin",
#             "description": "Central government authority"
#         },
#         {
#             "principal_id": "state-head-principal-456",
#             "role": "state_head",
#             "name": "Maharashtra State Head",
#             "description": "State-level management"
#         },
#         {
#             "principal_id": "deputy-principal-789",
#             "role": "deputy",
#             "name": "Mumbai Deputy",
#             "description": "District-level execution"
#         },
#         {
#             "principal_id": "vendor-principal-101",
#             "role": "vendor",
#             "name": "ABC Construction",
#             "description": "Approved contractor"
#         },
#         {
#             "principal_id": "citizen-principal-202",
#             "role": "citizen",
#             "name": "John Citizen",
#             "description": "Public oversight"
#         }
#     ]
    
#     return ResponseSchema(
#         message="Mock users for development",
#         data={"mock_users": mock_users}
#     )

# backend/app/api/auth.py - NEW
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
import logging
from ..auth.prinicipal_auth import principal_auth_service
from ..auth.middleware import get_current_user, get_optional_user

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/auth", tags=["Authentication"])

# Request/Response Models
class InternetIdentityLogin(BaseModel):
    principal_id: str = Field(..., description="Internet Identity Principal ID")
    signature: str = Field(..., description="Delegation signature from Internet Identity")
    delegation: Optional[str] = Field(None, description="Delegation chain (optional)")

class AuthResponse(BaseModel):
    access_token: str
    token_type: str
    principal_id: str
    role: str
    user_info: Dict[str, Any]
    expires_in: int

class UserProfile(BaseModel):
    principal_id: str
    role: str
    title: str
    permissions: list
    authenticated_at: str

class RoleChangeRequest(BaseModel):
    target_principal: str = Field(..., description="Principal ID to change role for")
    new_role: str = Field(..., description="New role to assign")
    reason: str = Field(..., description="Reason for role change")

@router.post("/login/internet-identity", response_model=AuthResponse)
async def login_with_internet_identity(login_data: InternetIdentityLogin):
    """
    Authenticate user with Internet Identity
    
    Process:
    1. Verify Internet Identity signature
    2. Determine user role from ICP canister
    3. Generate JWT access token
    4. Return authentication response
    """
    try:
        logger.info(f"Internet Identity login attempt for principal: {login_data.principal_id}")
        
        # Authenticate user and get role
        auth_result = await principal_auth_service.authenticate_user(
            principal_id=login_data.principal_id,
            signature=login_data.signature
        )
        
        logger.info(f"Successful authentication for {login_data.principal_id} as {auth_result['role']}")
        
        return AuthResponse(**auth_result)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login failed for {login_data.principal_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Authentication service error"
        )

@router.post("/demo-login/{role}")
async def demo_login(role: str):
    """
    Demo login for testing purposes
    Creates a test principal for the specified role
    """
    if role not in ["main_government", "state_head", "deputy", "vendor", "citizen"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid role. Must be one of: main_government, state_head, deputy, vendor, citizen"
        )
    
    # Generate demo principal ID
    demo_principals = {
        "main_government": "rdmx6-jaaaa-aaaah-qcaiq-cai",
        "state_head": "renrk-eyaaa-aaaah-qcaia-cai", 
        "deputy": "rrkah-fqaaa-aaaah-qcaiq-cai",
        "vendor": "radvj-tiaaa-aaaah-qcaiq-cai",
        "citizen": "raahe-xyaaa-aaaah-qcaiq-cai"
    }
    
    principal_id = demo_principals[role]
    
    try:
        # Create access token directly for demo
        access_token = principal_auth_service.create_access_token(
            data={"principal_id": principal_id, "role": role}
        )
        
        user_info = await principal_auth_service.get_user_info(principal_id, role)
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "principal_id": principal_id,
            "role": role,
            "user_info": user_info,
            "expires_in": 24 * 60 * 60,  # 24 hours
            "demo_mode": True
        }
        
    except Exception as e:
        logger.error(f"Demo login failed for role {role}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Demo authentication failed"
        )

@router.get("/profile", response_model=UserProfile)
async def get_user_profile(current_user: dict = Depends(get_current_user)):
    """
    Get current user profile information
    """
    try:
        # Get fresh user info from canister
        user_info = await principal_auth_service.get_user_info(
            current_user["principal_id"], 
            current_user["role"]
        )
        
        return UserProfile(
            principal_id=current_user["principal_id"],
            role=current_user["role"],
            title=user_info.get("title", current_user["role"].replace("_", " ").title()),
            permissions=user_info.get("permissions", []),
            authenticated_at=user_info.get("authenticated_at", "")
        )
        
    except Exception as e:
        logger.error(f"Failed to get profile for {current_user['principal_id']}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve user profile"
        )

@router.post("/refresh")
async def refresh_token(current_user: dict = Depends(get_current_user)):
    """
    Refresh access token and re-verify role
    """
    try:
        # Re-verify role with canister
        current_role = await principal_auth_service.get_user_role(current_user["principal_id"])
        
        # Create new token
        new_token = principal_auth_service.create_access_token(
            data={"principal_id": current_user["principal_id"], "role": current_role}
        )
        
        # Get updated user info
        user_info = await principal_auth_service.get_user_info(
            current_user["principal_id"], 
            current_role
        )
        
        return {
            "access_token": new_token,
            "token_type": "bearer",
            "principal_id": current_user["principal_id"],
            "role": current_role,
            "user_info": user_info,
            "expires_in": 24 * 60 * 60,
            "role_changed": current_role != current_user["role"]
        }
        
    except Exception as e:
        logger.error(f"Token refresh failed for {current_user['principal_id']}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Token refresh failed"
        )

@router.post("/logout")
async def logout(current_user: dict = Depends(get_current_user)):
    """
    Logout user (invalidate token)
    In production, this would add token to blacklist
    """
    try:
        logger.info(f"User logout: {current_user['principal_id']}")
        
        # TODO: Add token to blacklist/revocation list
        # For now, just log the logout event
        
        return {
            "message": "Successfully logged out",
            "principal_id": current_user["principal_id"]
        }
        
    except Exception as e:
        logger.error(f"Logout failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Logout failed"
        )

@router.get("/verify-role/{target_principal}")
async def verify_user_role(
    target_principal: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Verify the role of another user (for administration)
    Only main government can verify other users' roles
    """
    if current_user["role"] != "main_government":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only main government can verify user roles"
        )
    
    try:
        role = await principal_auth_service.get_user_role(target_principal)
        user_info = await principal_auth_service.get_user_info(target_principal, role)
        
        return {
            "target_principal": target_principal,
            "role": role,
            "user_info": user_info,
            "verified_by": current_user["principal_id"],
            "verified_at": user_info.get("authenticated_at")
        }
        
    except Exception as e:
        logger.error(f"Role verification failed for {target_principal}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Role verification failed"
        )

@router.get("/system-status")
async def get_auth_system_status(user: dict = Depends(get_optional_user)):
    """
    Get authentication system status (public endpoint)
    Shows different information based on user role
    """
    try:
        base_status = {
            "service": "CorruptGuard Authentication",
            "status": "operational",
            "internet_identity": "connected",
            "icp_canister": "operational"
        }
        
        if user and user["role"] == "main_government":
            # Add admin statistics
            base_status.update({
                "total_authenticated_users": "1,247",  # TODO: Get from database
                "active_sessions": "89",
                "failed_login_attempts": "12",
                "role_distribution": {
                    "citizens": 1156,
                    "vendors": 67,
                    "deputies": 18,
                    "state_heads": 5,
                    "main_government": 1
                }
            })
        
        return base_status
        
    except Exception as e:
        logger.error(f"Failed to get auth system status: {e}")
        return {
            "service": "CorruptGuard Authentication",
            "status": "error",
            "message": "Failed to retrieve system status"
        }