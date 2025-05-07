
import React from 'react';

interface GeometricDividerProps {
  className?: string;
  pattern?: 'triangles' | 'squares' | 'diamonds';
}

export const GeometricDivider: React.FC<GeometricDividerProps> = ({ 
  className = '', 
  pattern = 'diamonds' 
}) => {
  let patternElements: JSX.Element[] = [];
  
  switch(pattern) {
    case 'triangles':
      patternElements = Array(7).fill(0).map((_, i) => (
        <div 
          key={i} 
          className="w-3 h-3 transform rotate-45 bg-gold-500/30 mx-2"
        />
      ));
      break;
    case 'squares':
      patternElements = Array(5).fill(0).map((_, i) => (
        <div 
          key={i} 
          className="w-3 h-3 border border-gold-500/50 mx-2"
        />
      ));
      break;
    case 'diamonds':
    default:
      patternElements = Array(7).fill(0).map((_, i) => (
        <div 
          key={i} 
          className="w-2 h-2 transform rotate-45 bg-gold-500/40 mx-2"
        />
      ));
      break;
  }
  
  return (
    <div className={`flex items-center justify-center my-8 ${className}`}>
      <div className="h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent flex-grow" />
      <div className="flex items-center mx-4">
        {patternElements}
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent flex-grow" />
    </div>
  );
};
