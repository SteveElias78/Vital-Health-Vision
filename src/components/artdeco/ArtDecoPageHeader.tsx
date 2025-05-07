
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface ArtDecoPageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  className?: string;
  actions?: ReactNode;
}

export const ArtDecoPageHeader = ({ 
  title, 
  subtitle,
  className = '',
  actions
}: ArtDecoPageHeaderProps) => {
  return (
    <div className={cn("border-b border-gold-500/30 pb-4 mb-6", className)}>
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-light text-gold-400">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-gold-300/70">
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div className="ml-4">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};
