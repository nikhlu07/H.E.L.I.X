import { UniversalRole, RolePermission } from '../types';

// Valid universal roles
export const validUniversalRoles: UniversalRole[] = [
  'national_authority',
  'regional_administrator',
  'district_coordinator',
  'implementation_partner',
  'community_representative',
  'public_oversight'
];

// Role permissions configuration
export const rolePermissions: Record<UniversalRole, RolePermission[]> = {
  national_authority: [
    { name: 'view_all_contracts', description: 'View all contracts across all regions', scope: 'read' },
    { name: 'approve_major_contracts', description: 'Approve contracts above threshold', scope: 'write' },
    { name: 'audit_any_region', description: 'Initiate audits in any region', scope: 'admin' },
    { name: 'set_policy', description: 'Set national procurement policies', scope: 'admin' }
  ],
  regional_administrator: [
    { name: 'view_region_contracts', description: 'View contracts within assigned region', scope: 'read' },
    { name: 'approve_region_contracts', description: 'Approve contracts within region', scope: 'write' },
    { name: 'manage_vendors', description: 'Manage vendor registrations', scope: 'write' },
    { name: 'regional_reporting', description: 'Generate regional reports', scope: 'write' }
  ],
  district_coordinator: [
    { name: 'view_district_contracts', description: 'View contracts within district', scope: 'read' },
    { name: 'execute_contracts', description: 'Execute approved contracts', scope: 'write' },
    { name: 'monitor_deliveries', description: 'Monitor contract deliveries', scope: 'write' },
    { name: 'local_reporting', description: 'Generate local reports', scope: 'write' }
  ],
  implementation_partner: [
    { name: 'view_assigned_contracts', description: 'View contracts assigned to partner', scope: 'read' },
    { name: 'submit_delivery_reports', description: 'Submit delivery completion reports', scope: 'write' },
    { name: 'request_payments', description: 'Request payments for completed work', scope: 'write' },
    { name: 'update_project_status', description: 'Update project implementation status', scope: 'write' }
  ],
  community_representative: [
    { name: 'view_community_contracts', description: 'View contracts affecting community', scope: 'read' },
    { name: 'report_issues', description: 'Report implementation issues', scope: 'write' },
    { name: 'participate_meetings', description: 'Participate in community meetings', scope: 'write' },
    { name: 'monitor_quality', description: 'Monitor quality of delivered work', scope: 'read' }
  ],
  public_oversight: [
    { name: 'view_all_public_data', description: 'View all public contract data', scope: 'read' },
    { name: 'report_corruption', description: 'Report suspected corruption', scope: 'write' },
    { name: 'access_audit_reports', description: 'Access audit reports', scope: 'read' },
    { name: 'submit_rti_requests', description: 'Submit Right to Information requests', scope: 'write' }
  ]
};

// Universal role validator
export class UniversalRoleValidator {
  // Check if a role is a valid universal role
  static isValidUniversalRole(role: string): role is UniversalRole {
    return validUniversalRoles.includes(role as UniversalRole);
  }

  // Get permissions for a specific role
  static getRolePermissions(role: UniversalRole): RolePermission[] {
    return rolePermissions[role] || [];
  }

  // Get all valid universal roles
  static getValidRoles(): UniversalRole[] {
    return [...validUniversalRoles];
  }

  // Check if a role has a specific permission
  static hasPermission(role: UniversalRole, permissionName: string): boolean {
    const permissions = this.getRolePermissions(role);
    return permissions.some(perm => perm.name === permissionName);
  }

  // Get role display name
  static getRoleDisplayName(role: UniversalRole): string {
    const displayNames: Record<UniversalRole, string> = {
      national_authority: 'National Authority',
      regional_administrator: 'Regional Administrator',
      district_coordinator: 'District Coordinator',
      implementation_partner: 'Implementation Partner',
      community_representative: 'Community Representative',
      public_oversight: 'Public Oversight'
    };
    return displayNames[role];
  }
}

// Export default for convenience
export default UniversalRoleValidator;