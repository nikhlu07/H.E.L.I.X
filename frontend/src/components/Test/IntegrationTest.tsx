import React, { useState } from 'react';
import { CheckCircle, XCircle, Loader, AlertTriangle } from 'lucide-react';
import corruptGuardService from '../../services/corruptGuardService';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  details?: Record<string, unknown>;
}

export function IntegrationTest() {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [overallStatus, setOverallStatus] = useState<'pending' | 'success' | 'error'>('pending');

  const runTests = async () => {
    setIsRunning(true);
    setTests([]);
    setOverallStatus('pending');

    const testResults: TestResult[] = [];

    // Test 1: Backend Health Check
    testResults.push({ name: 'Backend Health Check', status: 'pending', message: 'Checking backend availability...' });
    setTests([...testResults]);

    try {
      const health = await corruptGuardService.getHealth();
      testResults[0] = {
        name: 'Backend Health Check',
        status: 'success',
        message: 'Backend is running and healthy',
        details: health
      };
    } catch (error) {
      testResults[0] = {
        name: 'Backend Health Check',
        status: 'error',
        message: 'Backend is not available',
        details: error
      };
    }
    setTests([...testResults]);

    // Test 2: Service Initialization
    testResults.push({ name: 'Service Initialization', status: 'pending', message: 'Initializing CorruptGuard service...' });
    setTests([...testResults]);

    try {
      await corruptGuardService.init();
      testResults[1] = {
        name: 'Service Initialization',
        status: 'success',
        message: 'Service initialized successfully'
      };
    } catch (error) {
      testResults[1] = {
        name: 'Service Initialization',
        status: 'error',
        message: 'Failed to initialize service',
        details: error
      };
    }
    setTests([...testResults]);

    // Test 3: Demo Authentication
    testResults.push({ name: 'Demo Authentication', status: 'pending', message: 'Testing demo login...' });
    setTests([...testResults]);

    try {
      const user = await corruptGuardService.loginWithDemo('main_government');
      testResults[2] = {
        name: 'Demo Authentication',
        status: 'success',
        message: 'Demo authentication successful',
        details: { role: user.role, isAuthenticated: user.isAuthenticated }
      };
    } catch (error) {
      testResults[2] = {
        name: 'Demo Authentication',
        status: 'error',
        message: 'Demo authentication failed',
        details: error
      };
    }
    setTests([...testResults]);

    // Test 4: Fraud Detection API
    testResults.push({ name: 'Fraud Detection API', status: 'pending', message: 'Testing fraud detection...' });
    setTests([...testResults]);

    try {
      const fraudData = {
        claim_id: 999,
        vendor_id: 'test_vendor',
        amount: 50000,
        budget_id: 1,
        allocation_id: 1,
        invoice_hash: 'test_hash_123',
        deputy_id: 'test_deputy',
        area: 'test_area'
      };
      
      const result = await corruptGuardService.detectFraud(fraudData);
      testResults[3] = {
        name: 'Fraud Detection API',
        status: 'success',
        message: 'Fraud detection working',
        details: { score: result.score, risk_level: result.risk_level }
      };
    } catch (error) {
      testResults[3] = {
        name: 'Fraud Detection API',
        status: 'error',
        message: 'Fraud detection failed',
        details: error
      };
    }
    setTests([...testResults]);

    // Test 5: ICP Claims API
    testResults.push({ name: 'ICP Claims API', status: 'pending', message: 'Testing ICP claims...' });
    setTests([...testResults]);

    try {
      const claims = await corruptGuardService.getClaims();
      testResults[4] = {
        name: 'ICP Claims API',
        status: 'success',
        message: `Retrieved ${claims.length} claims`,
        details: { claimCount: claims.length }
      };
    } catch (error) {
      testResults[4] = {
        name: 'ICP Claims API',
        status: 'error',
        message: 'Failed to retrieve claims',
        details: error
      };
    }
    setTests([...testResults]);

    // Test 6: System Stats API
    testResults.push({ name: 'System Stats API', status: 'pending', message: 'Testing system statistics...' });
    setTests([...testResults]);

    try {
      const stats = await corruptGuardService.getSystemStats();
      testResults[5] = {
        name: 'System Stats API',
        status: 'success',
        message: 'System statistics retrieved',
        details: stats
      };
    } catch (error) {
      testResults[5] = {
        name: 'System Stats API',
        status: 'error',
        message: 'Failed to retrieve system stats',
        details: error
      };
    }
    setTests([...testResults]);

    // Calculate overall status
    const successCount = testResults.filter(t => t.status === 'success').length;
    const errorCount = testResults.filter(t => t.status === 'error').length;
    
    if (errorCount === 0) {
      setOverallStatus('success');
    } else if (successCount > 0) {
      setOverallStatus('error');
    } else {
      setOverallStatus('error');
    }

    setIsRunning(false);
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">CorruptGuard Integration Test</h1>
          <p className="text-gray-600">Testing backend connectivity and ICP integration</p>
        </div>

        {/* Overall Status */}
        <div className={`mb-6 p-4 rounded-lg border ${getStatusColor(overallStatus)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getStatusIcon(overallStatus)}
              <div>
                <h3 className="font-semibold text-gray-900">
                  Overall Status: {overallStatus.toUpperCase()}
                </h3>
                <p className="text-sm text-gray-600">
                  {tests.length > 0 && (
                    `${tests.filter(t => t.status === 'success').length}/${tests.length} tests passed`
                  )}
                </p>
              </div>
            </div>
            <button
              onClick={runTests}
              disabled={isRunning}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isRunning
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isRunning ? 'Running Tests...' : 'Run Integration Tests'}
            </button>
          </div>
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

        {/* Instructions */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">Test Instructions</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Make sure the backend server is running on port 8000</li>
            <li>• Ensure all dependencies are installed</li>
            <li>• Check that the frontend can connect to the backend</li>
            <li>• Verify ICP integration is properly configured</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
