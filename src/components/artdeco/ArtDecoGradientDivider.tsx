
import React from 'react';
import { cn } from '@/lib/utils';

export interface ArtDecoGradientDividerProps {
  text?: string;
  className?: string;
  gradientClassName?: string;
  textClassName?: string;
  pattern?: 'none' | 'diamonds' | 'zigzag' | 'dots';
}

export const ArtDecoGradientDivider: React.FC<ArtDecoGradientDividerProps> = ({
  text,
  className,
  gradientClassName,
  textClassName,
  pattern = 'none'
}) => {
  const renderPattern = () => {
    switch (pattern) {
      case 'diamonds':
        return (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 transform rotate-45 bg-gold-500/80"></div>
            <div className="w-2 h-2 transform rotate-45 bg-gold-500/80"></div>
            <div className="w-2 h-2 transform rotate-45 bg-gold-500/80"></div>
          </div>
        );
      case 'zigzag':
        return (
          <svg width="60" height="8" viewBox="0 0 60 8" className="overflow-visible">
            <path 
              d="M0,0 L10,8 L20,0 L30,8 L40,0 L50,8 L60,0" 
              stroke="rgba(255, 199, 0, 0.8)" 
              strokeWidth="1.5" 
              fill="none" 
            />
          </svg>
        );
      case 'dots':
        return (
          <div className="flex items-center space-x-3">
            <div className="w-1.5 h-1.5 rounded-full bg-gold-500/80"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-gold-500/80"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-gold-500/80"></div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={cn("relative flex items-center py-4", className)}>
      <div className={cn(
        "flex-grow h-px bg-gradient-to-r from-transparent via-gold-500/60 to-transparent",
        gradientClassName
      )}></div>
      
      {(text || pattern !== 'none') && (
        <div className={cn(
          "px-4 flex items-center gap-3",
          textClassName
        )}>
          {pattern !== 'none' && renderPattern()}
          {text && (
            <span className="text-gold-400/90 font-light tracking-wide text-sm">
              {text}
            </span>
          )}
          {pattern !== 'none' && renderPattern()}
        </div>
      )}
      
      <div className={cn(
        "flex-grow h-px bg-gradient-to-r from-gold-500/60 via-transparent to-transparent",
        gradientClassName
      )}></div>
    </div>
  );
};
