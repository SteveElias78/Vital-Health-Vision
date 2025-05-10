import React from 'react';
import { cn } from '@/lib/utils';

export interface ArtDecoDividerProps {
  centered?: boolean;
  className?: string;
  pattern?: 'none' | 'dots' | 'diamond' | 'diamonds' | 'line' | 'zigzag';
}

export const ArtDecoDivider = ({ 
  centered = false,
  className = '',
  pattern = 'none'
}: ArtDecoDividerProps) => {
  const renderPattern = () => {
    switch (pattern) {
      case 'diamond':
      case 'diamonds':
        return (
          <div className="w-3 h-3 transform rotate-45 bg-gold-500/20 border border-gold-500/50"></div>
        );
      case 'dots':
        return (
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-gold-500/40"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-gold-500/40"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-gold-500/40"></div>
          </div>
        );
      case 'line':
        return (
          <div className="h-px w-8 bg-gold-500/40"></div>
        );
      case 'zigzag':
        return (
          <div className="h-3 w-12 overflow-hidden relative">
            <div className="absolute inset-0 flex items-center">
              <svg width="48" height="12" viewBox="0 0 48 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 6L6 0L12 6L18 0L24 6L30 0L36 6L42 0L48 6L42 12L36 6L30 12L24 6L18 12L12 6L6 12L0 6Z" fill="rgba(234, 179, 8, 0.3)" />
              </svg>
            </div>
          </div>
        );
      default:
        return (
          <div className="w-4 h-4 rounded-full border border-gold-500/50 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-gold-500/20"></div>
          </div>
        );
    }
  };
  
  if (centered) {
    return (
      <div className={cn("flex items-center justify-center my-4", className)}>
        <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold-500/30 to-transparent"></div>
        {renderPattern()}
        <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold-500/30 to-transparent"></div>
      </div>
    );
  }
  
  return (
    <div className={cn("h-px w-full bg-gradient-to-r from-transparent via-gold-500/30 to-transparent my-4", className)}></div>
  );
};
