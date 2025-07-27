import React from 'react';
import { HeroSection } from './HeroSection';
import { WhyWeBuilt } from './WhyWeBuilt';
import { CorruptionCases } from './CorruptionCases';
import { ICPSolution } from './ICPSolution';
import { StatsDashboard } from './StatsDashboard';
import { SystemStatus } from './SystemStatus';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen">
      <HeroSection onGetStarted={onGetStarted} />
      <WhyWeBuilt />
      <CorruptionCases />
      <ICPSolution />
      <StatsDashboard />
      <SystemStatus />
    </div>
  );
}