import React, { useState } from 'react';
import { Building2, Heart, Factory, ArrowLeft, Shield, Globe, Zap, Key } from 'lucide-react';
import corruptGuardService from '../../services/corruptGuardService';
import demoModeService from '../../services/demoMode';

interface LoginPageProps {
  onLogin: (role: string, sector: string) => void;
  onBackToLanding?: () => void;
}

const roleConfig = {
  'main_government': {
    title: 'Main Government',
    description: 'Central Authority & Budget Control',
    icon: Building2,
    colors: 'from-blue-600 to-indigo-600',
    badge: '🏛️',
    features: ['Budget Control', 'Role Management', 'Fraud Oversight', 'System Administration']
  },
  'state_head': {
    title: 'State Head',
    description: 'Regional Authority & Oversight',
    icon: Building2,
    colors: 'from-emerald-600 to-teal-600',
    badge: '🏆',
    features: ['Regional Management', 'Budget Oversight', 'Project Approval', 'Vendor Management']
  },
  'deputy': {
    title: 'Deputy',
    description: 'Local Authority & Project Management',
    icon: Building2,
    colors: 'from-orange-600 to-red-600',
    badge: '👨‍💼',
    features: ['Project Management', 'Vendor Approval', 'Claim Processing', 'Local Oversight']
  },
  'vendor': {
    title: 'Vendor',
    description: 'Main Contractors',
    icon: Factory,
    colors: 'from-purple-600 to-pink-600',
    badge: '🏗️',
    features: ['Claim Submission', 'Payment Tracking', 'Supplier Management', 'Contract Compliance']
  },
  'sub_supplier': {
    title: 'Sub Supplier',
    description: 'Subcontractors & Suppliers',
    icon: Factory,
    colors: 'from-teal-600 to-cyan-600',
    badge: '📦',
    features: ['Subcontract Management', 'Material Supply', 'Invoice Submission', 'Quality Control']
  },
  'citizen': {
    title: 'Citizen',
    description: 'Community Oversight',
    icon: Heart,
    colors: 'from-green-600 to-emerald-600',
    badge: '👩‍💻',
    features: ['Transparency Access', 'Corruption Reporting', 'Community Verification', 'Public Auditing']
  }
};

type RoleType = keyof typeof roleConfig;

