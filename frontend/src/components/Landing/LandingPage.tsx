import { Header } from './Header';
import { LampDemo } from '../Demo/LampDemo';
import  PricingSection3  from '../ui/pricing-section-2';
import CaseStudies from '../ui/case-studies';
import { ICPSolution } from './ICPSolution';
import { StatsDashboard } from './StatsDashboard';

export function LandingPage() {
  return (
    <div>
      <Header />
      <LampDemo />
      <CaseStudies />
      <ICPSolution />
      <PricingSection3 />
      <StatsDashboard />
    </div>
  );
}
