import React, { useState, useEffect } from 'react';
import { Shield, Wallet, Key, Globe, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import iiAuth from '../../auth/internetIdentity';

interface ICPAuthDemoProps {
  onAuthSuccess?: (user: any) => void;
  showDemo?: boolean;
}

interface AuthStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  details?: string;
}

export function ICPAuthDemo({ onAuthSuccess, showDemo = true }: ICPAuthDemoProps) {
  const [authSteps, setAuthSteps] = useState<AuthStep[]>([
    {
      id: 'identity',
      title: 'Internet Identity Setup',
      description: 'Connect to ICP Internet Identity service',
      status: 'pending',
      details: 'Secure, anonymous authentication using WebAuthn'
    },
    {
      id: 'principal',
      title: 'Principal Generation',
      description: 'Generate unique cryptographic identity',
      status: 'pending',
      details: 'Your principal ID is derived from your authentication method'
    },
    {
      id: 'canister',
      title: 'Canister Authentication',
      description: 'Authenticate with CorruptGuard canister',
      status: 'pending',
      details: 'Verify role permissions on the blockchain'
    },
    {
      id: 'backend',
      title: 'Backend Integration',
      description: 'Connect to fraud detection API',
      status: 'pending',
      details: 'Sync with AI fraud detection system'
    }
  ]);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userPrincipal, setUserPrincipal] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('vendor');

  useEffect(() => {
    // Check if already authenticated
    if (iiAuth.authenticated) {
      setIsAuthenticated(true);
      setUserPrincipal(iiAuth.userPrincipal);
      markAllStepsCompleted();
    }
  }, []);

  const updateStepStatus = (stepId: string, status: AuthStep['status'], details?: string) => {
    setAuthSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, status, details: details || step.details }
        : step
    ));
  };

  const markAllStepsCompleted = () => {
    setAuthSteps(prev => prev.map(step => ({ ...step, status: 'completed' })));
  };

  const handleICPLogin = async () => {
    setIsLoading(true);
    
    try {
      // Step 1: Internet Identity
      updateStepStatus('identity', 'active');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Demo delay
      
      // Initialize II auth
      await iiAuth.init();
      updateStepStatus('identity', 'completed', 'Internet Identity initialized');
      
      // Step 2: Principal Generation
      updateStepStatus('principal', 'active');
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For demo, we'll simulate the II login
      const mockPrincipal = `demo-${selectedRole}-${Math.random().toString(36).substr(2, 8)}`;
      setUserPrincipal(mockPrincipal);
      updateStepStatus('principal', 'completed', `Principal: ${mockPrincipal.substring(0, 20)}...`);
      
      // Step 3: Canister Authentication  
      updateStepStatus('canister', 'active');
      await new Promise(resolve => setTimeout(resolve, 1200));
      updateStepStatus('canister', 'completed', 'Role verified on blockchain');
      
      // Step 4: Backend Integration
      updateStepStatus('backend', 'active');
      await new Promise(resolve => setTimeout(resolve, 600));
      updateStepStatus('backend', 'completed', 'Connected to fraud detection API');
      
      setIsAuthenticated(true);
      
      // Create mock user object
      const mockUser = {
        principal: mockPrincipal,
        role: selectedRole,
        authMethod: 'internet_identity',
        authenticated: true
      };
      
      onAuthSuccess?.(mockUser);
      
    } catch (error) {
      console.error('ICP Auth failed:', error);
      updateStepStatus('identity', 'error', 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role: string) => {
    setIsLoading(true);
    setSelectedRole(role);
    
    try {
      // Quick demo authentication
      const mockPrincipal = `demo-${role}-${Math.random().toString(36).substr(2, 8)}`;
      setUserPrincipal(mockPrincipal);
      setIsAuthenticated(true);
      markAllStepsCompleted();
      
      const mockUser = {
        principal: mockPrincipal,
        role: role,
        authMethod: 'demo',
        authenticated: true
      };
      
      onAuthSuccess?.(mockUser);
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await iiAuth.logout();
    setIsAuthenticated(false);
    setUserPrincipal(null);
    setAuthSteps(prev => prev.map(step => ({ ...step, status: 'pending' })));
  };

  if (isAuthenticated && userPrincipal) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-green-50 rounded-full">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Successfully Authenticated
          </h3>
          <div className="bg-slate-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-slate-600 mb-1">Principal ID:</p>
            <p className="font-mono text-sm text-slate-800 break-all">{userPrincipal}</p>
          </div>
          <div className="flex items-center justify-center space-x-2 text-green-600 mb-4">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">Secured by Internet Computer</span>
          </div>
          <button
            onClick={handleLogout}
            className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Authentication Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-blue-50 rounded-full">
            <Globe className="h-10 w-10 text-blue-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          ICP Authentication
        </h2>
        <p className="text-slate-600">
          Secure blockchain authentication for government transparency
        </p>
      </div>

      {/* Authentication Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Internet Identity */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Key className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Internet Identity</h3>
              <p className="text-sm text-slate-600">Official ICP authentication</p>
            </div>
          </div>
          
          <div className="space-y-3 mb-4">
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <Shield className="h-4 w-4" />
              <span>WebAuthn secure authentication</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <Wallet className="h-4 w-4" />
              <span>No passwords required</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <Zap className="h-4 w-4" />
              <span>Blockchain verified identity</span>
            </div>
          </div>

          {/* Role Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Select Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="vendor">Vendor/Contractor</option>
              <option value="government">Government Official</option>
              <option value="deputy">Deputy/Local Authority</option>
              <option value="citizen">Citizen Observer</option>
            </select>
          </div>

          <button
            onClick={handleICPLogin}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-3 rounded-lg font-medium transition-colors"
          >
            {isLoading ? 'Connecting...' : 'Login with Internet Identity'}
          </button>
        </div>

        {/* Demo Authentication */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Zap className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Demo Mode</h3>
              <p className="text-sm text-slate-600">Quick access for presentation</p>
            </div>
          </div>

          <div className="space-y-2">
            {['vendor', 'government', 'deputy', 'citizen'].map((role) => (
              <button
                key={role}
                onClick={() => handleDemoLogin(role)}
                disabled={isLoading}
                className="w-full text-left px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <span className="font-medium text-slate-900 capitalize">{role}</span>
                <span className="text-sm text-slate-600 block">
                  {role === 'vendor' && 'Submit claims & manage contracts'}
                  {role === 'government' && 'Create budgets & oversee system'}
                  {role === 'deputy' && 'Approve claims & manage projects'}
                  {role === 'citizen' && 'Monitor transparency & report issues'}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Authentication Steps */}
      {showDemo && (isLoading || authSteps.some(step => step.status !== 'pending')) && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Authentication Process</h3>
          <div className="space-y-3">
            {authSteps.map((step, index) => (
              <div key={step.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {step.status === 'completed' && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                  {step.status === 'active' && (
                    <div className="h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  )}
                  {step.status === 'error' && (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                  {step.status === 'pending' && (
                    <div className="h-5 w-5 border-2 border-slate-300 rounded-full" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${
                    step.status === 'completed' ? 'text-green-800' :
                    step.status === 'active' ? 'text-blue-800' :
                    step.status === 'error' ? 'text-red-800' :
                    'text-slate-600'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-sm text-slate-600">{step.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ICP Info */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <h4 className="font-semibold text-slate-900 mb-2">Why Internet Computer Authentication?</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
          <div>
            <strong>Decentralized Security:</strong> No single point of failure
          </div>
          <div>
            <strong>Anonymous & Private:</strong> No personal data stored
          </div>
          <div>
            <strong>Tamper Proof:</strong> Blockchain-verified identities
          </div>
          <div>
            <strong>Government Ready:</strong> Enterprise-grade security
          </div>
        </div>
      </div>
    </div>
  );
}