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
          {successStories.map((story, index) => {
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
            <button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105">
              View All Success Stories
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}