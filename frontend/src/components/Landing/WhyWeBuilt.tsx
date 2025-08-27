import React from 'react';
import { AlertTriangle, Heart, Shield, Clock, FileX, Users, MapPin } from 'lucide-react';

export function WhyWeBuilt() {
  return (
    <section className="bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-red-100 rounded-full">
              <Heart className="h-12 w-12 text-red-600" />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why We Built <span className="text-red-600">CorruptGuard</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A preventable tragedy that shook our nation and revealed the deadly cost of procurement corruption
          </p>
        </div>

        {/* The Tragedy */}
        <div className="bg-white rounded-2xl shadow-lg border border-red-200 p-8 mb-12">
          <div className="flex items-start space-x-4 mb-6">
            <div className="p-3 bg-red-100 rounded-full flex-shrink-0">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Jhalawar School Roof Collapse
              </h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>Rajasthan, India</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>July 25, 2025</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* The Human Cost */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">The Human Cost</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-gray-800"><strong>7 children killed</strong> during morning prayers</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-800"><strong>27-29 children injured</strong> in the collapse</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-800"><strong>Warning signs ignored</strong> - students reported falling gravel</span>
                </div>
              </div>
            </div>

            {/* The System Failure */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">The System Failure</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <FileX className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-800"><strong>₹4.28 crores</strong> sanctioned for repairs stuck in files</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <Users className="h-5 w-5 text-purple-600" />
                  <span className="text-gray-800"><strong>5 education officials suspended</strong> after the tragedy</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="text-gray-800"><strong>Human Rights Commission</strong> demanded immediate action</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quote */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg border-l-4 border-red-500">
            <blockquote className="text-lg italic text-gray-700">
              "The children had been warning their teachers about falling gravel from the ceiling for days. 
              The money was sanctioned, the repairs were approved, but bureaucratic delays and hidden paperwork 
              meant those funds never reached the school. Seven lives could have been saved."
            </blockquote>
            <div className="mt-3 text-sm text-gray-600">
              — Sources: AP News & Livemint, July 2025
            </div>
          </div>
        </div>

        {/* The Problem */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">The Real Problem</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-2 bg-red-100 rounded-lg">
                  <FileX className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Hidden Paperwork</h4>
                  <p className="text-gray-600 text-sm">Funds disappear in bureaucratic files with no transparency</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Delayed Funds</h4>
                  <p className="text-gray-600 text-sm">Critical repairs delayed while lives hang in balance</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">No Accountability</h4>
                  <p className="text-gray-600 text-sm">Officials suspended only after tragedy strikes</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Procurement Data Failures</h4>
                  <p className="text-gray-600 text-sm">No real-time tracking of fund allocation and usage</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Solution</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-red-900">Immutable Budget Logs</h4>
                  <p className="text-red-700 text-sm">Every rupee tracked on blockchain - no hidden files</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="p-2 bg-green-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-green-900">Live Fraud Detection</h4>
                  <p className="text-green-700 text-sm">AI prevents corruption before funds are misallocated</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-purple-900">Geo-Proof Verification</h4>
                  <p className="text-purple-700 text-sm">GPS-verified project completion and fund utilization</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-orange-900">Public Oversight</h4>
                  <p className="text-orange-700 text-sm">Citizens monitor every transaction in real-time</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-4">Never Again</h3>
          <p className="text-xl mb-6 opacity-90">
            Every day we delay, more lives are at risk. Government transparency isn't optional—it's a matter of life and death.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://github.com/nikhlu07/Corruptguard"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center space-x-2"
            >
              <span>View on GitHub</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a 
              href="https://github.com/nikhlu07/Corruptguard"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition-colors inline-flex items-center space-x-2"
            >
              <span>View Source Code</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
          
          {/* Sources */}
          <div className="mt-8 pt-6 border-t border-blue-400 text-sm opacity-80">
            <p>Sources: <em>AP News</em> & <em>Livemint</em>, July 25, 2025 - Jhalawar School Roof Collapse Coverage</p>
          </div>
        </div>
      </div>
    </section>
  );
}