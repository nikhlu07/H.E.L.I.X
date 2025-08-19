import { HeroSection } from './HeroSection';
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
      <CorruptionCases />
      <ICPSolution />
      <StatsDashboard />
      <SystemStatus />
    </div>
  );
}