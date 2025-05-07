
import React from 'react';

interface GeometricDividerProps {
  pattern?: 'diamonds' | 'zigzag' | 'dots' | 'line' | 'triangles' | 'squares' | 'chevron';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * An Art Deco styled geometric divider component
 * Provides various decorative pattern options for section dividers
 */
export const GeometricDivider: React.FC<GeometricDividerProps> = ({ 
  pattern = 'diamonds',
  className = '',
  size = 'md'
}) => {
  // Get size-based styling
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'my-3 scale-75';
      case 'lg': return 'my-8 scale-125';
      case 'md':
      default: return 'my-6';
    }
  };

  // Render different divider patterns based on the pattern prop
  const renderPattern = () => {
    switch (pattern) {
      case 'diamonds':
        return (
          <div className="flex items-center justify-center">
            <div className="art-deco-diamond mx-2"></div>
            <div className="art-deco-diamond mx-2"></div>
            <div className="art-deco-diamond mx-2"></div>
          </div>
        );
      
      case 'zigzag':
        return (
          <div className="flex items-center justify-center h-4 overflow-hidden">
            <svg width="300" height="8" viewBox="0 0 300 8" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M0,0 L20,8 L40,0 L60,8 L80,0 L100,8 L120,0 L140,8 L160,0 L180,8 L200,0 L220,8 L240,0 L260,8 L280,0 L300,8" 
                stroke="rgba(255, 199, 0, 0.5)" 
                strokeWidth="1" 
                fill="none" 
              />
            </svg>
          </div>
        );
      
      case 'dots':
        return (
          <div className="flex items-center justify-center">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className="h-2 w-2 rounded-full bg-gold-500/80 mx-3"
              ></div>
            ))}
          </div>
        );
      
      case 'triangles':
        return (
          <div className="flex items-center justify-center">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-l-transparent border-r-transparent border-b-gold-500/80 mx-3"
              />
            ))}
          </div>
        );
      
      case 'squares':
        return (
          <div className="flex items-center justify-center">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className="w-3 h-3 bg-gold-500/80 mx-3 rotate-45"
              />
            ))}
          </div>
        );
      
      case 'chevron':
        return (
          <div className="flex items-center justify-center h-4 overflow-hidden">
            <svg width="300" height="12" viewBox="0 0 300 12" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M0,0 L30,12 L60,0 L90,12 L120,0 L150,12 L180,0 L210,12 L240,0 L270,12 L300,0" 
                stroke="rgba(255, 199, 0, 0.5)" 
                strokeWidth="1.5" 
                fill="none" 
              />
            </svg>
          </div>
        );
      
      case 'line':
      default:
        return (
          <div className="h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent"></div>
        );
    }
  };

  return (
    <div className={`art-deco-separator w-full ${getSizeClasses()} ${className}`}>
      <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent"></div>
      {renderPattern()}
      <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent"></div>
    </div>
  );
};

export default GeometricDivider;
