import React, { useState } from 'react';
import { CheckCircle, XCircle, Loader, AlertTriangle, User, Shield } from 'lucide-react';
import corruptGuardService from '../../services/corruptGuardService';

interface AuthTestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  details?: any;
}

export function AuthTest() {
  const [tests, setTests] = useState<AuthTestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const runAuthTests = async () => {
    setIsRunning(true);
    setTests([]);
    setCurrentUser(null);

    const testResults: AuthTestResult[] = [];

    // Test 1: Service Initialization
    testResults.push({ 
      name: 'Service Initialization', 
      status: 'pending', 
      message: 'Initializing CorruptGuard service...' 
    });
    setTests([...testResults]);

    try {
      await corruptGuardService.init();
      testResults[0] = {
        name: 'Service Initialization',
        status: 'success',
        message: 'Service initialized successfully'
      };
    } catch (error) {
      testResults[0] = {
        name: 'Service Initialization',
        status: 'error',
        message: 'Failed to initialize service',
        details: error
      };
    }
    setTests([...testResults]);

    // Test 2: Demo Authentication
    testResults.push({ 
      name: 'Demo Authentication', 
      status: 'pending', 
      message: 'Testing demo login with main_government role...' 
    });
    setTests([...testResults]);

    try {
      const user = await corruptGuardService.loginWithDemo('main_government');
      testResults[1] = {
        name: 'Demo Authentication',
        status: 'success',
        message: 'Demo authentication successful',
        details: {
          role: user.role,
          name: user.name,
          isAuthenticated: user.isAuthenticated,
          hasAccessToken: !!user.accessToken
        }
      };
      setCurrentUser(user);
    } catch (error) {
      testResults[1] = {
        name: 'Demo Authentication',
        status: 'error',
        message: 'Demo authentication failed',
        details: error
      };
    }
    setTests([...testResults]);

    // Test 3: Authentication State Check
    testResults.push({ 
      name: 'Authentication State', 
      status: 'pending', 
      message: 'Checking authentication state...' 
    });
    setTests([...testResults]);

    try {
      const isAuth = corruptGuardService.isAuthenticated();
      const token = corruptGuardService.getAccessToken();
      const role = corruptGuardService.getUserRole();
      
      testResults[2] = {
        name: 'Authentication State',
        status: isAuth ? 'success' : 'error',
        message: isAuth ? 'User is authenticated' : 'User is not authenticated',
        details: {
          isAuthenticated: isAuth,
          hasToken: !!token,
          userRole: role,
          tokenLength: token ? token.length : 0
        }
      };
    } catch (error) {
      testResults[2] = {
        name: 'Authentication State',
        status: 'error',
        message: 'Failed to check authentication state',
        details: error
      };
    }
    setTests([...testResults]);

    // Test 4: Backend Profile Check
    testResults.push({ 
      name: 'Backend Profile Check', 
      status: 'pending', 
      message: 'Verifying user profile with backend...' 
    });
    setTests([...testResults]);

    try {
      const user = await corruptGuardService.getCurrentUser();
      testResults[3] = {
        name: 'Backend Profile Check',
        status: user ? 'success' : 'error',
        message: user ? 'Backend profile retrieved successfully' : 'Failed to get backend profile',
        details: user ? {
          role: user.role,
          name: user.name,
          isAuthenticated: user.isAuthenticated
        } : null
      };
    } catch (error) {
      testResults[3] = {
        name: 'Backend Profile Check',
        status: 'error',
        message: 'Backend profile check failed',
        details: error
      };
    }
    setTests([...testResults]);

    // Test 5: Protected API Call
    testResults.push({ 
      name: 'Protected API Call', 
      status: 'pending', 
      message: 'Testing protected API endpoint...' 
    });
    setTests([...testResults]);

    try {
      const stats = await corruptGuardService.getSystemStats();
      testResults[4] = {
        name: 'Protected API Call',
        status: 'success',
        message: 'Protected API call successful',
        details: {
          totalBudget: stats.total_budget,
          activeClaims: stats.active_claims,
          flaggedClaims: stats.flagged_claims
        }
      };
    } catch (error) {
      testResults[4] = {
        name: 'Protected API Call',
        status: 'error',
        message: 'Protected API call failed',
        details: error
      };
    }
    setTests([...testResults]);

    setIsRunning(false);
  };

  const clearAuth = async () => {
    try {
      await corruptGuardService.logout();
      setCurrentUser(null);
      setTests([]);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <Loader className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'pending':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Authentication Test</h1>
          <p className="text-gray-600">Testing if authentication is really happening</p>
        </div>

        {/* Current User Status */}
        {currentUser && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-3">
              <User className="h-6 w-6 text-blue-600" />
              <div>
                <h3 className="font-semibold text-blue-900">Current User</h3>
                <p className="text-sm text-blue-700">
                  {currentUser.name} ({currentUser.role}) - {currentUser.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
                </p>
                {currentUser.accessToken && (
                  <p className="text-xs text-blue-600 mt-1">
                    Token: {currentUser.accessToken.substring(0, 20)}...
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={runAuthTests}
            disabled={isRunning}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              isRunning
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isRunning ? 'Running Tests...' : 'Run Authentication Tests'}
          </button>
          
          <button
            onClick={clearAuth}
            className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Clear Authentication
          </button>
        </div>

        {/* Test Results */}
        <div className="space-y-4">
          {tests.map((test, index) => (
            <div key={index} className={`p-4 rounded-lg border ${getStatusColor(test.status)}`}>
              <div className="flex items-start space-x-3">
                {getStatusIcon(test.status)}
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{test.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{test.message}</p>
                  {test.details && (
                    <details className="mt-2">
                      <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                        View Details
                      </summary>
                      <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                        {JSON.stringify(test.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Authentication Status Summary */}
        {tests.length > 0 && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Authentication Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Tests Passed:</span>
                <span className="ml-2 text-green-600">
                  {tests.filter(t => t.status === 'success').length}
                </span>
              </div>
              <div>
                <span className="font-medium">Tests Failed:</span>
                <span className="ml-2 text-red-600">
                  {tests.filter(t => t.status === 'error').length}
                </span>
              </div>
              <div>
                <span className="font-medium">Authentication Working:</span>
                <span className="ml-2 text-blue-600">
                  {tests.filter(t => t.status === 'success').length >= 3 ? 'Yes' : 'No'}
                </span>
              </div>
              <div>
                <span className="font-medium">Backend Connected:</span>
                <span className="ml-2 text-blue-600">
                  {tests.some(t => t.name === 'Protected API Call' && t.status === 'success') ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h3 className="font-semibold text-yellow-900 mb-2">What This Test Does</h3>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• <strong>Service Init:</strong> Initializes the CorruptGuard service</li>
            <li>• <strong>Demo Auth:</strong> Attempts demo login with main_government role</li>
            <li>• <strong>Auth State:</strong> Checks if user is properly authenticated</li>
            <li>• <strong>Profile Check:</strong> Verifies backend can retrieve user profile</li>
            <li>• <strong>Protected API:</strong> Tests if authenticated API calls work</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
