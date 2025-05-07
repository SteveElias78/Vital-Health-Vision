
import React from 'react';

interface GeometricDividerProps {
  className?: string;
  pattern?: 'triangles' | 'squares' | 'diamonds' | 'zigzag' | 'chevron';
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export const GeometricDivider: React.FC<GeometricDividerProps> = ({ 
  className = '', 
  pattern = 'diamonds',
  size = 'md',
  color = 'gold-500'
}) => {
  // Size mapping
  const sizeMap = {
    sm: { width: 'w-2', height: 'h-2', spacing: 'mx-1' },
    md: { width: 'w-3', height: 'h-3', spacing: 'mx-2' },
    lg: { width: 'w-4', height: 'h-4', spacing: 'mx-3' },
  };
  
  // Get size values
  const { width, height, spacing } = sizeMap[size];
  
  // Number of elements based on pattern
  const elementCount = pattern === 'zigzag' ? 9 : 7;
  
  // Generate pattern elements based on type
  let patternElements: JSX.Element[] = [];
  
  switch(pattern) {
    case 'triangles':
      patternElements = Array(elementCount).fill(0).map((_, i) => (
        <div 
          key={i} 
          className={`${width} ${height} transform rotate-45 bg-${color}/30 ${spacing}`}
          style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }}
        />
      ));
      break;
    case 'squares':
      patternElements = Array(elementCount).fill(0).map((_, i) => (
        <div 
          key={i} 
          className={`${width} ${height} border border-${color}/50 ${spacing}`}
        />
      ));
      break;
    case 'zigzag':
      patternElements = Array(elementCount).fill(0).map((_, i) => (
        <div 
          key={i} 
          className={`${width} ${i % 2 === 0 ? 'h-1' : height} bg-${color}/40 ${spacing}`}
        />
      ));
      break;
    case 'chevron':
      patternElements = Array(elementCount).fill(0).map((_, i) => (
        <div 
          key={i} 
          className={`${width} ${height} bg-${color}/40 ${spacing} transform ${i % 2 === 0 ? 'rotate-45' : '-rotate-45'}`}
        />
      ));
      break;
    case 'diamonds':
    default:
      patternElements = Array(elementCount).fill(0).map((_, i) => (
        <div 
          key={i} 
          className={`${width} ${height} transform rotate-45 bg-${color}/40 ${spacing}`}
        />
      ));
      break;
  }
  
  return (
    <div className={`flex items-center justify-center my-8 ${className}`}>
      <div className={`h-px bg-gradient-to-r from-transparent via-${color}/30 to-transparent flex-grow`} />
      <div className="flex items-center mx-4">
        {patternElements}
      </div>
      <div className={`h-px bg-gradient-to-r from-transparent via-${color}/30 to-transparent flex-grow`} />
    </div>
  );
};
