
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
  subtitle: string;
  centerLabel: string;
}

export const HealthDataVisualization: React.FC<HealthDataVisualizationProps> = ({
  data,
  title,
  subtitle,
  centerLabel
}) => {
  return (
    <div className="border border-gold-500/30 rounded-lg overflow-hidden bg-gradient-to-br from-midnight-900 to-midnight-950 h-full">
      <div className="bg-gradient-to-r from-midnight-800 to-midnight-900 border-b border-gold-500/30 p-4">
        <h2 className="text-xl font-light text-gold-400">
          {title}
        </h2>
        <p className="text-sm text-gold-300/70">
          {subtitle}
        </p>
      </div>
      <div className="p-4 flex justify-center">
        <ArtDecoRadialChart 
          data={data}
          width={400}
          height={400}
          centerLabel={centerLabel}
        />
      </div>
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
