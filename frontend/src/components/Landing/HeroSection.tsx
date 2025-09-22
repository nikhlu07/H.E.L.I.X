import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCulturalAdaptation } from '../../hooks/useCulturalAdaptation';
import CulturalWrapper from '../common/CulturalWrapper';

interface HeroSectionProps {
  onGetStarted: () => void;
  onTryDemo?: () => void;
  onMultiCountryDemo?: () => void;
}

export function HeroSection({ onGetStarted, onTryDemo, onMultiCountryDemo }: HeroSectionProps) {
  const { t } = useTranslation();
  const { colors, icons, phrases, formatNumber } = useCulturalAdaptation();

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
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{icons.flag}</span>
                <span className="text-helix-gray-300 font-semibold">{t('branding.title')}</span>
                <span className="text-primary text-sm">• {t('branding.tagline')}</span>
              </div>
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
                <CulturalWrapper variant="default" culturalLevel="light">
                  <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight cultural-heading">
                    {t('branding.title')}
                  </h1>
                </CulturalWrapper>
                
                <p className="text-xl text-helix-gray-300 leading-relaxed mb-8 max-w-lg">
                  {t('branding.subtitle')}
                </p>

                <div className="flex flex-wrap gap-4 mb-8">
                  <CulturalWrapper variant="badge" className="flex items-center space-x-2 px-4 py-2 rounded-full">
                    <span>{icons.legal}</span>
                    <span className="text-sm">RTI Act Compliant</span>
                  </CulturalWrapper>
                  <CulturalWrapper variant="badge" className="flex items-center space-x-2 px-4 py-2 rounded-full">
                    <span>{icons.transparency}</span>
                    <span className="text-sm">ICP Blockchain Secured</span>
                  </CulturalWrapper>
                  <CulturalWrapper variant="badge" className="flex items-center space-x-2 px-4 py-2 rounded-full">
                    <span>{icons.flag}</span>
                    <span className="text-sm">Pan-India Ready</span>
                  </CulturalWrapper>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={onTryDemo || onGetStarted}
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
                
                {/* Multi-Country Demo Button */}
                <div className="flex justify-center">
                  <button 
                    onClick={onMultiCountryDemo}
                    className="group bg-gradient-to-r from-orange-500 to-green-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3"
                  >
                    <span className="text-lg">🌍</span>
                    <span>Global Scalability Demo</span>
                    <span className="text-sm bg-white bg-opacity-20 px-2 py-1 rounded">India → World</span>
                  </button>
                </div>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-helix-gray-800">
                <div className="text-center">
                  <div className="text-2xl font-bold cultural-text-primary mb-1">
                    {icons.currency}{formatNumber(4200000000)}
                  </div>
                  <div className="text-helix-gray-400 text-sm">{t('corruption.prevented')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold cultural-text-primary mb-1">{formatNumber(750)}+</div>
                  <div className="text-helix-gray-400 text-sm">Districts Covered</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold cultural-text-primary mb-1">24/7</div>
                  <div className="text-helix-gray-400 text-sm">RTI Monitoring</div>
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
