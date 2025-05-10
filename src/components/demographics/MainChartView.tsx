
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  ResponsiveContainer, Legend, Cell, Tooltip
} from 'recharts';
import { TooltipProvider, Tooltip as UITooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { ChartTooltipContent } from '@/components/ui/chart';
import { DemographicDataPoint, ChartConfig } from './types';

interface MainChartViewProps {
  filteredData: DemographicDataPoint[];
  selectedBars: string[];
  onBarClick: (data: any, index: number, barKey: string) => void;
  onBarSelect: (data: any) => void;
  chartConfig: ChartConfig;
}

export function MainChartView({ 
  filteredData, 
  selectedBars, 
  onBarClick, 
  onBarSelect, 
  chartConfig 
}: MainChartViewProps) {
  return (
    <>
      <TooltipProvider>
        <div className="ml-2 mb-2 text-xs text-muted-foreground flex items-center">
          <span className="mr-1">Click bars to drill-down. Double-click to filter.</span>
          <UITooltip>
            <TooltipTrigger>
              <span className="inline-flex items-center justify-center rounded-full bg-muted h-4 w-4 text-xs">?</span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-xs">
                Click on any bar to see a breakdown by condition. Double-click to filter the bar by age group.
              </p>
            </TooltipContent>
          </UITooltip>
        </div>
      </TooltipProvider>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={filteredData}
          margin={{
            top: 5,
            right: 10,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="age" />
          <YAxis />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend />
          <Bar 
            dataKey="male" 
            name="Male" 
            fill="#0EA5E9" 
            onClick={(data, index) => onBarClick(data, index, 'male')}
            onDoubleClick={(data) => onBarSelect(data)}
            animationDuration={800}
          >
            {filteredData.map((entry, index) => (
              <Cell 
                key={`cell-male-${index}`} 
                fill={selectedBars.includes(entry.age) ? '#0075ad' : '#0EA5E9'}
                opacity={selectedBars.length > 0 && !selectedBars.includes(entry.age) ? 0.4 : 1}
              />
            ))}
          </Bar>
          <Bar 
            dataKey="female" 
            name="Female" 
            fill="#D946EF"
            onClick={(data, index) => onBarClick(data, index, 'female')}
            onDoubleClick={(data) => onBarSelect(data)}
            animationDuration={800}
          >
            {filteredData.map((entry, index) => (
              <Cell 
                key={`cell-female-${index}`}
                fill={selectedBars.includes(entry.age) ? '#a924bd' : '#D946EF'} 
                opacity={selectedBars.length > 0 && !selectedBars.includes(entry.age) ? 0.4 : 1}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}
