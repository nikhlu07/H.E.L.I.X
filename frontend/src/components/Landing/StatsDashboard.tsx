import React from 'react';
import JoinUs_Section from "@/components/ui/globe-feature-section";
import { StackedCircularFooter } from '../ui/stacked-circular-footer';
import { TestimonialsDemo } from '@/components/testimonials-demo';

export function StatsDashboard() {
  return (
    <div className="bg-white">
      <TestimonialsDemo />

      <JoinUs_Section />

      <StackedCircularFooter />
    </div>
  );
}
