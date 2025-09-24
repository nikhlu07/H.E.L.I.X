import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Loader } from 'lucide-react';
import { icpCanisterService } from '../../services/icpCanisterService';

export function ICPConnectionTest() {
  const [connectionStatus, setConnectionStatus] = useState<'loading' | 'connected' | 'error' | 'not_tested'>('not_tested');
  const [canisterId, setCanisterId] = useState<string>('');
  const [host, setHost] = useState<string>('');
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setCanisterId(process.env.REACT_APP_CANISTER_ID || 'Not set');
    setHost(process.env.REACT_APP_IC_HOST || 'Not set');
  }, []);

  const testConnection = async () => {
    setConnectionStatus('loading');
    setError('');
    
    try {
      // Initialize the service
      await icpCanisterService.init();
      
      // Test by getting system stats
      const systemStats = await icpCanisterService.getSystemStats();
      setStats(systemStats);
      setConnectionStatus('connected');
    } catch (err: unknown) {
      setError((err as Error).message || 'Unknown error');
      setConnectionStatus('error');
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'loading':
        return <Loader className="h-5 w-5 text-blue-600 animate-spin" />;
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'loading':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-yellow-200 bg-yellow-50';
    }
  };

  return (
    <div className={`border rounded-lg p-6 ${getStatusColor()}`}>
      <div className="flex items-center space-x-3 mb-4">
        {getStatusIcon()}
        <h3 className="text-lg font-semibold text-gray-900">
          ICP Canister Connection Test
        </h3>
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <span className="text-sm font-medium text-gray-600">Canister ID:</span>
          <div className="font-mono text-sm text-gray-800 break-all bg-white p-2 rounded mt-1">
            {canisterId}
          </div>
        </div>
        
        <div>
          <span className="text-sm font-medium text-gray-600">Host:</span>
          <div className="font-mono text-sm text-gray-800 bg-white p-2 rounded mt-1">
            {host}
          </div>
        </div>
      </div>

      {connectionStatus === 'connected' && stats && (
        <div className="bg-white rounded-lg p-4 mb-4">
          <h4 className="font-medium text-gray-900 mb-2">System Stats from Canister:</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Total Budget:</span>
              <div className="font-semibold">{stats.totalBudget?.toString() || '0'}</div>
            </div>
            <div>
              <span className="text-gray-600">Active Claims:</span>
              <div className="font-semibold">{stats.activeClaims?.toString() || '0'}</div>
            </div>
            <div>
              <span className="text-gray-600">Flagged Claims:</span>
              <div className="font-semibold">{stats.flaggedClaims?.toString() || '0'}</div>
            </div>
            <div>
              <span className="text-gray-600">Vendor Count:</span>
              <div className="font-semibold">{stats.vendorCount?.toString() || '0'}</div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-300 rounded-lg p-3 mb-4">
          <div className="text-sm text-red-800">
            <strong>Error:</strong> {error}
          </div>
        </div>
      )}

      <button
        onClick={testConnection}
        disabled={connectionStatus === 'loading'}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg font-medium transition-colors"
      >
        {connectionStatus === 'loading' ? 'Testing...' : 'Test Connection'}
      </button>

      {connectionStatus === 'error' && (
        <div className="mt-4 text-sm text-gray-600">
          <p><strong>Troubleshooting:</strong></p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Make sure DFX is running: <code className="bg-gray-200 px-1 rounded">dfx start</code></li>
            <li>Deploy the canister: <code className="bg-gray-200 px-1 rounded">dfx deploy</code></li>
            <li>Check canister ID matches your deployed canister</li>
            <li>Verify the host URL is correct</li>
          </ul>
        </div>
      )}
    </div>
  );
}