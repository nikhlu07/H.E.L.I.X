import React from 'react';
import { fraudPatterns } from '../../data/mockData';

export function FraudPatternsShowcase() {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'from-red-500 to-red-600';
      case 'high': return 'from-orange-500 to-orange-600';
      case 'medium': return 'from-amber-500 to-amber-600';
      default: return 'from-blue-500 to-blue-600';
    }
  };

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-amber-100 text-amber-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Corruption Detection Patterns
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Advanced AI algorithms identify and prevent these common corruption schemes before taxpayer money is lost
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {fraudPatterns.map((pattern, index) => (
            <div
              key={pattern.id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-slate-200 overflow-hidden"
            >
              {/* Header with gradient */}
              <div className={`bg-gradient-to-r ${getRiskColor(pattern.riskLevel)} p-6 text-white`}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">{pattern.icon}</span>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-sm`}>
                    {pattern.riskLevel.toUpperCase()}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{pattern.title}</h3>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-slate-600 mb-6 leading-relaxed">
                  {pattern.description}
                </p>

                {/* Statistics */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-700">Cases Detected</span>
                    <span className="text-lg font-bold text-slate-900">{pattern.cases}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-700">Money Saved</span>
                    <span className="text-lg font-bold text-emerald-600">{pattern.prevented}</span>
                  </div>
                </div>

                {/* Progress bar showing effectiveness */}
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-slate-600">Detection Rate</span>
                    <span className="text-xs font-bold text-slate-900">
                      {Math.floor(85 + Math.random() * 12)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className={`bg-gradient-to-r ${getRiskColor(pattern.riskLevel)} h-2 rounded-full transition-all duration-1000`}
                      style={{ width: `${85 + Math.random() * 12}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Ready to Protect Your Government Spending?
            </h3>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              Join the fight against corruption with blockchain-powered transparency and AI-driven detection.
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
              Start Monitoring Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}