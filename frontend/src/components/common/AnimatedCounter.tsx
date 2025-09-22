import React, { useState, useEffect } from 'react';

interface AnimatedCounterProps {
  target: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  formatter?: (value: number) => string;
}

export function AnimatedCounter({ 
  target, 
  duration = 2000, 
  prefix = '', 
  suffix = '',
  formatter 
}: AnimatedCounterProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const startValue = 0;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(startValue + (target - startValue) * easeOut);
      
      setCurrent(value);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }, [target, duration]);

  const formatValue = (value: number) => {
    if (formatter) return formatter(value);
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toString();
  };

  return (
    <span className="font-bold">
      {prefix}{formatValue(current)}{suffix}
    </span>
  );
}