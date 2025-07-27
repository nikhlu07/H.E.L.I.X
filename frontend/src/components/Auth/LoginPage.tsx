// frontend/src/components/Auth/LoginPage.tsx - UPDATED
import React, { useState, useEffect } from 'react';
import { Shield, Users, Building, Briefcase, Package, Eye } from 'lucide-react';

interface LoginPageProps {
  onLogin: (role: string) => void;
  onBackToLanding?: () => void;
}

const roleConfig = {
  'main_government': {
    title: 'Main Government',
    description: 'Central Authority & Budget Control',
    icon: Building,
    colors: 'from-blue-700 to-blue-800',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-900',
    borderColor: 'border-blue-200 hover:border-blue-300',
    badge: '🏛️',
    permissions: ['Budget Control', 'Role Management', 'Fraud Oversight', 'System Administration']
  },
  'state_head': {
    title: 'State Head',
    description: 'State Level Management',
    icon: Shield,
    colors: 'from-emerald-600 to-emerald-700',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-900',
    borderColor: 'border-emerald-200 hover:border-emerald-300',
    badge: '🏆',
    permissions: ['Budget Allocation', 'Deputy Management', 'Regional Oversight']
  },
  'deputy': {
    title: 'Deputy',
    description: 'District Level Execution',
    icon: Users,
    colors: 'from-orange-600 to-orange-700',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-900',
    borderColor: 'border-orange-200 hover:border-orange-300',
    badge: '👨‍💼',
    permissions: ['Vendor Selection', 'Project Management', 'Claim Review']
  },
  'vendor': {
    title: 'Vendor',
    description: 'Main Contractors',
    icon: Briefcase,
    colors: 'from-purple-600 to-purple-700',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-900',
    borderColor: 'border-purple-200 hover:border-purple-300',
    badge: '🏗️',
    permissions: ['Claim Submission', 'Payment Tracking', 'Supplier Management']
  },
  'sub_supplier': {
    title: 'Sub-Supplier',
    description: 'Material Suppliers & Services',
    icon: Package,
    colors: 'from-teal-600 to-teal-700',
    bgColor: 'bg-teal-50',
    textColor: 'text-teal-900',
    borderColor: 'border-teal-200 hover:border-teal-300',
    badge: '📦',
    permissions: ['Delivery Submission', 'Quality Assurance', 'Vendor Coordination']
  },
  'citizen': {
    title: 'Citizen',
    description: 'Community Oversight',
    icon: Eye,
    colors: 'from-slate-600 to-slate-700',
    bgColor: 'bg-slate-50',
    textColor: 'text-slate-900',
    borderColor: 'border-slate-200 hover:border-slate-300',
    badge: '👩‍💻',
    permissions: ['Transparency Access', 'Corruption Reporting', 'Community Verification']
  }
};

type UserRole = keyof typeof roleConfig;

