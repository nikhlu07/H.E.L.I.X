import { HeroSection } from './HeroSection';
import { SectorShowcase } from './SectorShowcase';
import { CorruptionCases } from './CorruptionCases';
import { ICPSolution } from './ICPSolution';
import { StatsDashboard } from './StatsDashboard';
import { SystemStatus } from './SystemStatus';

interface LandingPageProps {
  onGetStarted: () => void;
  onTryDemo?: () => void;
  onTryLiveDemo?: () => void;
  onMultiCountryDemo?: () => void;
  onCompetitionMode?: () => void;
}

export function LandingPage({ onGetStarted, onTryDemo, onTryLiveDemo, onMultiCountryDemo, onCompetitionMode }: LandingPageProps) {
  return (
    <div className="min-h-screen">
      <HeroSection onGetStarted={onGetStarted} onTryDemo={onTryDemo} onMultiCountryDemo={onMultiCountryDemo} />
      <CorruptionCases />
      <ICPSolution />
      <SectorShowcase onTryLiveDemo={onTryLiveDemo} />
      <StatsDashboard />
    </div>
  );
}