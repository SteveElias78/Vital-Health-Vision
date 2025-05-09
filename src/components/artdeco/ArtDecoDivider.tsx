
import React from 'react';
import { cn } from '@/lib/utils';

interface ArtDecoDividerProps {
  className?: string;
}

export const ArtDecoDivider: React.FC<ArtDecoDividerProps> = ({ 
  className = ''
}) => {
  return (
    <div className={cn("relative py-2", className)}>
      <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent"></div>
      <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8">
        <div className="w-full h-full rotate-45 border border-gold-500/30"></div>
      </div>
    </div>
  );
};
