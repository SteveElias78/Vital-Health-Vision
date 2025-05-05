
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend 
} from 'recharts';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { DrilldownData, ChartConfig } from './types';

interface DrilldownViewProps {
  drilldownData: DrilldownData;
  onBack: () => void;
  chartConfig: ChartConfig;
}

export function DrilldownView({ drilldownData, onBack, chartConfig }: DrilldownViewProps) {
  return (
    <ChartContainer config={chartConfig} className="h-full">
      <>
        <div className="mb-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onBack}
          >
            ← Back
          </Button>
          <span className="ml-2 text-sm font-medium">
            {drilldownData.age} Age Group • {drilldownData.gender}
          </span>
        </div>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart
            data={drilldownData.data}
            margin={{
              top: 5,
              right: 10,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="condition" />
            <YAxis />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend />
            <Bar 
              dataKey="value" 
              name="Prevalence" 
              fill={drilldownData.gender === 'Male' ? '#0EA5E9' : '#D946EF'} 
              animationDuration={1000}
            />
          </BarChart>
        </ResponsiveContainer>
      </>
    </ChartContainer>
  );
}
