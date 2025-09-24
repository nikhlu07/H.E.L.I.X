import React from 'react';
import { CheckCircle, MapPin, Users, Brain, Shield } from 'lucide-react';
import { successStories } from '../../data/mockData';

export function SuccessStories() {
  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'citizen-reporting': return Users;
      case 'ai-detection': return Brain;
      case 'blockchain-analysis': return Shield;
      default: return CheckCircle;
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'citizen-reporting': return 'text-blue-600 bg-blue-50';
      case 'ai-detection': return 'text-purple-600 bg-purple-50';
      case 'blockchain-analysis': return 'text-emerald-600 bg-emerald-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="py-20 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Corruption Cases Prevented
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Real success stories where CorruptGuard's technology saved taxpayer money and exposed fraudulent activities
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {successStories.map((story) => {
            const MethodIcon = getMethodIcon(story.method);
            return (
              <div
                key={story.id}
                className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-100 overflow-hidden group"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <CheckCircle className="h-8 w-8" />
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        ${(story.amount / 1000).toFixed(0)}K
                      </div>
                      <div className="text-emerald-100 text-sm">Saved</div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold">{story.title}</h3>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-slate-600 leading-relaxed mb-6">
                    {story.description}
                  </p>

                  {/* Method and Location */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getMethodColor(story.method)}`}>
                        <MethodIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900 text-sm">Detection Method</div>
                        <div className="text-slate-600 text-xs capitalize">
                          {story.method.replace('-', ' ')}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900 text-sm">Location</div>
                        <div className="text-slate-600 text-xs">{story.location}</div>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <div className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                      <CheckCircle className="h-3 w-3" />
                      <span>Successfully Prevented</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Impact Summary */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-200">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Overall Impact This Month
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-2">$4.2M</div>
              <div className="text-slate-600 font-medium">Total Corruption Prevented</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">156</div>
              <div className="text-slate-600 font-medium">Cases Investigated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">89%</div>
              <div className="text-slate-600 font-medium">Detection Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600 mb-2">24h</div>
              <div className="text-slate-600 font-medium">Average Response Time</div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-600 mb-4">
              Every case prevented strengthens public trust and protects valuable taxpayer resources.
            </p>
            <a 
              href="https://github.com/nikhlu07/Corruptguard"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 inline-flex items-center space-x-2"
            >
              <span>View on GitHub</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}