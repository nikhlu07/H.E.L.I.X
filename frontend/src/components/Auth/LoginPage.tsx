import React, { useState } from 'react';
import { Building2, Heart, Factory, ArrowLeft, Shield, Globe, Zap, Key, Truck } from 'lucide-react';
import helixService from '../../services/helixService';
import demoModeService from '../../services/demoMode';

interface LoginPageProps {
  onLogin: (role: string, sector: string) => void;
  onBackToLanding?: () => void;
}

const roleConfig = {
  'lead_agency': {
    title: 'Lead Agency',
    description: 'e.g., UN, Red Cross',
    icon: Building2,
    badge: '🌍',
    features: ['Global Oversight', 'Fund Allocation', 'Partner Vetting', 'System Audits']
  },
  'field_director': {
    title: 'Field Director',
    description: 'Regional Operations Head',
    icon: Heart,
    badge: '🏆',
    features: ['Regional Coordination', 'Budget Management', 'Resource Deployment', 'Crisis Response']
  },
  'program_manager': {
    title: 'Program Manager',
    description: 'On-the-Ground Implementation',
    icon: Heart,
    badge: '👨‍💼',
    features: ['Project Execution', 'Local Partnering', 'Needs Assessment', 'Delivery Verification']
  },
  'logistics_partner': {
    title: 'Logistics Partner',
    description: 'Supply Chain & Transport',
    icon: Truck,
    badge: '🚚',
    features: ['Shipment Tracking', 'Warehouse Management', 'Customs Clearance', 'Fleet Coordination']
  },
  'local_supplier': {
    title: 'Local Supplier',
    description: 'Local Vendors & Providers',
    icon: Factory,
    badge: '📦',
    features: ['Goods & Services', 'Invoice Submission', 'Quality Assurance', 'Local Sourcing']
  },
  'auditor': {
    title: 'Auditor',
    description: 'Independent Oversight',
    icon: Shield,
    badge: '👩‍💻',
    features: ['Transaction Auditing', 'Performance Review', 'Compliance Checks', 'Public Reporting']
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
      if (authMethod === 'icp') {
         await helixService.init();
         await helixService.loginWithICP();
       } else {
         await demoModeService.loginWithDemo(selectedRole);
       }
      
      setTimeout(() => {
        onLogin(selectedRole, 'government');
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
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          {onBackToLanding && (
            <button
              onClick={onBackToLanding}
              className="absolute top-8 left-8 flex items-center space-x-2 text-helix-gray-300 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
          )}
          
          <div className="flex items-center justify-center space-x-3 mb-6">
             <Shield className="w-12 h-12 text-primary" />
             <h1 className="text-5xl font-bold">H.E.L.I.X.</h1>
           </div>
          <p className="text-xl text-helix-gray-300 mb-4">
            Humanitarian Economic Logistics & Integrity Xchange
          </p>
          <p className="text-helix-gray-400 text-sm mb-8">
            Transparent Aid Delivery • Blockchain Integrity • Real-time Logistics
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-red-900/50 border border-red-700 rounded-xl p-4 text-center">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Authentication Method Selection */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">
            Choose Authentication Method
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <AuthMethodCard
              method="icp"
              title="Internet Computer Identity"
              description="Full functionality with blockchain authentication."
              icon={Globe}
              features={[
                { icon: Shield, text: 'WebAuthn secure authentication' },
                { icon: Key, text: 'Blockchain verified identity' },
                { icon: Zap, text: 'Full system access' },
              ]}
              selectedAuthMethod={authMethod}
              onSelect={handleAuthMethodSelect}
            />
            <AuthMethodCard
              method="demo"
              title="Demo Mode"
              description="Quick access for testing and presentation."
              icon={Zap}
              features={[
                { icon: Zap, text: 'Instant access' },
                { icon: Shield, text: 'Mock data & features' },
                { icon: Globe, text: 'Full interface preview' },
              ]}
              selectedAuthMethod={authMethod}
              onSelect={handleAuthMethodSelect}
            />
          </div>
        </div>

        {/* Role Selection */}
        {authMethod && (
          <div className="max-w-6xl mx-auto mb-12">
            <h2 className="text-2xl font-bold text-center mb-8">
              Select Your Role
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {Object.entries(roleConfig).map(([role, config]) => (
                <RoleCard
                  key={role}
                  roleKey={role as RoleType}
                  config={config}
                  isSelected={selectedRole === role}
                  onSelect={handleRoleSelect}
                />
              ))}
            </div>
          </div>
        )}

        {/* Connection Button */}
        <div className="text-center space-y-4">
          <button
            onClick={handleConnect}
            disabled={!selectedRole || !authMethod || isConnecting}
            className={`bg-primary text-primary-foreground px-12 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
              selectedRole && authMethod && !isConnecting ? 'shadow-xl hover:shadow-primary/50 hover:scale-105' : 'opacity-50 cursor-not-allowed'
            }`}
          >
            {isConnecting ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                <span>
                  {authMethod === 'icp' ? 'Connecting to ICP...' : 'Connecting to Demo...'}
                </span>
              </div>
            ) : (
              <span>
                {selectedRole && authMethod
                  ? `Enter as ${roleConfig[selectedRole].title}`
                  : 'Select Method and Role'
                }
              </span>
            )}
          </button>

          {selectedRole && authMethod && (
            <div className="text-helix-gray-400 text-sm">
              Mode: <span className="font-semibold text-helix-gray-200">{authMethod === 'icp' ? 'Live (ICP)' : 'Demo'}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Sub-components for cleaner structure ---

const AuthMethodCard = ({ method, title, description, icon: Icon, features, selectedAuthMethod, onSelect }) => (
  <div
    onClick={() => onSelect(method)}
    className={`relative bg-helix-gray-900 rounded-2xl p-8 cursor-pointer transition-all duration-300 border-2 ${
      selectedAuthMethod === method
        ? 'border-primary scale-105 shadow-2xl shadow-primary/20'
        : 'border-helix-gray-700 hover:border-helix-gray-600'
    }`}
  >
    <div className="text-center mb-6">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-helix-gray-800 mb-4">
        <Icon className="h-8 w-8 text-primary" />
      </div>
    </div>
    <div className="text-center">
      <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
      <p className="text-helix-gray-400 text-sm mb-6">{description}</p>
      <div className="space-y-2">
        {features.map((feature, i) => (
          <div key={i} className="flex items-center space-x-2 text-sm text-helix-gray-300">
            <feature.icon className="h-4 w-4 text-primary" />
            <span>{feature.text}</span>
          </div>
        ))}
      </div>
    </div>
    {selectedAuthMethod === method && (
      <div className="absolute top-4 right-4">
        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
        </div>
      </div>
    )}
  </div>
);

const RoleCard = ({ roleKey, config, isSelected, onSelect }) => {
  const Icon = config.icon;
  return (
    <div
      onClick={() => onSelect(roleKey)}
      className={`relative bg-helix-gray-900 rounded-2xl p-6 cursor-pointer transition-all duration-300 border-2 ${
        isSelected
          ? 'border-primary scale-105 shadow-2xl shadow-primary/20'
          : 'border-helix-gray-700 hover:border-helix-gray-600'
      }`}
    >
      <div className="text-center mb-4">
        <div className="text-3xl mb-3">{config.badge}</div>
        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-helix-gray-800 mb-3`}>
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
      <div className="text-center">
        <h3 className="text-lg font-bold text-white mb-2">{config.title}</h3>
        <p className="text-helix-gray-400 text-sm mb-4">{config.description}</p>
        <div className="space-y-1 text-left">
          {config.features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2 text-xs text-helix-gray-300">
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
      {isSelected && (
        <div className="absolute top-3 right-3">
          <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
          </div>
        </div>
      )}
    </div>
  );
};