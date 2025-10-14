import React from 'react';
import JoinUs_Section from "@/components/ui/globe-feature-section";
import { StackedCircularFooter } from '../ui/stacked-circular-footer';
import FeaturedSectionStats from '../ui/featured-section-stats';

export function StatsDashboard() {
  return (
    <div className="bg-white">
      <FeaturedSectionStats />

      <JoinUs_Section />

      <StackedCircularFooter />
    </div>
  );
}
