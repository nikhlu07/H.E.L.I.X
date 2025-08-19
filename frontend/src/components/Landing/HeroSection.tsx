import { Shield, AlertTriangle, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-800 overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center space-y-8">
          {/* Alert Badge */}
          <div className="inline-flex items-center space-x-2 bg-red-500/20 backdrop-blur-sm rounded-full px-4 py-2 border border-red-400/30">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <span className="text-red-200 text-sm font-medium">🇮🇳 Fighting Real Corruption in India</span>
          </div>

          {/* Logo and Main Heading */}
          <div className="space-y-6">
            <div className="flex items-center justify-center space-x-4">
              <div className="w-20 h-20">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  {/* Background Circle */}
                  <circle cx="40" cy="40" r="35" fill="url(#cg-backgroundGradient)" stroke="url(#cg-borderGradient)" strokeWidth="2"/>
                  
                  {/* Shield Icon */}
                  <g transform="translate(20, 12)">
                    {/* Main Shield */}
                    <path d="M20 8 L30 12 L30 32 Q30 42 20 48 Q10 42 10 32 L10 12 Z" fill="url(#cg-shieldGradient)" stroke="white" strokeWidth="1" opacity="0.95"/>
                    
                    {/* Guard Cross */}
                    <g transform="translate(20, 28)" opacity="0.9">
                      <line x1="0" y1="-8" x2="0" y2="8" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                      <line x1="-6" y1="0" x2="6" y2="0" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                      <circle cx="0" cy="0" r="2" fill="white"/>
                    </g>
                    
                    {/* AI Detection Lines */}
                    <g opacity="0.7">
                      <line x1="15" y1="18" x2="25" y2="18" stroke="#FFD700" strokeWidth="1"/>
                      <line x1="15" y1="22" x2="25" y2="22" stroke="#FFD700" strokeWidth="1"/>
                      <line x1="15" y1="26" x2="25" y2="26" stroke="#FFD700" strokeWidth="1"/>
                      <line x1="15" y1="30" x2="25" y2="30" stroke="#FFD700" strokeWidth="1"/>
                    </g>
                  </g>
                  
                  {/* Corruption Detection Radar */}
                  <g transform="translate(40, 40)" opacity="0.6">
                    <circle cx="0" cy="0" r="25" stroke="url(#cg-radarGradient)" strokeWidth="1" fill="none"/>
                    <circle cx="0" cy="0" r="30" stroke="url(#cg-radarGradient)" strokeWidth="0.5" fill="none"/>
                    <line x1="-30" y1="0" x2="30" y2="0" stroke="url(#cg-radarGradient)" strokeWidth="0.5"/>
                    <line x1="0" y1="-30" x2="0" y2="30" stroke="url(#cg-radarGradient)" strokeWidth="0.5"/>
                  </g>
                  
                  {/* Warning Indicator */}
                  <g transform="translate(55, 55)">
                    <polygon points="10,3 17,13 3,13" fill="url(#cg-warningGradient)" opacity="0.9"/>
                    <text x="10" y="11" fontFamily="Arial, sans-serif" fontSize="6" fontWeight="bold" fill="white" textAnchor="middle">!</text>
                  </g>
                  
                  {/* Gradients */}
                  <defs>
                    <linearGradient id="cg-backgroundGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1E40AF" stopOpacity="1" />
                      <stop offset="50%" stopColor="#DC2626" stopOpacity="1" />
                      <stop offset="100%" stopColor="#1F2937" stopOpacity="1" />
                    </linearGradient>
                    
                    <linearGradient id="cg-borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#60A5FA" stopOpacity="1" />
                      <stop offset="100%" stopColor="#F87171" stopOpacity="1" />
                    </linearGradient>
                    
                    <linearGradient id="cg-shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="1" />
                      <stop offset="50%" stopColor="#059669" stopOpacity="1" />
                      <stop offset="100%" stopColor="#047857" stopOpacity="1" />
                    </linearGradient>
                    
                    <linearGradient id="cg-radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFD700" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#FFA500" stopOpacity="0.4" />
                    </linearGradient>
                    
                    <linearGradient id="cg-warningGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#F59E0B" stopOpacity="1" />
                      <stop offset="100%" stopColor="#DC2626" stopOpacity="1" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h1 className="text-6xl lg:text-7xl font-bold text-white tracking-tight">
                Corrupt<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">Guard</span>
              </h1>
            </div>
            <p className="text-2xl lg:text-3xl text-red-100 font-medium">
              Because Transparency Can't Wait for Another Tragedy
            </p>
          </div>

          {/* Shocking Statistics */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto border border-red-400/20">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-red-400 mb-2">₹5,400 Cr</div>
                <div className="text-slate-300 text-sm">PCI scam: 870 fake colleges approved in 13 days</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-amber-400 mb-2">900+</div>
                <div className="text-slate-300 text-sm">NAAC reviewers removed for taking bribes</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-400 mb-2">1 Life</div>
                <div className="text-slate-300 text-sm">Journalist killed exposing road scam in Chhattisgarh</div>
              </div>
            </div>
          </div>

          {/* Problem Statement */}
          <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
            Every approval happens in darkness. Every contract in secret. Every payment without oversight.
            <br />
            <span className="text-red-400 font-semibold">CorruptGuard brings everything into the light.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <button
              onClick={onGetStarted}
              className="group bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center justify-center space-x-2"
            >
              <span>See How It Works</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <a href="#transparency" className="group bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/30 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Explore Transparency</span>
            </a>
          </div>

          {/* ICP Power */}
          <div className="pt-12 bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 max-w-3xl mx-auto border border-emerald-400/20">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <span className="text-emerald-200 font-semibold text-lg">Powered by Internet Computer Protocol</span>
            </div>
            <p className="text-slate-300 text-sm">
              Immutable records • Public auditability • Real-time fraud detection • Unstoppable transparency
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}