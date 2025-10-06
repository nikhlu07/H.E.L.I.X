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
    <section id="features" className="py-20 lg:py-32 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-gray-900 mb-4">Platform Impact by the Numbers</h2>
          <p className="text-lg text-gray-600">Real-time statistics showing the effectiveness and transparency of the Red Médica network.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="feature-card text-center p-8 rounded-xl">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-white text-yellow-600 mx-auto mb-4 border-2 border-yellow-200">
                <stat.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{stat.label}</h3>
              <div className="text-4xl font-bold text-yellow-600 my-4">
                <AnimatedCounter
                  target={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                />
              </div>
              <p className="text-gray-600 text-sm">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
