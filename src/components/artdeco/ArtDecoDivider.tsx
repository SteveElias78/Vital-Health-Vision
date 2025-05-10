
import React from 'react';
import { cn } from '@/lib/utils';

export interface ArtDecoDividerProps {
  className?: string;
  pattern?: 'line' | 'diamonds' | 'zigzag';
  centered?: boolean; // Added the centered property
}

export const ArtDecoDivider: React.FC<ArtDecoDividerProps> = ({ 
  className = '',
  pattern = 'line',
  centered = false  // Added with default value
}) => {
  return (
    <div className={cn("relative py-2", className, {
      "flex items-center justify-center": centered
    })}>
      <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent"></div>
      <div className={cn("absolute transform -translate-y-1/2 w-8 h-8", {
        "left-1/2 -translate-x-1/2": centered || !centered // Fixed duplicate property by using a single condition that's always true
      })}>
        <div className="w-full h-full rotate-45 border border-gold-500/30"></div>
      </div>
      
      {pattern === 'diamonds' && (
        <div className="absolute top-1/2 left-0 right-0 flex items-center justify-center space-x-12 -translate-y-1/2 pointer-events-none">
          <div className="w-2 h-2 rotate-45 border border-gold-500/30"></div>
          <div className="w-2 h-2 rotate-45 border border-gold-500/30"></div>
        </div>
      )}
      
      {pattern === 'zigzag' && (
        <div className="absolute top-1/2 left-0 right-0 flex items-center justify-center -translate-y-1/2 pointer-events-none">
          <svg width="120" height="8" viewBox="0 0 120 8" className="text-gold-500/30">
            <path d="M0,0 L20,8 L40,0 L60,8 L80,0 L100,8 L120,0" stroke="currentColor" strokeWidth="1" fill="none" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default ArtDecoDivider;
