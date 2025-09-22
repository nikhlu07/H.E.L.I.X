import React from 'react';

interface CulturalWrapperProps {
  children: React.ReactNode;
  variant?: 'default' | 'badge' | 'card' | 'text';
  culturalLevel?: 'light' | 'medium' | 'heavy';
  className?: string;
}

export default function CulturalWrapper({
  children,
  variant = 'default',
  culturalLevel = 'medium',
  className = ''
}: CulturalWrapperProps) {
  const getVariantClasses = (): string => {
    switch (variant) {
      case 'badge':
        return 'cultural-badge';
      case 'card':
        return 'cultural-card';
      case 'text':
        return 'cultural-text';
      default:
        return 'cultural-default';
    }
  };

  const getCulturalLevelClasses = (): string => {
    switch (culturalLevel) {
      case 'light':
        return 'cultural-level-light';
      case 'heavy':
        return 'cultural-level-heavy';
      default:
        return 'cultural-level-medium';
    }
  };

  return (
    <div className={`${getVariantClasses()} ${getCulturalLevelClasses()} ${className}`}>
      {children}
    </div>
  );
}