import { HeroSection } from './HeroSection';
import { SectorShowcase } from './SectorShowcase';
import { CorruptionCases } from './CorruptionCases';
import { ICPSolution } from './ICPSolution';
import { StatsDashboard } from './StatsDashboard';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen">
      <HeroSection onGetStarted={onGetStarted} />
      <CorruptionCases />
      <ICPSolution />
      <SectorShowcase />
      <StatsDashboard />
    </div>
  );
}