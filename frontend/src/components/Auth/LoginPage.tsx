import React, { useState } from 'react';
import { Building2, Heart, Factory, ArrowLeft, Shield, Globe, Zap, Key, Truck, ArrowRight } from 'lucide-react';
import helixService from '../../services/helixService';
import { useAuth } from '../../contexts/AuthContext';

interface LoginPageProps {
  onLogin: (role: string, sector: string) => void;
  onBackToLanding?: () => void;
}

const roleConfig = {
  'main_government': {
    title: 'Government Official',
    description: 'National oversight and policy control',
    icon: Building2,
  },
  'state_head': {
    title: 'State Head',
    description: 'Regional management and coordination',
    icon: Heart,
  },
  'deputy': {
    title: 'Deputy Officer',
    description: 'District-level execution and monitoring',
    icon: Heart,
  },
  'vendor': {
    title: 'Vendor/Contractor',
    description: 'Contract management and bid submission',
    icon: Truck,
  },
  'sub_supplier': {
    title: 'Sub-Supplier',
    description: 'Supply chain and delivery management',
    icon: Factory,
  },
  'citizen': {
    title: 'Citizen Observer',
    description: 'Transparency monitoring and reporting',
    icon: Shield,
  }
};

type RoleType = keyof typeof roleConfig;

export function LoginPage({ onLogin, onBackToLanding }: LoginPageProps) {
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);
  const [authMethod, setAuthMethod] = useState<'demo' | 'icp' | 'simple-ii' | null>('icp');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoleSelect = (role: RoleType) => {
    setSelectedRole(role);
    setError(null);
  };

  const handleAuthMethodSelect = (method: 'demo' | 'icp' | 'simple-ii') => {
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
      } else if (authMethod === 'simple-ii') {
        await helixService.loginWithSimpleII(selectedRole);
      } else {
        // Demo mode
        // await authLogin('demo', selectedRole);
      }

      setTimeout(() => {
        onLogin(selectedRole, 'government');
        setIsConnecting(false);
      }, 500);
    } catch (error) {
      console.error('Authentication failed:', error);
      setError(authMethod === 'icp' ? 'ICP authentication failed. Please try again.' : 'Demo authentication failed. Please try again.');
      setIsConnecting(false);
    }
  };

  return (
    <>
      <style>{`
        body {
            font-family: 'Inter', sans-serif;
            background: #F7FAFC;
        }
        .card {
            background: #FFFFFF;
            border: 1px solid #E2E8F0;
            transition: all 0.3s ease;
            border-radius: 0.75rem;
        }
        .card:hover {
            border-color: #FBBF24;
            transform: translateY(-5px);
            box-shadow: 0 10px 25px -5px rgba(251, 191, 36, 0.1), 0 8px 10px -6px rgba(251, 191, 36, 0.1);
        }
        .cta-gradient {
            background-color: #FFCC00;
            color: black;
            transition: opacity 0.3s ease;
        }
        .cta-gradient:hover {
            opacity: 0.9;
        }
        ::selection {
            background-color: #FFCC00;
            color: black;
        }
      `}</style>
      <div className="min-h-screen bg-gray-50 font-sans">
        {onBackToLanding && (
            <button
              onClick={onBackToLanding}
              className="absolute top-8 left-8 flex items-center space-x-2 text-gray-500 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
          )}

        <main className="container mx-auto max-w-5xl px-4 pt-28 pb-8">
          <div className="mb-12 text-center">
            <div className="mb-6 inline-flex rounded-full bg-yellow-100 p-4">
                <Key className="h-10 w-10 text-yellow-600" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-gray-900 md:text-6xl">
              Secure Portal Access
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 mt-4">
             Select your role and authentication method to proceed to the Helix dashboard.
            </p>
          </div>

          {error && (
            <div className="mb-8 max-w-2xl mx-auto">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
                <p>{error}</p>
              </div>
            </div>
          )}

          <div className="mb-10">
            <h2 className="text-xl font-bold text-center mb-6 text-gray-700">1. Select Your Role</h2>
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

          <div className="mb-12">
            <h2 className="text-xl font-bold text-center mb-6 text-gray-700">2. Choose Authentication Method</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                <AuthMethodCard
                  method="icp"
                  title="Internet Identity"
                  icon={Shield}
                  selectedAuthMethod={authMethod}
                  onSelect={handleAuthMethodSelect}
                />
                <AuthMethodCard
                  method="simple-ii"
                  title="Simple II Demo"
                  icon={Key}
                  selectedAuthMethod={authMethod}
                  onSelect={handleAuthMethodSelect}
                />
                <AuthMethodCard
                  method="demo"
                  title="Demo Mode"
                  icon={Zap}
                  selectedAuthMethod={authMethod}
                  onSelect={handleAuthMethodSelect}
                />
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={handleConnect}
              disabled={!selectedRole || isConnecting}
              className={`w-full max-w-md mx-auto cta-gradient font-semibold px-12 py-4 rounded-lg text-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
                selectedRole && !isConnecting ? '' : 'opacity-50 cursor-not-allowed'
              }`}
            >
              {isConnecting ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <span>{selectedRole ? `Enter as ${roleConfig[selectedRole].title}` : 'Select a Role'}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </main>
      </div>
    </>
  );
}

const AuthMethodCard = ({
  method,
  title,
  icon: Icon,
  selectedAuthMethod,
  onSelect
}: {
  method: 'demo' | 'icp' | 'simple-ii';
  title: string;
  icon: React.ElementType;
  selectedAuthMethod: 'demo' | 'icp' | 'simple-ii' | null;
  onSelect: (method: 'demo' | 'icp' | 'simple-ii') => void;
}) => (
  <div
    onClick={() => onSelect(method)}
    className={`card p-4 cursor-pointer flex items-center space-x-4 ${
      selectedAuthMethod === method ? 'border-yellow-400 ring-2 ring-yellow-200 shadow-lg' : 'border-gray-200'
    }`}
  >
    <Icon className={`h-6 w-6 ${selectedAuthMethod === method ? 'text-yellow-600' : 'text-gray-500'}`} />
    <div>
      <h3 className={`font-bold ${selectedAuthMethod === method ? 'text-gray-900' : 'text-gray-700'}`}>{title}</h3>
    </div>
  </div>
);

const RoleCard = ({ roleKey, config, isSelected, onSelect }: {
  roleKey: RoleType,
  config: { title: string, description: string, icon: React.ElementType },
  isSelected: boolean,
  onSelect: (role: RoleType) => void
}) => {
  const Icon = config.icon;
  return (
    <div
      onClick={() => onSelect(roleKey)}
      className={`card p-6 text-left cursor-pointer ${
        isSelected ? 'border-yellow-400 ring-2 ring-yellow-200 shadow-lg' : 'border-gray-200'
      }`}
    >
      <div className="flex items-start space-x-4">
        <div className={`flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-lg ${isSelected ? 'bg-yellow-100' : 'bg-gray-100'}`}>
          <Icon className={`h-6 w-6 ${isSelected ? 'text-yellow-600' : 'text-gray-600'}`} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">{config.title}</h3>
          <p className="text-gray-500 text-sm">{config.description}</p>
        </div>
      </div>
    </div>
  );
};
