"use client";
import React, { useState, useRef } from 'react';
import { Landmark, Map, UserCheck, Factory, ArrowLeft, FileSearch, Key, Truck, ArrowRight, Eye } from 'lucide-react';
import helixService from '../../services/helixService';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TimelineContent } from "@/components/ui/timeline-animation";
import {VerticalCutReveal} from "@/components/ui/vertical-cut-reveal";

interface LoginPageProps {
  onLogin: (role: string, sector: string) => void;
  onBackToLanding?: () => void;
}

const roleConfig = {
  'main_government': {
    title: 'Government Official',
    description: 'National oversight and policy control',
    icon: Landmark,
  },
  'state_head': {
    title: 'State Head',
    description: 'Regional management and coordination',
    icon: Map,
  },
  'deputy': {
    title: 'Deputy Officer',
    description: 'District-level execution and monitoring',
    icon: UserCheck,
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
    icon: Eye,
  },
  'auditor': {
    title: 'Auditor',
    description: 'Independent Oversight & Compliance Monitoring',
    icon: FileSearch,
  }
};

type RoleType = keyof typeof roleConfig;

export function LoginPage({ onLogin, onBackToLanding }: LoginPageProps) {
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loginRef = useRef<HTMLDivElement>(null);

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.4,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -20,
      opacity: 0,
    },
  };

  const handleRoleSelect = (role: RoleType) => {
    setSelectedRole(role);
    setError(null);
  };

  const handleConnect = async () => {
    if (!selectedRole) return;
    setIsConnecting(true);
    setError(null);

    try {
      await helixService.init();
      await helixService.loginWithICP();

      setTimeout(() => {
        onLogin(selectedRole, 'government');
        setIsConnecting(false);
      }, 500);
    } catch (error) {
      console.error('Authentication failed:', error);
      setError('ICP authentication failed. Please try again.');
      setIsConnecting(false);
    }
  };

  return (
    <section
      className="py-16 px-4 bg-white w-full relative min-h-screen flex items-center"
      ref={loginRef}
    >
      {onBackToLanding && (
        <button
          onClick={onBackToLanding}
          className="absolute top-8 left-8 flex items-center space-x-2 text-gray-500 hover:text-gray-800 transition-colors z-10"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </button>
      )}
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#0000001a_1px,transparent_1px),linear-gradient(to_bottom,#0000001a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_40%_50%_at_50%_50%,#000_70%,transparent_110%)]"></div>
      <div className="max-w-7xl mx-auto w-full">
        <article className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            <VerticalCutReveal
              splitBy="words"
              staggerDuration={0.15}
              staggerFrom="first"
              reverse={true}
              containerClassName="justify-center"
              transition={{
                type: "spring",
                stiffness: 250,
                damping: 40,
                delay: 0,
              }}
            >
              Secure Portal Access
            </VerticalCutReveal>
          </h2>

          <TimelineContent
            as="p"
            animationNum={0}
            timelineRef={loginRef}
            customVariants={revealVariants}
            className="text-gray-600"
          >
            Select your role to proceed to the Helix dashboard.
          </TimelineContent>
        </article>

        {error && (
            <div className="mb-8 max-w-2xl mx-auto">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
                <p>{error}</p>
              </div>
            </div>
          )}

        <div className="flex flex-wrap justify-center gap-8 mb-12">
          {Object.entries(roleConfig).map(([role, config], index) => (
             <TimelineContent
             as="div"
             animationNum={index + 1}
             timelineRef={loginRef}
             customVariants={revealVariants}
             key={role}
             className="w-full max-w-sm"
           >
            <RoleCard
              roleKey={role as RoleType}
              config={config}
              isSelected={selectedRole === role}
              onSelect={handleRoleSelect}
            />
            </TimelineContent>
          ))}
        </div>

        <div className="text-center">
        <TimelineContent
              as="div"
              animationNum={Object.keys(roleConfig).length + 2}
              timelineRef={loginRef}
              customVariants={revealVariants}
            >
            <button
              onClick={handleConnect}
              disabled={!selectedRole || isConnecting}
              className={`w-full max-w-md mx-auto font-semibold px-12 py-4 rounded-lg text-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
                selectedRole && !isConnecting ? 'bg-black text-white hover:bg-gray-800 shadow-lg shadow-black' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isConnecting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <span>{selectedRole ? `Enter as ${roleConfig[selectedRole].title}` : 'Select a Role'}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
            </TimelineContent>
          </div>
      </div>
    </section>
  );
}

const RoleCard = ({ roleKey, config, isSelected, onSelect }: {
  roleKey: RoleType,
  config: { title: string, description: string, icon: React.ElementType },
  isSelected: boolean,
  onSelect: (role: RoleType) => void
}) => {
  const Icon = config.icon;
  return (
    <Card
      onClick={() => onSelect(roleKey)}
      className={`p-0 text-left cursor-pointer h-full flex flex-col bg-white rounded-xl border-neutral-200 ${isSelected ? 'border-yellow-400  shadow-lg' : ''}`}>
      <CardHeader className={`text-left py-4 border-b  border-neutral-300 rounded-t-xl ${isSelected ? 'bg-primary' : 'bg-gray-100'}`}>
        <div className="flex items-center space-x-4">
            <div className={`flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-lg `}>
              <Icon className={'h-6 w-6 text-black'} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 my-auto">{config.title}</h3>
            </div>
        </div>
      </CardHeader>
      <CardContent className=" flex-grow flex flex-col justify-between">
        <p className="text-gray-500 text-sm mt-4">{config.description}</p>
        {/*{isSelected && <div className="text-yellow-600 font-bold text-sm mt-4">Selected</div>}*/}
      </CardContent>
    </Card>
  );
};
