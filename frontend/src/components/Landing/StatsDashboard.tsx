import React from 'react';
import { Shield, Target, Search, TrendingUp, Users, DollarSign } from 'lucide-react';
import { AnimatedCounter } from '../common/AnimatedCounter';

export function StatsDashboard() {
  const stats = [
    {
      icon: Users,
      label: 'Organizations Using',
      value: 150,
      suffix: '+',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Governments, NGOs, and companies worldwide'
    },
    {
      icon: Shield,
      label: 'Fraud Detection Rate',
      value: 87,
      suffix: '%',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Accuracy in identifying suspicious transactions'
    },
    {
      icon: DollarSign,
      label: 'Fraud Prevented',
      value: 2.8,
      prefix: '$',
      suffix: 'M',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Total value of fraud attempts blocked'
    },
    {
      icon: Search,
      label: 'Transactions Analyzed',
      value: 45,
      suffix: 'K',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Procurement transactions processed monthly'
    },
    {
      icon: Target,
      label: 'Response Time',
      value: 2.4,
      suffix: 's',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      description: 'Average time to detect anomalies'
    },
    {
      icon: TrendingUp,
      label: 'Transparency Score',
      value: 94,
      suffix: '%',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      description: 'Average transparency improvement'
    }
  ];

  return (
    <div className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Platform Impact
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Real-time statistics showing TransparencyX effectiveness across sectors
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-slate-200 hover:scale-105"
            >
              <div className="flex items-start justify-between mb-6">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-bold ${stat.color}`}>
                    <AnimatedCounter
                      target={stat.value}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                    />
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 group-hover:text-slate-700 transition-colors mb-2">
                {stat.label}
              </h3>
              {stat.description && (
                <p className="text-sm text-slate-500">{stat.description}</p>
              )}
            </div>
          ))}
        </div>

        {/* Open Source CTA */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Open Source & Adaptable
            </h3>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              TransparencyX is built to be reusable across organizations. Governments, NGOs, and companies can adapt our platform for their specific transparency needs.
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm text-slate-600">
              <span className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>MIT Licensed</span>
              </span>
              <span className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>API First</span>
              </span>
              <span className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Sector Agnostic</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}