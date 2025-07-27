/**
 * CorruptGuard Authentication Integration Examples
 * Shows how to use authentication in React components
 */

import React, { useState, useEffect } from 'react';
import { useAuth, withAuthProtection } from '../components/AuthProvider';

// ===== BASIC AUTHENTICATION USAGE =====

/**
 * Example: Login Component
 */
export const LoginExample = () => {
  const auth = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await auth.login();
      console.log('Login successful!');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role) => {
    setLoading(true);
    try {
      await auth.loginDemo(`demo-${role}-${Date.now()}`, role);
      console.log(`Demo login as ${role} successful!`);
    } catch (error) {
      console.error('Demo login failed:', error);
      alert('Demo login failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (auth.isAuthenticated) {
    return (
      <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          ✅ Authenticated as {auth.user?.role}
        </h3>
        <p className="text-green-700 mb-4">
          Principal: {auth.principal}
        </p>
        <button
          onClick={auth.logout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Authentication Example</h3>
      
      <div className="space-y-3">
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login with Internet Identity'}
        </button>

        {process.env.NODE_ENV === 'development' && (
          <div className="border-t pt-3">
            <p className="text-sm text-gray-600 mb-2">Demo Login Options:</p>
            <div className="grid grid-cols-2 gap-2">
              {['main_government', 'state_head', 'deputy', 'vendor', 'citizen'].map(role => (
                <button
                  key={role}
                  onClick={() => handleDemoLogin(role)}
                  disabled={loading}
                  className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
                >
                  {role.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Example: User Profile Display
 */
export const UserProfileExample = () => {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    return <div>Please log in to view profile</div>;
  }

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">User Profile</h3>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="font-medium">Principal:</span>
          <span className="font-mono text-sm">{auth.principal}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="font-medium">Role:</span>
          <span className="capitalize">{auth.role?.replace('_', ' ')}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="font-medium">Permissions:</span>
          <span className="text-sm">{auth.permissions.length} permissions</span>
        </div>
        
        <div className="mt-4">
          <h4 className="font-medium mb-2">Available Permissions:</h4>
          <div className="flex flex-wrap gap-1">
            {auth.permissions.map(permission => (
              <span
                key={permission}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
              >
                {permission}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Example: Permission-based UI
 */
export const PermissionBasedUIExample = () => {
  const auth = useAuth();

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Permission-based UI</h3>
      
      <div className="space-y-3">
        {/* Show different content based on permissions */}
        {auth.hasPermission('create_budget') && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
            <span className="text-blue-800">🏛️ You can create budgets</span>
          </div>
        )}
        
        {auth.hasPermission('submit_claims') && (
          <div className="p-3 bg-green-50 border border-green-200 rounded">
            <span className="text-green-800">📄 You can submit claims</span>
          </div>
        )}
        
        {auth.hasPermission('submit_challenges') && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
            <span className="text-yellow-800">⚖️ You can submit challenges</span>
          </div>
        )}
        
        {auth.hasRole('main_government') && (
          <div className="p-3 bg-purple-50 border border-purple-200 rounded">
            <span className="text-purple-800">👑 Main Government Access</span>
          </div>
        )}
        
        {auth.isGovernmentUser() && (
          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded">
            <span className="text-indigo-800">🏛️ Government User Access</span>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Example: API Request with Authentication
 */
export const ApiRequestExample = () => {
  const auth = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProtectedData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Example: Fetch user's claims
      const response = await auth.apiRequest('/vendor/claims');
      
      if (response.ok) {
        const result = await response.json();
        setData(result.data);
      } else {
        throw new Error(`API request failed: ${response.statusText}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitExampleClaim = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await auth.apiRequest('/vendor/claims/submit', {
        method: 'POST',
        body: JSON.stringify({
          budget_id: 1,
          allocation_id: 0,
          amount: 50000,
          description: 'Example claim submission',
          invoice_data: 'example-invoice-123'
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        alert('Claim submitted successfully!');
        console.log('Claim result:', result);
      } else {
        throw new Error(`Failed to submit claim: ${response.statusText}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Authenticated API Requests</h3>
      
      <div className="space-y-3 mb-4">
        <button
          onClick={fetchProtectedData}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Fetch Protected Data'}
        </button>
        
        {auth.hasPermission('submit_claims') && (
          <button
            onClick={submitExampleClaim}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Example Claim'}
          </button>
        )}
      </div>
      
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-800">
          Error: {error}
        </div>
      )}
      
      {data && (
        <div className="p-3 bg-gray-50 border border-gray-200 rounded">
          <h4 className="font-medium mb-2">API Response:</h4>
          <pre className="text-sm overflow-x-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

// ===== PROTECTED ROUTE EXAMPLES =====

/**
 * Example: Main Government Only Component
 */
const MainGovernmentDashboard = () => {
  const auth = useAuth();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Main Government Dashboard</h2>
      <p className="text-gray-600 mb-4">
        Welcome, {auth.user?.name || 'Main Government'}! 
        This dashboard is only accessible to main government users.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded">
          <h3 className="font-semibold">Budget Management</h3>
          <p className="text-sm text-gray-600">Create and manage budgets</p>
        </div>
        
        <div className="p-4 bg-green-50 border border-green-200 rounded">
          <h3 className="font-semibold">Role Management</h3>
          <p className="text-sm text-gray-600">Assign and manage user roles</p>
        </div>
        
        <div className="p-4 bg-purple-50 border border-purple-200 rounded">
          <h3 className="font-semibold">System Administration</h3>
          <p className="text-sm text-gray-600">System-wide settings and controls</p>
        </div>
      </div>
    </div>
  );
};

// Protected version with HOC
export const ProtectedMainGovernmentDashboard = withAuthProtection(
  MainGovernmentDashboard,
  { requiredRoles: ['main_government'] }
);

/**
 * Example: Multi-role Government Component
 */
const GovernmentDashboard = () => {
  const auth = useAuth();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Government Dashboard</h2>
      <p className="text-gray-600 mb-4">
        Welcome, {auth.user?.name || auth.role}! 
        Role: {auth.role?.replace('_', ' ')}
      </p>
      
      <div className="space-y-4">
        {auth.hasRole('main_government') && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded">
            <h3 className="font-semibold">Main Government Features</h3>
            <p className="text-sm text-gray-600">Full system access and control</p>
          </div>
        )}
        
        {auth.hasRole('state_head') && (
          <div className="p-4 bg-green-50 border border-green-200 rounded">
            <h3 className="font-semibold">State Head Features</h3>
            <p className="text-sm text-gray-600">Regional management and oversight</p>
          </div>
        )}
        
        {auth.hasRole('deputy') && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
            <h3 className="font-semibold">Deputy Features</h3>
            <p className="text-sm text-gray-600">Local project and vendor management</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Protected version for any government role
export const ProtectedGovernmentDashboard = withAuthProtection(
  GovernmentDashboard,
  { requiredRoles: ['main_government', 'state_head', 'deputy'] }
);

/**
 * Example: Permission-based Component
 */
const BudgetManagement = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Budget Management</h2>
      <p className="text-gray-600 mb-4">
        Manage government budgets and allocations.
      </p>
      
      <div className="space-y-4">
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Create New Budget
        </button>
        
        <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Allocate Budget
        </button>
      </div>
    </div>
  );
};

// Protected version requiring specific permission
export const ProtectedBudgetManagement = withAuthProtection(
  BudgetManagement,
  { requiredPermissions: ['create_budget'] }
);

// ===== USAGE IN APP COMPONENT =====

/**
 * Example: How to use in main App component
 */
export const AppWithAuthentication = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          CorruptGuard Authentication Examples
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LoginExample />
          <UserProfileExample />
          <PermissionBasedUIExample />
          <ApiRequestExample />
        </div>
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Protected Routes Examples</h2>
          <div className="space-y-4">
            <ProtectedMainGovernmentDashboard />
            <ProtectedGovernmentDashboard />
            <ProtectedBudgetManagement />
          </div>
        </div>
      </div>
    </div>
  );
};

// ===== CUSTOM HOOKS EXAMPLES =====

/**
 * Custom hook for role-specific data fetching
 */
export const useRoleBasedData = () => {
  const auth = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!auth.isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        let endpoint;
        
        // Fetch different data based on role
        switch (auth.role) {
          case 'main_government':
            endpoint = '/government/system/stats';
            break;
          case 'state_head':
            endpoint = '/government/budgets';
            break;
          case 'deputy':
            endpoint = '/deputy/projects';
            break;
          case 'vendor':
            endpoint = '/vendor/claims';
            break;
          case 'citizen':
            endpoint = '/citizen/spending/overview';
            break;
          default:
            endpoint = '/citizen/spending/overview';
        }

        const response = await auth.apiRequest(endpoint);
        
        if (response.ok) {
          const result = await response.json();
          setData(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch role-based data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [auth.isAuthenticated, auth.role]);

  return { data, loading };
};

/**
 * Custom hook for permission checking
 */
export const usePermissions = (requiredPermissions = []) => {
  const auth = useAuth();

  const hasAllPermissions = requiredPermissions.every(
    permission => auth.hasPermission(permission)
  );

  const hasAnyPermission = requiredPermissions.some(
    permission => auth.hasPermission(permission)
  );

  return {
    hasAllPermissions,
    hasAnyPermission,
    userPermissions: auth.permissions,
    missingPermissions: requiredPermissions.filter(
      permission => !auth.hasPermission(permission)
    )
  };
};

export default {
  LoginExample,
  UserProfileExample,
  PermissionBasedUIExample,
  ApiRequestExample,
  ProtectedMainGovernmentDashboard,
  ProtectedGovernmentDashboard,
  ProtectedBudgetManagement,
  AppWithAuthentication,
  useRoleBasedData,
  usePermissions
};