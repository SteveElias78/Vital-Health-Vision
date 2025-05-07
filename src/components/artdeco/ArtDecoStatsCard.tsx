
import React, { ReactElement } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ArtDecoStatsCardProps {
  title: string;
  value: string | number;
  trend?: 'up' | 'down';
  trendValue?: string;
  status?: 'positive' | 'negative' | 'neutral';
  unit?: string;
  description?: string;
  icon?: ReactElement;
  className?: string;
}

export const ArtDecoStatsCard = ({ 
  title, 
  value, 
  trend, 
  trendValue, 
  status = 'neutral',
  unit = '',
  description,
  icon,
  className = '' 
}: ArtDecoStatsCardProps) => {
  // Determine trend styling
  const getTrendIcon = () => {
    if (!trend) return null;
    
    return trend === 'up' ? (
      <ArrowUp className={`h-4 w-4 ${status === 'positive' ? 'text-green-400' : 'text-red-400'}`} />
    ) : (
      <ArrowDown className={`h-4 w-4 ${status === 'positive' ? 'text-green-400' : 'text-red-400'}`} />
    );
  };
  
  return (
    <div className={cn("border border-gold-500/30 rounded-lg overflow-hidden bg-gradient-to-br from-midnight-800 to-midnight-900", className)}>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-gold-300 text-sm mb-1">{title}</h3>
            <div className="flex items-baseline">
              <span className="text-gold-400 text-2xl font-light">{value}</span>
              {unit && <span className="text-gold-300 ml-1">{unit}</span>}
            </div>
            
            {(trend || description) && (
              <div className="flex items-center mt-2 text-sm">
                {trend && getTrendIcon()}
                <span className={`${trend ? 'ml-1' : ''} ${status === 'positive' ? 'text-green-400' : status === 'negative' ? 'text-red-400' : 'text-gold-300'}`}>
                  {trendValue || description}
                </span>
              </div>
            )}
          </div>
          
          {icon && (
            <div className="w-10 h-10 rounded-full border border-gold-500/30 flex items-center justify-center bg-midnight-900">
              {React.cloneElement(icon, { className: 'h-5 w-5 text-gold-400/70' })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtDecoStatsCard;
