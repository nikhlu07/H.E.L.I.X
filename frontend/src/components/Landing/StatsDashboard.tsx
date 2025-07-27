import React from 'react';
import { Shield, Zap, Target, DollarSign, Search, Building } from 'lucide-react';
import { AnimatedCounter } from '../common/AnimatedCounter';
import { statistics } from '../../data/mockData';

export function StatsDashboard() {
  const stats = [
    {
      icon: Shield,
      label: 'Corruption Cases That Could Be Prevented',
      value: 5400,
      prefix: '₹',
      suffix: ' Cr',
      formatter: (val: number) => `${val.toLocaleString()}`,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      description: 'Based on recent PCI and NAAC scams'
    },
    {
      icon: Search,
      label: 'Transparency Score',
      value: 95,
      suffix: '%',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Complete audit trail visibility'
    },
    {
      icon: Target,
      label: 'Fraud Detection Accuracy',
      value: 87,
      suffix: '%',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'AI-powered pattern recognition'
    },
    {
      icon: DollarSign,
      label: 'Public Money at Risk Annually',
      value: 50000,
      prefix: '₹',
      suffix: ' Cr',
      formatter: (val: number) => `${val.toLocaleString()}`,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      description: 'Government procurement budget'
    },
    {
      icon: Zap,
      label: 'Real-time Monitoring',
      value: 24,
      suffix: '/7',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Continuous blockchain surveillance'
    },
    {
      icon: Building,
      label: 'Government Levels Covered',
      value: 5,
      suffix: ' Tiers',
      color: 'text-slate-600',
      bgColor: 'bg-slate-50',
      description: 'Central to Panchayat level coverage'
    }
  ];

  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Live Impact Dashboard
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Real-time statistics showing our corruption prevention effectiveness across government spending
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
                      formatter={stat.formatter}
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

        {/* Additional Metrics */}
        <div className="mt-16 bg-gradient-to-r from-slate-50 to-emerald-50 rounded-3xl p-8">
          <h3 className="text-2xl font-bold text-slate-900 text-center mb-8">
            System Performance Metrics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-emerald-600 mb-2">
                <AnimatedCounter target={0} suffix=" sec" />
              </div>
              <p className="text-slate-600 font-medium">Average Detection Time</p>
              <p className="text-xs text-slate-500 mt-1">Instant fraud alerts</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-600 mb-2">
                <AnimatedCounter target={100} suffix="%" />
              </div>
              <p className="text-slate-600 font-medium">Data Immutability</p>
              <p className="text-xs text-slate-500 mt-1">Cannot be altered or deleted</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                <AnimatedCounter target={1240} />
              </div>
              <p className="text-slate-600 font-medium">Active Watchdogs</p>
              <p className="text-xs text-slate-500 mt-1">Citizens monitoring contracts</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">
                <AnimatedCounter target={99.9} suffix="%" />
              </div>
              <p className="text-slate-600 font-medium">ICP Network Uptime</p>
              <p className="text-xs text-slate-500 mt-1">Unstoppable blockchain</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}