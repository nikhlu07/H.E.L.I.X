import React from 'react';
import { Users, CheckCircle, DollarSign, PackageSearch, Rocket, TrendingUp } from 'lucide-react';
import { AnimatedCounter } from '../common/AnimatedCounter';

export function StatsDashboard() {
  const stats = [
    {
      icon: Users,
      label: 'Partners Onboarded',
      value: 50,
      suffix: '+',
      description: 'Leading NGOs, governments, and logistics partners.'
    },
    {
      icon: CheckCircle,
      label: 'Delivery Success Rate',
      value: 99.8,
      suffix: '%',
      description: 'End-to-end verification of aid reaching its destination.'
    },
    {
      icon: DollarSign,
      label: 'Value Delivered',
      value: 15,
      prefix: '$',
      suffix: 'M+',
      description: 'Total value of aid delivered transparently via H.E.L.I.X.'
    },
    {
      icon: PackageSearch,
      label: 'Supplies Tracked',
      value: 250,
      suffix: 'K+',
      description: 'Individual items tracked from warehouse to recipient.'
    },
    {
      icon: Rocket,
      label: 'Supply Chain Acceleration',
      value: 75,
      suffix: '%',
      description: 'Average reduction in delivery time from source to need.'
    },
    {
      icon: TrendingUp,
      label: 'Donor Trust Index',
      value: 98,
      suffix: '%',
      description: 'Confidence score reported by participating donors.'
    }
  ];

  return (
    <div className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Platform Impact
          </h2>
          <p className="text-xl text-helix-gray-300 max-w-3xl mx-auto">
            Real-time statistics showing the effectiveness of the H.E.L.I.X. network.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group bg-helix-gray-900 rounded-2xl p-8 shadow-md hover:shadow-primary/20 hover:shadow-lg transition-all duration-300 border border-helix-gray-800 hover:border-primary hover:scale-105"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="p-3 rounded-xl bg-primary">
                  <stat.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">
                    <AnimatedCounter
                      target={stat.value}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                    />
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white group-hover:text-helix-gray-200 transition-colors mb-2">
                {stat.label}
              </h3>
              {stat.description && (
                <p className="text-sm text-helix-gray-400">{stat.description}</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 bg-helix-gray-900 rounded-2xl p-8 border border-helix-gray-800">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-primary mb-4">
              A New Standard for Transparency
            </h3>
            <p className="text-helix-gray-300 mb-6 max-w-2xl mx-auto">
              H.E.L.I.X. is built on open-source principles to be a global public good. We invite all organizations to join us in building a new, trustworthy foundation for humanitarian aid.
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm text-helix-gray-300">
              <span className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Open Source</span>
              </span>
              <span className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Built on ICP</span>
              </span>
              <span className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Community Governed</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
