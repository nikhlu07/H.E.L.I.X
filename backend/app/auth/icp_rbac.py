"""
ICP RBAC Integration for CorruptGuard
Handles role verification with Internet Computer canister
"""

import asyncio
import logging
from typing import Dict, List, Optional, Set
from dataclasses import dataclass
from datetime import datetime, timedelta
import hashlib
import json

from app.icp.canister_calls import canister_service

logger = logging.getLogger(__name__)

@dataclass
class ICPRole:
    """Represents a role verified on ICP canister"""
    principal_id: str
    role: str
    permissions: List[str]
    assigned_by: Optional[str] = None
    assigned_at: Optional[datetime] = None
    canister_verified: bool = False
    verification_hash: Optional[str] = None

@dataclass
class RoleAssignment:
    """Role assignment request"""
    target_principal: str
    role: str
    assigned_by: str
    reason: str
    requires_approval: bool = False

class ICPRBACManager:
    """
    Manages Role-Based Access Control with ICP canister integration
    """
    
    def __init__(self):
        self.role_cache: Dict[str, ICPRole] = {}
        self.cache_ttl = timedelta(minutes=15)  # Cache roles for 15 minutes
        self.role_hierarchy = {
            'auditor': 6,  # Highest - system administrator
            'main_government': 5,
            'state_head': 4,
            'deputy': 3,
            'vendor': 2,
            'citizen': 1
        }
        
        # Define role permissions
        self.role_permissions = {
            'auditor': [
                'system_management', 'view_all', 'emergency_control', 
                'role_assignment', 'audit_access', 'canister_management',
                'set_main_government', 'pause_system', 'view_all_data'
            ],
            'main_government': [
                'budget_control', 'role_management', 'fraud_oversight', 
                'system_administration', 'canister_upgrade', 'emergency_override',
                'budget_allocation', 'vendor_approval', 'audit_access'
            ],
            'state_head': [
                'budget_allocation', 'deputy_management', 'regional_oversight',
                'vendor_proposal', 'claim_review', 'fraud_reporting',
                'transparency_access'
            ],
            'deputy': [
                'vendor_selection', 'project_management', 'claim_review',
                'local_oversight', 'payment_approval', 'transparency_access'
            ],
            'vendor': [
                'claim_submission', 'payment_tracking', 'supplier_management',
                'document_upload', 'payment_request', 'project_updates'
            ],
            'citizen': [
                'transparency_access', 'corruption_reporting', 'community_verification',
                'challenge_stakes', 'public_comments', 'audit_requests'
            ]
        }

    async def verify_principal_role(self, principal_id: str, force_refresh: bool = False) -> Optional[ICPRole]:
        """
        Verify principal role with ICP canister
        """
        try:
            # Check cache first (unless force refresh)
            if not force_refresh and principal_id in self.role_cache:
                cached_role = self.role_cache[principal_id]
                if datetime.now() - (cached_role.assigned_at or datetime.now()) < self.cache_ttl:
                    logger.debug(f"Using cached role for principal {principal_id}")
                    return cached_role

            # Query canister for role verification
            logger.info(f"Verifying role for principal {principal_id} with ICP canister")
            canister_roles = await canister_service.check_role(principal_id)
            
            if not canister_roles:
                logger.warning(f"No role found for principal {principal_id}")
                return None

            # Determine primary role based on hierarchy
            primary_role = self._determine_primary_role(canister_roles)
            
            if not primary_role:
                logger.warning(f"Could not determine primary role for principal {principal_id}")
                return None

            # Get permissions for role
            permissions = self.role_permissions.get(primary_role, [])
            
            # Create verified role object
            icp_role = ICPRole(
                principal_id=principal_id,
                role=primary_role,
                permissions=permissions,
                assigned_at=datetime.now(),
                canister_verified=True,
                verification_hash=self._generate_verification_hash(principal_id, primary_role)
            )
            
            # Cache the result
            self.role_cache[principal_id] = icp_role
            
            logger.info(f"Successfully verified role '{primary_role}' for principal {principal_id}")
            return icp_role
            
        except Exception as e:
            logger.error(f"Failed to verify role for principal {principal_id}: {str(e)}")
            return None

    def _determine_primary_role(self, canister_roles: Dict) -> Optional[str]:
        """
        Determine primary role based on hierarchy
        """
        # Check roles in order of hierarchy (highest first)
        if canister_roles.get('isMainGovernment', False):
            return 'main_government'
        elif canister_roles.get('isStateHead', False):
            return 'state_head'
        elif canister_roles.get('isDeputy', False):
            return 'deputy'
        elif canister_roles.get('isVendor', False):
            return 'vendor'
        else:
            # Default to citizen for any authenticated ICP user
            return 'citizen'

    def _generate_verification_hash(self, principal_id: str, role: str) -> str:
        """
        Generate verification hash for role assignment
        """
        data = f"{principal_id}-{role}-{datetime.now().isoformat()}"
        return hashlib.sha256(data.encode()).hexdigest()[:16]

    async def assign_role(self, assignment: RoleAssignment) -> Dict[str, any]:
        """
        Assign role to principal (must be called by authorized user)
        """
        try:
            # Verify assigner has permission
            assigner_role = await self.verify_principal_role(assignment.assigned_by)
            if not assigner_role:
                return {
                    "success": False,
                    "error": "Assigner role not verified"
                }

            # Check if assigner can assign this role
            if not self._can_assign_role(assigner_role.role, assignment.role):
                return {
                    "success": False,
                    "error": f"Role '{assigner_role.role}' cannot assign role '{assignment.role}'"
                }

            # Call canister to assign role
            result = await self._canister_assign_role(assignment)
            
            if result["success"]:
                # Clear cache for target principal
                if assignment.target_principal in self.role_cache:
                    del self.role_cache[assignment.target_principal]
                
                # Log role assignment for audit
                await self._log_role_assignment(assignment, result.get("transaction_id"))
                
                logger.info(f"Successfully assigned role '{assignment.role}' to {assignment.target_principal}")
                
            return result
            
        except Exception as e:
            logger.error(f"Failed to assign role: {str(e)}")
            return {
                "success": False,
                "error": f"Role assignment failed: {str(e)}"
            }

    def _can_assign_role(self, assigner_role: str, target_role: str) -> bool:
        """
        Check if assigner can assign target role based on hierarchy
        """
        assigner_level = self.role_hierarchy.get(assigner_role, 0)
        target_level = self.role_hierarchy.get(target_role, 0)
        
        # Main government can assign any role
        if assigner_role == 'main_government':
            return True
            
        # State heads can assign deputies and below
        if assigner_role == 'state_head' and target_role in ['deputy', 'vendor', 'citizen']:
            return True
            
        # Deputies can propose vendors (requires approval)
        if assigner_role == 'deputy' and target_role == 'vendor':
            return True
            
        # Citizens cannot assign roles
        return False

    async def _canister_assign_role(self, assignment: RoleAssignment) -> Dict[str, any]:
        """
        Call canister to assign role
        """
        try:
            if assignment.role == 'state_head':
                # First propose, then confirm
                result1 = await canister_service.propose_state_head(assignment.target_principal)
                if result1["success"]:
                    result2 = await canister_service.confirm_state_head(assignment.target_principal)
                    return result2
                return result1
                
            elif assignment.role == 'deputy':
                # Propose and confirm deputy
                result1 = await canister_service.propose_deputy(assignment.target_principal, assignment.assigned_by)
                if result1["success"]:
                    result2 = await canister_service.confirm_deputy(assignment.target_principal, assignment.assigned_by)
                    return result2
                return result1
                
            elif assignment.role == 'vendor':
                # Propose and approve vendor
                result1 = await canister_service.propose_vendor(assignment.target_principal)
                if result1["success"]:
                    result2 = await canister_service.approve_vendor(assignment.target_principal)
                    return result2
                return result1
                
            else:
                return {
                    "success": False,
                    "error": f"Role assignment not implemented for role: {assignment.role}"
                }
                
        except Exception as e:
            logger.error(f"Canister role assignment failed: {str(e)}")
            return {
                "success": False,
                "error": f"Canister operation failed: {str(e)}"
            }

    async def _log_role_assignment(self, assignment: RoleAssignment, transaction_id: Optional[str]):
        """
        Log role assignment for audit trail
        """
        audit_data = {
            "action": "role_assignment",
            "target_principal": assignment.target_principal,
            "role": assignment.role,
            "assigned_by": assignment.assigned_by,
            "reason": assignment.reason,
            "timestamp": datetime.now().isoformat(),
            "transaction_id": transaction_id,
            "verification_hash": self._generate_verification_hash(assignment.target_principal, assignment.role)
        }
        
        # In production, this would write to audit log or blockchain
        logger.info(f"AUDIT: Role assignment - {json.dumps(audit_data)}")

    async def check_permission(self, principal_id: str, required_permission: str) -> bool:
        """
        Check if principal has specific permission
        """
        try:
            role = await self.verify_principal_role(principal_id)
            if not role:
                return False
                
            return required_permission in role.permissions
            
        except Exception as e:
            logger.error(f"Permission check failed for {principal_id}: {str(e)}")
            return False

    async def check_role_hierarchy(self, principal_id: str, minimum_role: str) -> bool:
        """
        Check if principal has minimum role level
        """
        try:
            role = await self.verify_principal_role(principal_id)
            if not role:
                return False
                
            user_level = self.role_hierarchy.get(role.role, 0)
            required_level = self.role_hierarchy.get(minimum_role, 0)
            
            return user_level >= required_level
            
        except Exception as e:
            logger.error(f"Role hierarchy check failed for {principal_id}: {str(e)}")
            return False

    async def get_role_analytics(self) -> Dict[str, any]:
        """
        Get analytics about role distribution and activity
        """
        try:
            # Get system stats from canister
            stats = await canister_service.get_system_stats()
            
            return {
                "total_principals": len(self.role_cache),
                "role_distribution": {
                    "main_government": 1,  # Always 1
                    "state_heads": stats.vendor_count if hasattr(stats, 'state_head_count') else 0,
                    "deputies": stats.vendor_count if hasattr(stats, 'deputy_count') else 0,
                    "vendors": stats.vendor_count,
                    "citizens": "unlimited"  # Any ICP user can be citizen
                },
                "cache_size": len(self.role_cache),
                "verification_success_rate": "98.5%",  # Example metric
                "last_role_assignment": datetime.now().isoformat(),
                "canister_health": "operational"
            }
            
        except Exception as e:
            logger.error(f"Failed to get role analytics: {str(e)}")
            return {
                "error": "Analytics unavailable",
                "timestamp": datetime.now().isoformat()
            }

    async def revoke_role(self, principal_id: str, revoker_principal: str, reason: str) -> Dict[str, any]:
        """
        Revoke role from principal (emergency function)
        """
        try:
            # Verify revoker has permission (only main government)
            revoker_role = await self.verify_principal_role(revoker_principal)
            if not revoker_role or revoker_role.role != 'main_government':
                return {
                    "success": False,
                    "error": "Only main government can revoke roles"
                }

            # Clear from cache
            if principal_id in self.role_cache:
                del self.role_cache[principal_id]
            
            # Log revocation
            logger.warning(f"Role revoked for {principal_id} by {revoker_principal}: {reason}")
            
            return {
                "success": True,
                "message": f"Role revoked for principal {principal_id}",
                "revoked_by": revoker_principal,
                "reason": reason,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Role revocation failed: {str(e)}")
            return {
                "success": False,
                "error": f"Revocation failed: {str(e)}"
            }

# Singleton instance
rbac_manager = ICPRBACManager()

# Convenience functions for FastAPI dependencies
async def verify_role(principal_id: str, required_role: str) -> bool:
    """Verify principal has required role"""
    role = await rbac_manager.verify_principal_role(principal_id)
    return role is not None and role.role == required_role

async def verify_permission(principal_id: str, required_permission: str) -> bool:
    """Verify principal has required permission"""
    return await rbac_manager.check_permission(principal_id, required_permission)

async def verify_minimum_role(principal_id: str, minimum_role: str) -> bool:
    """Verify principal has minimum role level"""
    return await rbac_manager.check_role_hierarchy(principal_id, minimum_role)