export function LoginPage({ onLogin, onBackToLanding }: LoginPageProps) {
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);
  const [authMethod, setAuthMethod] = useState<'demo' | 'icp' | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoleSelect = (role: RoleType) => {
    setSelectedRole(role);
    setError(null);
  };

  const handleAuthMethodSelect = (method: 'demo' | 'icp') => {
    setAuthMethod(method);
    setError(null);
  };

  const handleConnect = async () => {
    if (!selectedRole || !authMethod) return;
    
    setIsConnecting(true);
    setError(null);
    
    try {
      let user;
      
             if (authMethod === 'icp') {
         // Initialize ICP authentication
         await corruptGuardService.init();
         user = await corruptGuardService.loginWithICP();
       } else {
         // Demo login - use simple demo service
         user = await demoModeService.loginWithDemo(selectedRole);
       }
      
      // Simulate connection delay for better UX
      setTimeout(() => {
        onLogin(selectedRole, 'government'); // Always government for full functionality
        setIsConnecting(false);
      }, 1500);
      
    } catch (error) {
      console.error('Authentication failed:', error);
      setError(authMethod === 'icp' 
        ? 'ICP authentication failed. Please try again.' 
        : 'Demo login failed. Please try again.'
      );
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          {onBackToLanding && (
            <button
              onClick={onBackToLanding}
              className="absolute top-8 left-8 flex items-center space-x-2 text-blue-200 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
          )}
          
                     <div className="flex items-center justify-center space-x-3 mb-6">
             <img src="/logo.svg" alt="CorruptGuard Logo" className="w-12 h-12" />
             <h1 className="text-5xl font-bold text-white">CorruptGuard</h1>
           </div>
          <p className="text-xl text-blue-100 mb-4">
            ICP-Powered Anti-Corruption Platform
          </p>
                               <p className="text-blue-200 text-sm mb-8">
                       AI-Powered Fraud Detection • ICP Blockchain Transparency • Real-time Monitoring
                     </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-center">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Authentication Method Selection */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Choose Authentication Method
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Internet Computer Identity */}
            <div
              onClick={() => handleAuthMethodSelect('icp')}
              className={`relative bg-white rounded-2xl p-8 cursor-pointer transition-all duration-300 border-2 ${
                authMethod === 'icp' 
                  ? 'border-blue-400 scale-105 shadow-2xl' 
                  : 'border-transparent hover:scale-105 shadow-lg hover:shadow-xl'
              }`}
            >
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">🔐</div>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
                  <Globe className="h-8 w-8 text-white" />
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Internet Computer Identity
                </h3>
                <p className="text-slate-600 text-sm mb-6">
                  Full government functionality with blockchain authentication
                </p>
                
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                    Features:
                  </p>
                  <div className="flex items-center space-x-2 text-sm text-slate-700">
                    <Shield className="h-4 w-4 text-blue-500" />
                    <span>WebAuthn secure authentication</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-slate-700">
                    <Key className="h-4 w-4 text-blue-500" />
                    <span>Blockchain verified identity</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-slate-700">
                    <Zap className="h-4 w-4 text-blue-500" />
                    <span>Full system access</span>
                  </div>
                </div>
              </div>

              {authMethod === 'icp' && (
                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Demo Mode */}
            <div
              onClick={() => handleAuthMethodSelect('demo')}
              className={`relative bg-white rounded-2xl p-8 cursor-pointer transition-all duration-300 border-2 ${
                authMethod === 'demo' 
                  ? 'border-purple-400 scale-105 shadow-2xl' 
                  : 'border-transparent hover:scale-105 shadow-lg hover:shadow-xl'
              }`}
            >
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">🎯</div>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
                  <Zap className="h-8 w-8 text-white" />
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Demo Mode
                </h3>
                <p className="text-slate-600 text-sm mb-6">
                  Quick access for testing and presentation
                </p>
                
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                    Features:
                  </p>
                  <div className="flex items-center space-x-2 text-sm text-slate-700">
                    <Zap className="h-4 w-4 text-purple-500" />
                    <span>Instant access</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-slate-700">
                    <Shield className="h-4 w-4 text-purple-500" />
                    <span>Mock data & features</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-slate-700">
                    <Globe className="h-4 w-4 text-purple-500" />
                    <span>Full interface preview</span>
                  </div>
                </div>
              </div>

              {authMethod === 'demo' && (
                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Role Selection */}
        {authMethod && (
          <div className="max-w-6xl mx-auto mb-12">
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              Select Your Government Role
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {Object.entries(roleConfig).map(([role, config]) => {
                const Icon = config.icon;
                const isSelected = selectedRole === role;
                
                return (
                  <div
                    key={role}
                    onClick={() => handleRoleSelect(role as RoleType)}
                    className={`relative bg-white rounded-2xl p-6 cursor-pointer transition-all duration-300 border-2 ${
                      isSelected 
                        ? 'border-blue-400 scale-105 shadow-2xl' 
                        : 'border-transparent hover:scale-105 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {/* Role Badge */}
                    <div className="text-center mb-4">
                      <div className="text-3xl mb-3">{config.badge}</div>
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${config.colors} mb-3`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>

                    {/* Role Info */}
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-slate-900 mb-2">
                        {config.title}
                      </h3>
                      <p className="text-slate-600 text-sm mb-4">
                        {config.description}
                      </p>
                      
                      {/* Features */}
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                          Permissions:
                        </p>
                        {config.features.slice(0, 3).map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2 text-xs text-slate-700">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                            <span>{feature}</span>
                          </div>
                        ))}
                        {config.features.length > 3 && (
                          <div className="text-xs text-slate-500 mt-1">
                            +{config.features.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className="absolute top-3 right-3">
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
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

        {/* Connection Button */}
        <div className="text-center space-y-4">
          <button
            onClick={handleConnect}
            disabled={!selectedRole || !authMethod || isConnecting}
            className={`bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white px-12 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
              selectedRole && authMethod && !isConnecting ? 'shadow-xl hover:shadow-2xl hover:scale-105' : 'opacity-50 cursor-not-allowed'
            }`}
          >
            {isConnecting ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>
                  {authMethod === 'icp' ? 'Connecting to ICP...' : 'Connecting to Demo...'}
                </span>
              </div>
            ) : (
              <span>
                {selectedRole && authMethod
                  ? `Enter as ${roleConfig[selectedRole].title} (${authMethod === 'icp' ? 'ICP Auth' : 'Demo Mode'})`
                  : 'Select Authentication Method and Role Above'
                }
              </span>
            )}
          </button>

          {selectedRole && authMethod && (
            <div className="text-blue-200 text-sm">
              {authMethod === 'icp' ? 'Full Government Access' : 'Demo Mode'}: <span className="font-semibold">{roleConfig[selectedRole].title}</span>
            </div>
          )}
        </div>

        {/* Open Source Notice */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
            <h3 className="text-lg font-bold text-white mb-4">ICP-Powered Anti-Corruption Platform</h3>
            <p className="text-blue-200 text-sm mb-4">
              CorruptGuard provides complete government procurement security with full backend and ICP blockchain integration. 
              Choose Internet Computer Identity for full functionality or Demo Mode for testing.
            </p>
            <div className="flex items-center justify-center space-x-6 text-xs text-blue-300">
              <span>• Full Government Features</span>
              <span>• ICP Blockchain Authentication</span>
              <span>• Open Source Core</span>
              <span>• API Available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}