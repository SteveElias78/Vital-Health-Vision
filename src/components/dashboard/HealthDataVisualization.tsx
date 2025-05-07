
import React from 'react';
import { ArtDecoRadialChart } from '@/components/artdeco/ArtDecoRadialChart';

export interface HealthDataPoint {
  name: string;
  value: number;
  color: string;
}

interface HealthDataVisualizationProps {
  data: HealthDataPoint[];
  title: string;
  subtitle?: string;
  centerLabel?: string;
  centerText?: string;
  centerValue?: number;
  unit?: string;
  source?: string;
  lastUpdated?: string;
}

export const HealthDataVisualization: React.FC<HealthDataVisualizationProps> = ({
  data,
  title,
  subtitle,
  centerLabel,
  centerText,
  centerValue,
  unit = "",
  source,
  lastUpdated
}) => {
  // Format the center label if centerText and centerValue are provided
  const formattedCenterLabel = centerLabel || 
    (centerText && centerValue !== undefined ? 
      `${centerText}: ${centerValue}${unit}` : undefined);
  
  return (
    <div className="border border-gold-500/30 rounded-lg overflow-hidden bg-gradient-to-br from-midnight-900 to-midnight-950 h-full">
      <div className="bg-gradient-to-r from-midnight-800 to-midnight-900 border-b border-gold-500/30 p-4">
        <h2 className="text-xl font-light text-gold-400">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-gold-300/70">
            {subtitle}
          </p>
        )}
      </div>
      <div className="p-4 flex justify-center">
        <ArtDecoRadialChart 
          data={data}
          width={400}
          height={400}
          centerLabel={formattedCenterLabel}
        />
      </div>
      
      {(source || lastUpdated) && (
        <div className="pb-4 text-xs text-gold-300/70 text-center">
          {source && `Source: ${source}`}{source && lastUpdated && " • "}
          {lastUpdated && `Updated ${lastUpdated}`}
        </div>
      )}
    </div>
  );
};

export const getDefaultHealthData = (): HealthDataPoint[] => {
  return [
    { name: '18-34', value: 31.5, color: '#FFC700' },
    { name: '35-49', value: 35.8, color: '#CCA000' },
    { name: '50-64', value: 38.2, color: '#33394F' },
    { name: '65+', value: 34.1, color: '#000723' }
  ];
};

export const getDiabetesRegionalData = (): HealthDataPoint[] => {
  return [
    { name: 'Northeast', value: 9.8, color: '#FFC700' },
    { name: 'Midwest', value: 11.3, color: '#CCA000' },
    { name: 'South', value: 13.1, color: '#33394F' },
    { name: 'West', value: 10.4, color: '#000723' }
  ];
};
