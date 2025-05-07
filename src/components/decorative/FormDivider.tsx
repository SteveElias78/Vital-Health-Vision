
import React from 'react';

interface FormDividerProps {
  label?: string;
  className?: string;
  pattern?: 'line' | 'diamonds' | 'zigzag';
}

export const FormDivider: React.FC<FormDividerProps> = ({ 
  label, 
  className = '', 
  pattern = 'line'
}) => {
  const renderPattern = () => {
    switch (pattern) {
      case 'diamonds':
        return (
          <div className="flex items-center space-x-2 mx-4">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className="w-2 h-2 transform rotate-45 bg-gold-500/40"
              />
            ))}
          </div>
        );
      case 'zigzag':
        return (
          <div className="flex items-center mx-4">
            {[...Array(9)].map((_, i) => (
              <div 
                key={i} 
                className={`w-2 ${i % 2 === 0 ? 'h-1' : 'h-3'} bg-gold-500/40 mx-0.5`}
              />
            ))}
          </div>
        );
      case 'line':
      default:
        return null;
    }
  };

  if (label) {
    return (
      <div className={`art-deco-separator ${className}`}>
        <div className="h-px flex-grow bg-gradient-to-r from-transparent via-gold-500/30 to-transparent"></div>
        <span className="art-deco-separator-content">{label}</span>
        <div className="h-px flex-grow bg-gradient-to-r from-transparent via-gold-500/30 to-transparent"></div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center my-6 ${className}`}>
      <div className="h-px flex-grow bg-gradient-to-r from-transparent via-gold-500/30 to-transparent"></div>
      {pattern !== 'line' && renderPattern()}
      <div className="h-px flex-grow bg-gradient-to-r from-transparent via-gold-500/30 to-transparent"></div>
    </div>
  );
};
