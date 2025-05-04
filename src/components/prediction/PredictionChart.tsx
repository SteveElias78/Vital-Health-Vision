
import React, { useRef } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend, ReferenceDot
} from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
import { PredictionTooltip } from './PredictionTooltip';
import { ForecastDataPoint } from './types';

interface PredictionChartProps {
  data: ForecastDataPoint[];
  config: any;
  confidenceLevel: number[];
  highlightPoint: number | null;
  handlePointClick: (data: any, index: number) => void;
}

export const PredictionChart: React.FC<PredictionChartProps> = ({
  data, 
  config, 
  confidenceLevel, 
  highlightPoint,
  handlePointClick
}) => {
  return (
    <div className="h-[300px]">
      <ChartContainer config={config} className="h-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: 10,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip content={(props) => <PredictionTooltip {...props} confidenceLevel={confidenceLevel} />} />
            <Legend />
            <defs>
              <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey="actual" 
              name="Historical" 
              stackId="1" 
              stroke="#8B5CF6" 
              fill="#8B5CF6" 
              fillOpacity={0.2} 
              activeDot={{
                r: 6,
                onClick: (event: any) => {
                  if (event && event.payload) {
                    handlePointClick(event.payload, event.index || 0);
                  }
                }
              }}
              isAnimationActive={true}
              animationDuration={1000}
            />
            <Area 
              type="monotone" 
              dataKey="predicted" 
              name="Predicted" 
              stackId="2" 
              stroke="#0EA5E9" 
              strokeDasharray="5 5" 
              fill="none"
              activeDot={{
                r: 6,
                onClick: (event: any) => {
                  if (event && event.payload) {
                    handlePointClick(event.payload, event.index || 0);
                  }
                }
              }}
              isAnimationActive={true}
              animationDuration={1000}
            />
            <Area
              type="monotone"
              dataKey="prediction_upper"
              stroke="none"
              fill="url(#colorConfidence)"
              fillOpacity={1}
              name="Confidence (Upper)"
              legendType="none"
              isAnimationActive={true}
              animationDuration={1000}
            />
            <Area
              type="monotone"
              dataKey="prediction_lower"
              stroke="none"
              fill="#0EA5E9"
              fillOpacity={0}
              name="Confidence (Lower)"
              legendType="none"
              isAnimationActive={true}
              animationDuration={1000}
            />
            {highlightPoint !== null && (
              <ReferenceDot
                x={data[highlightPoint].year}
                y={data[highlightPoint].predicted || data[highlightPoint].actual}
                r={6}
                fill="#F97316"
                stroke="none"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};
