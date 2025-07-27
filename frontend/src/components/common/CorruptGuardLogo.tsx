import React from 'react';

interface CorruptGuardLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CorruptGuardLogo({ size = 'md', className = '' }: CorruptGuardLogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  };

  return (
    <div className={`${sizeClasses[size]} flex items-center justify-center ${className}`}>
      <svg 
        width="80" 
        height="80" 
        viewBox="0 0 80 80" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className="w-full h-full"
      >
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
  );
}