export function LoginPage({ onLogin }: LoginPageProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [authMethod, setAuthMethod] = useState<'internet_identity' | 'demo'>('demo');
  const [error, setError] = useState<string | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Only initialize auth service if Internet Identity is needed
        if (authMethod === 'internet_identity') {
          const { authService } = await import('../../services/authService');
          await authService.init();
          setAuthInitialized(true);
          
          // Check if user is already authenticated
          if (authService.isAuthenticated()) {
            const user = authService.getCurrentUser();
            if (user) {
              onLogin(user.role);
            }
          }
        } else {
          setAuthInitialized(true);
        }
      } catch (error) {
        console.error('Failed to initialize auth service:', error);
        setError('Failed to initialize authentication');
      }
    };

    initAuth();
  }, [onLogin, authMethod]);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleConnect = async () => {
    if (!selectedRole && authMethod === 'demo') {
      setError('Please select a role for demo mode');
      return;
    }

    if (!authInitialized && authMethod === 'internet_identity') {
      setError('Authentication service is still initializing...');
      return;
    }

    setIsConnecting(true);
    setError(null);
    
    try {
      if (authMethod === 'internet_identity') {
        console.log('Connecting with Internet Identity...');
        const { authService } = await import('../../services/authService');
        const user = await authService.login();
        console.log('Internet Identity login successful:', user);
        onLogin(user.role);
      } else {
        // Use demo mode with selected role
        console.log('Connecting with demo mode, role:', selectedRole);
        onLogin(selectedRole!);
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError(error instanceof Error ? error.message : 'Login failed. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDemoAccess = async () => {
    try {
      console.log('Quick demo access as citizen...');
      onLogin('citizen');
    } catch (error) {
      console.error('Demo access failed:', error);
      setError('Demo access failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Shield className="h-12 w-12 text-blue-400" />
            <h1 className="text-5xl font-bold text-white">CorruptGuard</h1>
          </div>
          <p className="text-xl text-blue-100 mb-4">
            Advanced Government Procurement Corruption Detection System
          </p>
          <p className="text-blue-200 text-sm mb-8">
            AI-Powered Fraud Detection • Blockchain Transparency • Real-time Monitoring
          </p>
          
          {/* ICP Connection Info */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-2xl mx-auto border border-white/20">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center">
                <Shield className="h-3 w-3 text-white" />
              </div>
              <span className="text-blue-200 font-semibold">Internet Computer Protocol Authentication</span>
            </div>
            <p className="text-blue-100 text-sm">
              Secure, passwordless authentication powered by blockchain technology
            </p>
          </div>
        </div>

        {/* Authentication Method Selection */}
        <div className="max-w-4xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            Choose Authentication Method
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Internet Identity */}
            <div 
              className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                authMethod === 'internet_identity' 
                  ? 'border-blue-400 bg-blue-900/30' 
                  : 'border-white/20 hover:border-blue-300 bg-white/5'
              }`}
              onClick={() => setAuthMethod('internet_identity')}
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-white mb-2">Internet Identity</h3>
                <p className="text-blue-200 text-sm mb-4">Blockchain Authentication</p>
                <ul className="text-xs text-blue-300 space-y-1">
                  <li>• Passwordless security</li>
                  <li>• Role auto-determined</li>
                  <li>• Production-ready</li>
                </ul>
              </div>
            </div>

            {/* Demo Mode */}
            <div 
              className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                authMethod === 'demo' 
                  ? 'border-green-400 bg-green-900/30' 
                  : 'border-white/20 hover:border-green-300 bg-white/5'
              }`}
              onClick={() => setAuthMethod('demo')}
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-white mb-2">Demo Mode</h3>
                <p className="text-green-200 text-sm mb-4">Explore System Features</p>
                <ul className="text-xs text-green-300 space-y-1">
                  <li>• Instant access</li>
                  <li>• Choose your role</li>
                  <li>• Full feature demo</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Role Selection (Demo Mode Only) */}
        {authMethod === 'demo' && (
          <div className="max-w-6xl mx-auto mb-12">
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              Select Your Role
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(roleConfig).map(([role, config]) => {
                const Icon = config.icon;
                const isSelected = selectedRole === role;
                
                return (
                  <div
                    key={role}
                    onClick={() => handleRoleSelect(role as UserRole)}
                    className={`relative bg-white rounded-2xl p-6 cursor-pointer transition-all duration-300 border-2 ${
                      isSelected 
                        ? 'border-blue-400 scale-105 shadow-2xl' 
                        : 'border-transparent hover:scale-105 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {/* Role Badge */}
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-2">{config.badge}</div>
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${config.colors} mb-4`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                    </div>

                    {/* Role Info */}
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">
                        {config.title}
                      </h3>
                      <p className="text-slate-600 text-sm mb-4">
                        {config.description}
                      </p>
                      
                      {/* Permissions */}
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                          Permissions:
                        </p>
                        {config.permissions.map((permission, index) => (
                          <span
                            key={index}
                            className="inline-block bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded mr-2 mb-1"
                          >
                            {permission}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className="absolute top-4 right-4">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6">
            <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 text-center">
              <p className="text-red-200 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Connection Button */}
        <div className="text-center space-y-4">
          {authMethod === 'internet_identity' ? (
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className={`bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-500 disabled:to-gray-600 text-white px-12 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                !isConnecting ? 'shadow-xl hover:shadow-2xl hover:scale-105' : 'opacity-50 cursor-not-allowed'
              }`}
            >
              {isConnecting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Connecting to Internet Identity...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Connect with Internet Identity</span>
                </div>
              )}
            </button>
          ) : (
            <button
              onClick={handleConnect}
              disabled={!selectedRole || isConnecting}
              className={`bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-500 disabled:to-gray-600 text-white px-12 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                selectedRole && !isConnecting ? 'shadow-xl hover:shadow-2xl hover:scale-105' : 'opacity-50 cursor-not-allowed'
              }`}
            >
              {isConnecting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Connecting...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Eye className="w-5 h-5" />
                  <span>
                    {selectedRole 
                      ? `Enter as ${roleConfig[selectedRole].title}`
                      : 'Select a Role Above'
                    }
                  </span>
                </div>
              )}
            </button>
          )}

          {selectedRole && authMethod === 'demo' && (
            <div className="text-blue-200 text-sm">
              Demo Mode: <span className="font-semibold">{roleConfig[selectedRole].title}</span>
            </div>
          )}

          {authMethod === 'internet_identity' && (
            <div className="text-blue-200 text-sm">
              Your role will be determined automatically based on your principal ID
            </div>
          )}

          {/* Quick Demo Access */}
          {authMethod === 'demo' && (
            <div className="pt-6 border-t border-white/20">
              <div className="text-center mb-4">
                <p className="text-green-200 text-sm mb-2">
                  🚀 Want to explore quickly?
                </p>
                <p className="text-green-300 text-xs">
                  No Internet Identity required • Full features available • Instant access
                </p>
              </div>
              <button
                onClick={handleDemoAccess}
                className="bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-500 px-8 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                🎯 Quick Demo as Citizen
              </button>
            </div>
          )}
        </div>

        {/* Principal Display (Demo) */}
        {selectedRole && authMethod === 'demo' && (
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <p className="text-blue-200 text-sm text-center">
                Demo Principal ID: <code className="bg-white/10 px-2 py-1 rounded text-white font-mono text-xs">
                  {selectedRole.replace('_', '-')}-demo-principal-{Math.random().toString(36).substr(2, 8)}
                </code>
              </p>
            </div>
          </div>
        )}

        {/* Features Showcase */}
        <div className="mt-16 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Advanced Corruption Detection System
            </h2>
            <p className="text-blue-200 text-lg">
              Powered by AI + Blockchain for Maximum Transparency
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* AI Fraud Detection */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">AI Fraud Detection</h3>
              <ul className="text-blue-200 text-sm space-y-2">
                <li>• 87% detection accuracy</li>
                <li>• Real-time analysis</li>
                <li>• Pattern recognition</li>
                <li>• Risk scoring 0-100</li>
              </ul>
            </div>

            {/* Blockchain Transparency */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                <Building className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Blockchain Transparency</h3>
              <ul className="text-blue-200 text-sm space-y-2">
                <li>• Immutable audit trails</li>
                <li>• Public verification</li>
                <li>• Smart contracts</li>
                <li>• Decentralized governance</li>
              </ul>
            </div>

            {/* Citizen Oversight */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Citizen Oversight</h3>
              <ul className="text-blue-200 text-sm space-y-2">
                <li>• Challenge system</li>
                <li>• Public reporting</li>
                <li>• Community verification</li>
                <li>• Reward mechanisms</li>
              </ul>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="text-center">
              <h3 className="text-lg font-bold text-white mb-4">System Status</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full mx-auto mb-2"></div>
                  <p className="text-xs text-blue-200">Fraud Detection</p>
                  <p className="text-xs text-white font-semibold">ACTIVE</p>
                </div>
                <div className="text-center">
                  <div className="w-3 h-3 bg-blue-400 rounded-full mx-auto mb-2"></div>
                  <p className="text-xs text-blue-200">ICP Blockchain</p>
                  <p className="text-xs text-white font-semibold">OPERATIONAL</p>
                </div>
                <div className="text-center">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full mx-auto mb-2"></div>
                  <p className="text-xs text-blue-200">Active Monitoring</p>
                  <p className="text-xs text-white font-semibold">24/7</p>
                </div>
                <div className="text-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full mx-auto mb-2"></div>
                  <p className="text-xs text-blue-200">Citizen Access</p>
                  <p className="text-xs text-white font-semibold">OPEN</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}