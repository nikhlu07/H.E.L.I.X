import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Shield, Lock, AlertTriangle } from 'lucide-react';

interface RoleGateProps {
  allowedRoles?: string[];
  requiredPermissions?: string[];
  requireAll?: boolean; // true = must have ALL permissions, false = must have ANY
  fallback?: React.ReactNode;
  showFallback?: boolean;
  children: React.ReactNode;
}

interface RoleDisplayProps {
  principal: string;
  role: string;
  permissions: string[];
  canisterVerified?: boolean;
}

export function RoleGate({
  allowedRoles = [],
  requiredPermissions = [],
  requireAll = false,
  fallback,
  showFallback = true,
  children
}: RoleGateProps) {
  const { user, hasRole, hasPermission } = useAuth();

  // Check if user is authenticated
  if (!user) {
    return showFallback ? (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-amber-800">
          <Lock className="h-5 w-5" />
          <span className="font-medium">Authentication Required</span>
        </div>
        <p className="text-sm text-amber-700 mt-1">
          Please log in to access this feature.
        </p>
      </div>
    ) : null;
  }

  // Check role requirements
  const hasRequiredRole = allowedRoles.length === 0 || allowedRoles.some(role => hasRole(role));

  // Check permission requirements
  let hasRequiredPermissions = true;
  if (requiredPermissions.length > 0) {
    if (requireAll) {
      hasRequiredPermissions = requiredPermissions.every(permission => hasPermission(permission));
    } else {
      hasRequiredPermissions = requiredPermissions.some(permission => hasPermission(permission));
    }
  }

  // If user has access, render children
  if (hasRequiredRole && hasRequiredPermissions) {
    return <>{children}</>;
  }

  // If fallback provided, use it
  if (fallback) {
    return <>{fallback}</>;
  }

  // Default access denied message
  if (!showFallback) {
    return null;
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-center space-x-2 text-red-800">
        <Shield className="h-5 w-5" />
        <span className="font-medium">Access Denied</span>
      </div>
      <div className="text-sm text-red-700 mt-1">
        <p>You don't have permission to access this feature.</p>
        <div className="mt-2 space-y-1">
          {allowedRoles.length > 0 && (
            <p>Required role: {allowedRoles.join(' or ')}</p>
          )}
          {requiredPermissions.length > 0 && (
            <p>Required permission: {requiredPermissions.join(requireAll ? ' and ' : ' or ')}</p>
          )}
          <p>Your role: {user.role}</p>
        </div>
      </div>
    </div>
  );
}

