
import React, { ReactNode } from 'react';
import { ArtDecoRadialChart } from './ArtDecoRadialChart';
import { RadialChartDataPoint } from '@/types/visualization';
import { cn } from '@/lib/utils';

interface ArtDecoEnhancedRadialChartProps {
  data: Array<{
    name: string;
    value: number;
    color?: string;
  }>;
  title: string;
  centerText?: string;
  centerValue?: number;
  unit?: string;
  width?: number;
  height?: number;
  className?: string;
  footer?: ReactNode;
}

export const ArtDecoEnhancedRadialChart: React.FC<ArtDecoEnhancedRadialChartProps> = ({
  data,
  title,
  centerText,
  centerValue,
  unit = '',
  width = 400,
  height = 400,
  className,
  footer
}) => {
  // Format the center label
  let centerLabel = centerText || '';
  if (centerValue !== undefined) {
    centerLabel = `${centerLabel}${centerLabel ? ': ' : ''}${centerValue}${unit}`;
  }
  
  // Convert data format to match RadialChartDataPoint
  const chartData: RadialChartDataPoint[] = data.map(item => ({
    category: item.name,
    value: item.value,
    color: item.color,
    name: item.name
  }));
  
  return (
    <div className={cn("border border-gold-500/30 rounded-lg overflow-hidden bg-gradient-to-br from-midnight-900 to-midnight-950", className)}>
      <div className="bg-gradient-to-r from-midnight-800 to-midnight-900 border-b border-gold-500/30 p-4">
        <h2 className="text-xl font-light text-gold-400">{title}</h2>
        <p className="text-sm text-gold-300/70">
          {`${data.length} data points analyzed`}
        </p>
      </div>
      
      <div className="p-4 flex justify-center">
        <ArtDecoRadialChart
          data={chartData}
          width={width}
          height={height}
          centerText={centerLabel}
        />
      </div>
      
      {/* Legend */}
      <div className="px-4 pb-4 flex flex-wrap gap-3 justify-center">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-sm text-gold-300">
              {item.name}: {item.value}{unit}
            </span>
          </div>
        ))}
      </div>
      
      {footer && (
        <div className="p-4 border-t border-gold-500/20">
          {footer}
        </div>
      )}
      
      {/* Art Deco decorative corner elements */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gold-500/50"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gold-500/50"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gold-500/50"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gold-500/50"></div>
    </div>
  );
};

export default ArtDecoEnhancedRadialChart;
