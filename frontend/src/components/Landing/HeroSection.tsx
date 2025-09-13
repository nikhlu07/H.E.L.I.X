import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <div className="min-h-screen bg-helix-dark text-foreground">
      {/* Header */}
      <div className="border-b border-helix-gray-800">

        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl font-bold text-white">
                H<span className="text-primary">.</span>E<span className="text-primary">.</span>L<span className="text-primary">.</span>I<span className="text-primary">.</span>X<span className="text-primary">.</span>
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <span className="text-helix-gray-400 font-medium">Humanitarian Economic Logistics & Integrity Xchange</span>
            </div>

            <div className="flex items-center space-x-4">
              <button 
                onClick={onGetStarted}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-helix-accent-dark transition-all duration-200 font-bold"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative min-h-[calc(100vh-65px)] flex items-center">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Side - Content */}
            <div className="space-y-8">
              <div>
                <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
                  Humanitarian Xchange
                  <span className="block text-primary">
                    Built on Integrity
                  </span>
                </h1>
                
                <p className="text-xl text-helix-gray-300 leading-relaxed mb-8 max-w-lg">
                  A revolutionary ICP-powered blockchain system that ensures transparent and efficient delivery of humanitarian aid.
                  Deploy instantly with immutable transparency and real-time fraud detection.
                </p>

                <div className="flex space-x-4 mb-8">
                  <p className="text-lg text-helix-gray-100">ICP-Powered Blockchain Security</p>
                  <p className="text-lg text-helix-gray-100">ICP Blockchain Ready</p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex items-center space-x-4">
                <button 
                  onClick={onGetStarted}
                  className="group bg-primary text-primary-foreground px-10 py-5 rounded-2xl font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3"
                >
                  <span>Try ICP Demo</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </button>
                <a 
                  href="https://github.com/nikhlu07/H.E.L.I.X."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-transparent border border-helix-gray-700 text-helix-gray-300 px-10 py-5 rounded-2xl font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3"
                >
                  <span>View Source Code</span>
                </a>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-helix-gray-800">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">99.8%</div>
                  <div className="text-helix-gray-400 text-sm">Delivery Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">1.2s</div>
                  <div className="text-helix-gray-400 text-sm">ICP Response</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">100%</div>
                  <div className="text-helix-gray-400 text-sm">Immutable</div>
                </div>
              </div>
            </div>

            {/* Right Side - 3D Shield */}
            <div className="relative flex items-center justify-center">
              <div className="relative w-80 h-80">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-helix-accent-dark rounded-full blur-2xl opacity-30"></div>
                {/*<HelixIcon className="w-full h-full text-primary drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]" strokeWidth={1} />*/}
                {/*  <Helix className="w-full h-ful text-primary drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]" />;*/}
                  <img
  src="/favicon.svg"
  alt="Helix"
  className="w-full h-full text-primary drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]"
/>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
