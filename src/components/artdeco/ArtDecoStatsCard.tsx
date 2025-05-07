
import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface ArtDecoStatsCardProps {
  title: string;
  value: string | number;
  trend?: 'up' | 'down';
  trendValue?: string;
  status?: 'positive' | 'negative' | 'neutral';
  unit?: string;
  className?: string;
}

export const ArtDecoStatsCard: React.FC<ArtDecoStatsCardProps> = ({ 
  title, 
  value, 
  trend, 
  trendValue, 
  status = 'neutral', 
  unit = '',
  className = ''
}) => {
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
    <div className={`border border-gold-500/30 rounded-lg overflow-hidden bg-gradient-to-br from-midnight-800 to-midnight-900 ${className}`}>
      <div className="p-4">
        <h3 className="text-gold-300 text-sm mb-1">{title}</h3>
        <div className="flex items-baseline">
          <span className="text-gold-400 text-2xl font-light">{value}</span>
          {unit && <span className="text-gold-300 ml-1">{unit}</span>}
        </div>
        
        {trend && (
          <div className="flex items-center mt-2 text-sm">
            {getTrendIcon()}
            <span className={`ml-1 ${status === 'positive' ? 'text-green-400' : status === 'negative' ? 'text-red-400' : 'text-gold-300'}`}>
              {trendValue}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtDecoStatsCard;
