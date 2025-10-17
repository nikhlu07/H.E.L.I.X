# Authentication System (`app/auth/`)

## Overview

This directory contains the complete authentication and authorization system for H.E.L.I.X., integrating Internet Identity (ICP's decentralized authentication) with role-based access control (RBAC). It provides secure, passwordless authentication and fine-grained permission management across all user roles.

## Purpose

The authentication system serves as the security foundation for H.E.L.I.X., handling:

- **Internet Identity Integration**: Passwordless authentication using WebAuthn/biometrics
- **Principal-Based Authentication**: ICP principal ID verification and JWT token generation
- **Role-Based Access Control (RBAC)**: Hierarchical permission system with 5 user roles
- **Token Management**: JWT creation, validation, and refresh mechanisms
- **Middleware Protection**: Request-level authentication and authorization enforcement
- **Canister Integration**: Real-time role verification with ICP smart contracts

## Contents

### Files

- **__init__.py** - Python package initialization (currently empty)
- **icp_auth.py** - Internet Identity authentication handler with delegation chain validation
- **icp_rbac.py** - Role-Based Access Control manager with ICP canister integration
- **middleware.py** - FastAPI middleware for authentication enforcement and role checking
- **prinicipal_auth.py** - Principal authentication service coordinating II verification and role management

## Architecture Context

The authentication system integrates multiple layers of H.E.L.I.X.'s security architecture:

```
User (Browser)
    ↓
Internet Identity (ICP)
    ↓ [Delegation Chain]
icp_auth.py (Validation)
    ↓
prinicipal_auth.py (Role Determination)
    ↓ [Query Canister]
ICP Canister (Role Storage)
    ↓
JWT Token Generation
    ↓
middleware.py (Request Protection)
    ↓
API Endpoints (Protected)
```

### Authentication Flow

1. **User Login**: User authenticates via Internet Identity using WebAuthn/biometrics
2. **Delegation Chain**: II provides delegation chain proving user's identity
3. **Chain Validation**: `icp_auth.py` validates delegation chain cryptographically
4. **Principal Extraction**: Extract principal ID from validated delegation
5. **Role Query**: `prinicipal_auth.py` queries ICP canister for user's role
6. **JWT Generation**: Create JWT token with principal ID and role
7. **Token Storage**: Frontend stores JWT for subsequent requests
8. **Request Authentication**: `middleware.py` validates JWT on each API request
9. **Authorization Check**: Verify user has required role/permissions for endpoint

### Role Hierarchy

H.E.L.I.X. implements a 5-level role hierarchy:

```
Level 5: Main Government (Full System Access)
    ↓
Level 4: State Head (Regional Management)
    ↓
Level 3: Deputy Officer (District Operations)
    ↓
Level 2: Vendor (Limited Contractor Access)
    ↓
Level 1: Citizen (Public Transparency Access)
```

## Key Concepts

### Internet Identity Integration

Internet Identity provides passwordless, decentralized authentication:

```python
# Validate delegation chain from Internet Identity
is_valid = await ii_auth.validate_delegation_chain(
    delegation_chain=delegation_chain,
    expected_principal=principal_id,
    domain="h-e-l-i-x.vercel.app"
)
```

**Key Features**:
- No passwords or secrets stored
- WebAuthn/biometric authentication
- Delegation-based authorization
- Cross-device session management
- Phishing-resistant by design

### Principal-Based Authentication

Every user is identified by their ICP principal ID:

```python
# Authenticate user and get role
auth_result = await principal_auth_service.authenticate_user(
    principal_id="rdmx6-jaaaa-aaaah-qcaiq-cai",
    delegation_chain=[...],
    domain="h-e-l-i-x.vercel.app"
)

# Returns:
{
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "token_type": "bearer",
    "principal_id": "rdmx6-jaaaa-aaaah-qcaiq-cai",
    "role": "main_government",
    "user_info": {...},
    "expires_in": 1800
}
```

### JWT Token Structure

JWT tokens contain principal ID and role:

```json
{
    "principal_id": "rdmx6-jaaaa-aaaah-qcaiq-cai",
    "role": "main_government",
    "exp": 1704067200
}
```

Tokens are signed with HS256 algorithm and expire after 30 minutes for security.

### Role-Based Access Control

Roles determine permissions and access levels:

```python
# Role permissions mapping
role_permissions = {
    "main_government": [
        "budget_control", "role_management", "fraud_oversight",
        "system_administration", "canister_upgrade", "emergency_override"
    ],
    "state_head": [
        "budget_allocation", "deputy_management", "regional_oversight",
        "vendor_proposal", "claim_review", "fraud_reporting"
    ],
    "deputy": [
        "vendor_selection", "project_management", "claim_review",
        "local_oversight", "payment_approval"
    ],
    "vendor": [
        "claim_submission", "payment_tracking", "supplier_management"
    ],
    "citizen": [
        "transparency_access", "corruption_reporting", "community_verification"
    ]
}
```

### Middleware Protection

FastAPI dependencies enforce authentication:

```python
from app.auth.middleware import get_current_user, require_main_government

# Require any authenticated user
@router.get("/profile")
async def get_profile(user: dict = Depends(get_current_user)):
    return user

# Require specific role
@router.post("/budget/create")
async def create_budget(
    budget_data: BudgetCreate,
    user: dict = Depends(require_main_government)
):
    # Only main government can access
    pass
```

## Usage Examples

### Complete Authentication Flow

```python
# 1. User authenticates with Internet Identity (frontend)
const identity = await AuthClient.create();
await identity.login({
    identityProvider: "https://identity.ic0.app",
    onSuccess: async () => {
        const principal = identity.getIdentity().getPrincipal();
        const delegation = await identity.getIdentity().getDelegation();
        
        // 2. Send to backend for verification
        const response = await fetch("/auth/login/internet-identity", {
            method: "POST",
            body: JSON.stringify({
                principal_id: principal.toText(),
                delegation_chain: delegation.delegations,
                domain: window.location.hostname
            })
        });
        
        const authData = await response.json();
        // 3. Store JWT token
        localStorage.setItem("access_token", authData.access_token);
    }
});
```

### Backend Token Validation

```python
# Automatic validation via middleware
from fastapi import Depends
from app.auth.middleware import get_current_user

@router.get("/api/v1/profile")
async def get_user_profile(current_user: dict = Depends(get_current_user)):
    """
    current_user automatically populated by middleware:
    {
        "principal_id": "rdmx6-jaaaa-aaaah-qcaiq-cai",
        "role": "main_government",
        "valid": True
    }
    """
    return {
        "principal": current_user["principal_id"],
        "role": current_user["role"],
        "permissions": get_role_permissions(current_user["role"])
    }
```

### Role-Based Endpoint Protection

```python
from app.auth.middleware import (
    require_main_government,
    require_allocation_rights,
    require_vendor_operations
)

# Only main government
@router.post("/system/configure")
async def configure_system(
    config: SystemConfig,
    user: dict = Depends(require_main_government)
):
    pass

# Main government or state head
@router.post("/budget/allocate")
async def allocate_budget(
    allocation: BudgetAllocation,
    user: dict = Depends(require_allocation_rights)
):
    pass

# Only vendors
@router.post("/claim/submit")
async def submit_claim(
    claim: ClaimData,
    user: dict = Depends(require_vendor_operations)
):
    pass
```

### Demo Authentication

For testing without Internet Identity:

```python
# Demo login endpoint
response = await client.post(
    "/auth/demo-login/main_government"
)

auth_data = response.json()
# Returns demo token for specified role
```

### Token Refresh

```python
# Refresh expired token
@router.post("/auth/refresh")
async def refresh_token(current_user: dict = Depends(get_current_user)):
    # Re-verify role with canister
    current_role = await principal_auth_service.get_user_role(
        current_user["principal_id"]
    )
    
    # Generate new token
    new_token = principal_auth_service.create_access_token(
        data={"principal_id": current_user["principal_id"], "role": current_role}
    )
    
    return {
        "access_token": new_token,
        "role": current_role,
        "role_changed": current_role != current_user["role"]
    }
```

## Security Features

### Delegation Chain Validation

Multi-step validation ensures authenticity:

1. **Structure Validation**: Check delegation chain format
2. **Signature Verification**: Verify cryptographic signatures
3. **Expiration Check**: Ensure delegations haven't expired
4. **Principal Derivation**: Derive principal from public key
5. **Domain Validation**: Verify delegation targets match expected domain

```python
async def validate_delegation_chain(
    delegation_chain: List[Dict],
    expected_principal: str,
    domain: Optional[str] = None
) -> bool:
    # Validate structure
    if not delegation_chain or not isinstance(delegation_chain, list):
        return False
    
    # Validate each delegation
    for delegation in delegation_chain:
        if not validate_single_delegation(delegation):
            return False
    
    # Verify principal
    if not validate_principal_in_chain(delegation_chain, expected_principal):
        return False
    
    # Check expiration
    if not validate_delegation_expiry(delegation_chain):
        return False
    
    # Validate domain (anti-phishing)
    if domain and not validate_domain_targets(delegation_chain, domain):
        return False
    
    return True
```

### Role Verification with Canister

Roles are verified against ICP canister for each request:

```python
async def get_user_role_from_canister(principal_id: str) -> str:
    # Query canister for role
    if await canister_service.is_main_government(principal_id):
        return "main_government"
    elif await canister_service.is_state_head(principal_id):
        return "state_head"
    elif await canister_service.is_deputy(principal_id):
        return "deputy"
    elif await canister_service.is_vendor(principal_id):
        return "vendor"
    else:
        return "citizen"
```

### Token Security

- **Short Expiration**: Tokens expire after 30 minutes
- **Signed Tokens**: HS256 algorithm with secret key
- **Role Re-verification**: Role checked against canister on token refresh
- **No Sensitive Data**: Tokens contain only principal ID and role

### Permission Checking

Fine-grained permission checks:

```python
def has_permission(user: dict, permission: str) -> bool:
    """Check if user has specific permission"""
    role_permissions = {
        "main_government": ["budget_control", "role_management", ...],
        "state_head": ["budget_allocation", "deputy_management", ...],
        # ...
    }
    
    user_permissions = role_permissions.get(user["role"], [])
    return permission in user_permissions
```

## Role Management

### Assigning Roles

Only main government can assign roles:

```python
@router.post("/auth/assign-role")
async def assign_role(
    assignment: RoleAssignment,
    user: dict = Depends(require_main_government)
):
    result = await rbac_manager.assign_role(
        RoleAssignment(
            target_principal="target-principal-id",
            role="state_head",
            assigned_by=user["principal_id"],
            reason="Promoted to state head position"
        )
    )
    return result
```

### Role Hierarchy Enforcement

Higher roles can manage lower roles:

```python
def _can_assign_role(assigner_role: str, target_role: str) -> bool:
    """Check if assigner can assign target role"""
    role_hierarchy = {
        'main_government': 5,
        'state_head': 4,
        'deputy': 3,
        'vendor': 2,
        'citizen': 1
    }
    
    assigner_level = role_hierarchy.get(assigner_role, 0)
    target_level = role_hierarchy.get(target_role, 0)
    
    # Can only assign roles at same level or below
    return assigner_level >= target_level
```

## Dependencies

### Internal Dependencies

- **app.config.settings** - Configuration management
- **app.icp.agent** - ICP agent for canister communication
- **app.icp.canister_calls** - Canister service for role queries
- **app.utils.logging** - Logging utilities
- **app.utils.exceptions** - Custom exception classes

### External Dependencies

- **PyJWT** - JWT token encoding/decoding
- **ic-py** - Internet Computer Python SDK
- **fastapi** - Web framework and dependency injection
- **fastapi.security** - HTTPBearer security scheme

## Testing

### Unit Tests

```bash
# Test authentication flow
pytest backend/tests/test_auth/test_principal_auth.py -v

# Test middleware
pytest backend/tests/test_auth/test_middleware.py -v

# Test RBAC
pytest backend/tests/test_auth/test_rbac.py -v
```

### Integration Tests

```bash
# Test with real ICP canister
pytest backend/tests/test_auth/ --integration -v
```

### Manual Testing

Use demo authentication for manual testing:

```bash
# Start backend
uvicorn app.main:app --reload

# Test demo login
curl -X POST http://localhost:8000/auth/demo-login/main_government

# Use returned token
curl -H "Authorization: Bearer {token}" http://localhost:8000/auth/profile
```

## Error Handling

### Common Authentication Errors

| Error | Status Code | Description | Solution |
|-------|-------------|-------------|----------|
| Invalid delegation chain | 401 | Delegation validation failed | Re-authenticate with II |
| Token expired | 401 | JWT token past expiration | Refresh token |
| Invalid token | 401 | Malformed or tampered token | Re-authenticate |
| Insufficient permissions | 403 | User lacks required role | Contact admin for role assignment |
| Role not found | 403 | Principal has no assigned role | Register with system |

### Error Response Format

```json
{
    "detail": "Token has expired",
    "status_code": 401,
    "error_type": "AuthenticationError"
}
```

## Performance Considerations

### Role Caching

Roles are cached for 15 minutes to reduce canister calls:

```python
self.role_cache: Dict[str, ICPRole] = {}
self.cache_ttl = timedelta(minutes=15)
```

### Async Operations

All authentication operations are async for non-blocking I/O:

```python
async def authenticate_user(...) -> Dict[str, Any]:
    # Non-blocking canister calls
    role = await self.get_user_role_from_canister(principal_id)
```

### Token Validation Optimization

JWT validation is fast (< 1ms) using local secret key verification.

## Related Documentation

- [API Layer](../api/README.md) - API endpoints using authentication
- [ICP Integration](../icp/README.md) - Canister communication details
- [Middleware](../middleware/README.md) - Request/response middleware
- [Configuration](../config/README.md) - Authentication settings
- [Main Application](../README.md) - Overall backend architecture

## Future Enhancements

- **Multi-Factor Authentication**: Add optional 2FA for sensitive operations
- **Session Management**: Track active sessions per user
- **Token Blacklisting**: Implement token revocation list
- **Audit Logging**: Enhanced logging of all authentication events
- **Rate Limiting**: Per-user rate limits for authentication attempts
- **Biometric Verification**: Additional biometric checks for high-value transactions