export function RoleDisplay({ principal, role, permissions, canisterVerified = false }: RoleDisplayProps) {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'main_government': return 'bg-purple-100 text-purple-800';
      case 'state_head': return 'bg-blue-100 text-blue-800';
      case 'deputy': return 'bg-green-100 text-green-800';
      case 'vendor': return 'bg-orange-100 text-orange-800';
      case 'citizen': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatRole = (role: string) => {
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
      {/* Principal ID */}
      <div>
        <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          Principal ID
        </label>
        <div className="font-mono text-sm text-slate-800 break-all bg-slate-50 p-2 rounded mt-1">
          {principal}
        </div>
      </div>

      {/* Role */}
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Role
          </label>
          <div className="mt-1">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(role)}`}>
              {formatRole(role)}
            </span>
          </div>
        </div>
        
        {/* Canister Verification */}
        <div className="flex items-center space-x-1">
          <Shield className={`h-4 w-4 ${canisterVerified ? 'text-green-600' : 'text-gray-400'}`} />
          <span className={`text-xs font-medium ${canisterVerified ? 'text-green-600' : 'text-gray-500'}`}>
            {canisterVerified ? 'Verified' : 'Unverified'}
          </span>
        </div>
      </div>

      {/* Permissions */}
      <div>
        <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          Permissions ({permissions.length})
        </label>
        <div className="mt-2 flex flex-wrap gap-1">
          {permissions.map((permission) => (
            <span
              key={permission}
              className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-700"
            >
              {permission.replace('_', ' ')}
            </span>
          ))}
        </div>
      </div>

      {/* ICP Integration Status */}
      <div className="pt-2 border-t border-slate-200">
        <div className="flex items-center space-x-2 text-xs text-slate-600">
          <div className={`w-2 h-2 rounded-full ${canisterVerified ? 'bg-green-500' : 'bg-gray-400'}`}></div>
          <span>
            {canisterVerified ? 'Blockchain verified identity' : 'Pending blockchain verification'}
          </span>
        </div>
      </div>
    </div>
  );
}

// Convenience components for specific roles
export const GovernmentOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RoleGate allowedRoles={['main_government']}>{children}</RoleGate>
);

export const StateHeadOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RoleGate allowedRoles={['main_government', 'state_head']}>{children}</RoleGate>
);

export const DeputyOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RoleGate allowedRoles={['main_government', 'state_head', 'deputy']}>{children}</RoleGate>
);

export const VendorOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RoleGate allowedRoles={['vendor']}>{children}</RoleGate>
);

export const CitizenOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RoleGate allowedRoles={['citizen']}>{children}</RoleGate>
);

// Permission-based gates
export const BudgetControlOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RoleGate requiredPermissions={['budget_control']}>{children}</RoleGate>
);

export const FraudOversightOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RoleGate requiredPermissions={['fraud_oversight']}>{children}</RoleGate>
);

export const ClaimSubmissionOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RoleGate requiredPermissions={['claim_submission']}>{children}</RoleGate>
);

// Role hierarchy checker
export function RoleHierarchy() {
  const { user } = useAuth();
  
  if (!user) return null;

  const roleHierarchy = [
    { role: 'main_government', level: 5, color: 'text-purple-600', desc: 'Supreme Authority' },
    { role: 'state_head', level: 4, color: 'text-blue-600', desc: 'Regional Authority' },
    { role: 'deputy', level: 3, color: 'text-green-600', desc: 'Local Authority' },
    { role: 'vendor', level: 2, color: 'text-orange-600', desc: 'Service Provider' },
    { role: 'citizen', level: 1, color: 'text-gray-600', desc: 'Public Observer' }
  ];

  const currentRole = roleHierarchy.find(r => r.role === user.role);
  const userLevel = currentRole?.level || 0;

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4">
      <h3 className="font-semibold text-slate-900 mb-3">Government Hierarchy</h3>
      <div className="space-y-2">
        {roleHierarchy.map((roleInfo) => (
          <div
            key={roleInfo.role}
            className={`flex items-center space-x-3 p-2 rounded-lg ${
              roleInfo.role === user.role ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
              roleInfo.level <= userLevel ? 'bg-green-500' : 'bg-gray-400'
            }`}>
              {roleInfo.level}
            </div>
            <div className="flex-1">
              <div className={`font-medium ${roleInfo.color}`}>
                {roleInfo.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </div>
              <div className="text-sm text-slate-600">{roleInfo.desc}</div>
            </div>
            {roleInfo.role === user.role && (
              <div className="text-blue-600">
                <span className="text-xs font-medium">Your Role</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Real-time permission checker
export function PermissionChecker({ permission, children }: { permission: string; children: React.ReactNode }) {
  const { hasPermission } = useAuth();
  
  return hasPermission(permission) ? <>{children}</> : null;
}

// Demo component showing RBAC in action
export function RBACDemo() {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-yellow-800">
          <AlertTriangle className="h-5 w-5" />
          <span className="font-medium">RBAC Demo</span>
        </div>
        <p className="text-sm text-yellow-700 mt-1">
          Please log in to see role-based access control in action.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current User Role Display */}
      <RoleDisplay
        principal={user.principal_id}
        role={user.role}
        permissions={user.permissions || []}
        canisterVerified={true}
      />

      {/* Role Hierarchy */}
      <RoleHierarchy />

      {/* Permission Gates Demo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GovernmentOnly>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-medium text-purple-800">Government Only Feature</h4>
            <p className="text-sm text-purple-700">Budget creation and system administration</p>
          </div>
        </GovernmentOnly>

        <VendorOnly>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 className="font-medium text-orange-800">Vendor Only Feature</h4>
            <p className="text-sm text-orange-700">Claim submission and supplier payments</p>
          </div>
        </VendorOnly>

        <StateHeadOnly>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800">State Head Feature</h4>
            <p className="text-sm text-blue-700">Budget allocation and deputy management</p>
          </div>
        </StateHeadOnly>

        <CitizenOnly>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-800">Citizen Feature</h4>
            <p className="text-sm text-green-700">Transparency access and corruption reporting</p>
          </div>
        </CitizenOnly>
      </div>

      {/* Permission-based features */}
      <div className="bg-slate-50 rounded-lg p-4">
        <h4 className="font-medium text-slate-900 mb-3">Permission-Based Features</h4>
        <div className="space-y-2">
          <PermissionChecker permission="budget_control">
            <div className="text-sm text-green-700">✅ Budget Control Access</div>
          </PermissionChecker>
          
          <PermissionChecker permission="fraud_oversight">
            <div className="text-sm text-green-700">✅ Fraud Oversight Access</div>
          </PermissionChecker>
          
          <PermissionChecker permission="claim_submission">
            <div className="text-sm text-green-700">✅ Claim Submission Access</div>
          </PermissionChecker>
          
          <PermissionChecker permission="corruption_reporting">
            <div className="text-sm text-green-700">✅ Corruption Reporting Access</div>
          </PermissionChecker>
        </div>
      </div>
    </div>
  );
}