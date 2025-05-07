
import React from 'react';
import { cn } from '@/lib/utils';

export interface ArtDecoFooterProps {
  text?: string;
  children?: React.ReactNode;
  className?: string;
  decorative?: boolean;
}

export const ArtDecoFooter: React.FC<ArtDecoFooterProps> = ({
  text = "Vital Health Vision • The Art of Health Analytics",
  children,
  className,
  decorative = true
}) => {
  return (
    <footer className={cn(
      "border-t border-gold-500/30 bg-midnight-900 py-2 text-center text-xs text-gold-300/70",
      className
    )}>
      {children ? (
        children
      ) : (
        <div className="flex items-center justify-center space-x-2">
          {decorative && (
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent"></div>
          )}
          <span>{text}</span>
          {decorative && (
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent"></div>
          )}
        </div>
      )}
    </footer>
  );
};

export default ArtDecoFooter;
