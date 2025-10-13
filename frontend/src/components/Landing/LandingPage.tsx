import { Header } from './Header';
import { LampDemo } from '../Demo/LampDemo';
// import { DemoOne } from '../Demo/DemoOne';
import { SectorShowcase } from './SectorShowcase';
import { CorruptionCases } from './CorruptionCases';
import { ICPSolution } from './ICPSolution';
import { StatsDashboard } from './StatsDashboard';

export function LandingPage() {
  return (
    <div className="">
      <Header />
      <LampDemo />
      <CorruptionCases />
      <ICPSolution />
      <SectorShowcase />
      <StatsDashboard />
    </div>
  );
}
