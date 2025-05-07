
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface ArtDecoCardHeaderProps {
  title?: ReactNode;
  description?: ReactNode;
  className?: string;
  extra?: ReactNode;
}

export const ArtDecoCardHeader = ({ 
  title, 
  description, 
  className = '',
  extra
}: ArtDecoCardHeaderProps) => {
  return (
    <div className={cn(
      "bg-gradient-to-r from-midnight-800 to-midnight-900 border-b border-gold-500/30 p-4",
      className
    )}>
      <div className="flex justify-between items-center">
        <div>
          {title && <h3 className="text-xl font-light text-gold-400">{title}</h3>}
          {description && <p className="text-sm text-gold-300/70">{description}</p>}
        </div>
        {extra && <div>{extra}</div>}
      </div>
    </div>
  );
};
