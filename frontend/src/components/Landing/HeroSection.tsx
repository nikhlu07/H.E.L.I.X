import React, { useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  const [demoStep, setDemoStep] = useState<'start' | 'scanning' | 'found' | 'resolved'>('start');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const runDemo = () => {
    setDemoStep('scanning');
    setTimeout(() => setDemoStep('found'), 2000);
    setTimeout(() => setDemoStep('resolved'), 4000);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src="/logo.svg" alt="CorruptGuard Logo" className="w-10 h-10" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CorruptGuard
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <span className="text-gray-600 font-medium">ICP-Powered Anti-Corruption Platform</span>
            </div>

            <div className="flex items-center space-x-4">
              <a 
                href="https://github.com/nikhlu07/Corruptguard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 font-medium border border-gray-300 px-4 py-2 rounded-lg transition-all hover:border-blue-300 hover:bg-blue-50"
              >
                View on GitHub
              </a>
              <button 
                onClick={onGetStarted}
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center overflow-hidden">
        {/* Unique Background */}
        <div className="absolute inset-0">
          {/* Gradient Mesh */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"></div>
          
          {/* Floating Geometric Shapes */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-30 blur-lg animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-br from-indigo-200 to-blue-200 rounded-full opacity-25 blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
          
          {/* Data Flow Lines */}
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent opacity-30"></div>
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent opacity-30"></div>
          <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent opacity-30"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Side - Content */}
            <div className="space-y-10">
              <div>
                                  <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                    <div className="w-4 h-4 bg-blue-600 rounded-full relative">
                      <div className="absolute inset-1 bg-white rounded-full"></div>
                    </div>
                    <span>ICP + AI-Powered Security</span>
                  </div>
                
                <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
                  Stop Corruption
                  <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    Before It Starts
                  </span>
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed mb-10 max-w-lg">
                  Revolutionary ICP-powered blockchain system that detects government procurement fraud in real-time. 
                  Deploy instantly with immutable transparency and 87% accuracy.
                </p>
              </div>

              {/* CTA Button */}
              <div className="flex flex-col sm:flex-row gap-6">
                <button 
                  onClick={onGetStarted}
                  className="group bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white px-10 py-5 rounded-2xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3"
                >
                  <span>Start Protecting Now</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </button>
                <a 
                  href="https://github.com/nikhlu07/Corruptguard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-gradient-to-r from-gray-600 to-gray-700 text-white px-10 py-5 rounded-2xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3"
                >
                  <span>View on GitHub</span>
                  <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">87%</div>
                  <div className="text-gray-600 text-sm">Detection Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">2.4s</div>
                  <div className="text-gray-600 text-sm">ICP Response</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">100%</div>
                  <div className="text-gray-600 text-sm">Immutable</div>
                </div>
              </div>
            </div>

            {/* Right Side - Clean Visual */}
            <div className="relative">
              {/* Main Illustration Area */}
              <div className="bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50"></div>
                
                <div className="relative z-10">
                  {/* TODO: Replace with Icons8 illustration */}
                  {/* Recommended: https://icons8.com/illustrations/style--3d-casual */}
                  {/* Search for: "data analysis", "security shield", "transparency" */}
                  <div className="text-center mb-6">
                    <div className="w-64 h-48 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mb-4 relative overflow-hidden">
                      {/* Simple illustration placeholder */}
                      <div className="text-center">
                        <div className="relative">
                          {/* Shield with data visualization */}
                          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-sm"></div>
                            </div>
                          </div>
                          {/* Floating data points */}
                          <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                          <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                          <div className="absolute top-1/2 -right-4 w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                        </div>
                        <div className="text-gray-600 text-sm font-medium">ICP-Powered Blockchain Security</div>
                      </div>
                    </div>
                  </div>

                  {/* Simple Demo Status */}
                  <div className="text-center mb-6">
                    {demoStep === 'start' && (
                      <div>
                        <div className="w-3 h-3 bg-gray-400 rounded-full mx-auto mb-2"></div>
                        <p className="text-gray-600 text-sm">ICP Blockchain Ready</p>
                      </div>
                    )}
                    
                    {demoStep === 'scanning' && (
                      <div>
                        <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-2 animate-pulse"></div>
                        <p className="text-blue-600 text-sm">Validating on ICP...</p>
                      </div>
                    )}
                    
                    {demoStep === 'found' && (
                      <div>
                        <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-2"></div>
                        <p className="text-red-600 text-sm">Fraud detected on chain</p>
                      </div>
                    )}
                    
                    {demoStep === 'resolved' && (
                      <div>
                        <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                        <p className="text-green-600 text-sm">Immutable record created</p>
                      </div>
                    )}
                  </div>

                  {/* Demo Button */}
                  <button
                    onClick={runDemo}
                    disabled={demoStep !== 'start' && demoStep !== 'resolved'}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mb-3"
                  >
                    {demoStep === 'start' && 'Try ICP Demo'}
                    {demoStep === 'scanning' && 'Validating...'}
                    {demoStep === 'found' && 'Fraud Detected!'}
                    {demoStep === 'resolved' && 'Try Again'}
                  </button>
                  <a 
                    href="https://github.com/nikhlu07/Corruptguard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <span>View Source Code</span>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}