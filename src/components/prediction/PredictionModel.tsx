
import React, { useState, useRef } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend, ReferenceDot
} from 'recharts';
import { PredictionTooltip } from './PredictionTooltip';
import { PredictionControls } from './PredictionControls';
import { PredictionExport } from './PredictionExport';
import { ForecastDataPoint } from './types';
import { forecastData } from './forecastData';

export const PredictionModel = () => {
  const [confidenceLevel, setConfidenceLevel] = useState<number[]>([95]);
  const [timeframe, setTimeframe] = useState<number[]>([5]);
  const [highlightPoint, setHighlightPoint] = useState<number | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  
  // Filter data based on timeframe
  const visibleData = forecastData.slice(0, 5 + timeframe[0]);
  
  const handlePointClick = (data: ForecastDataPoint, index: number) => {
    setHighlightPoint(index);
    console.log("Selected point:", data);
  };

  return (
    <div className="space-y-4">
      <div ref={chartRef} className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={visibleData}
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
            <Tooltip 
              content={props => (
                <PredictionTooltip 
                  {...props} 
                  confidenceLevel={confidenceLevel}
                />
              )}
            />
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
                x={visibleData[highlightPoint].year}
                y={visibleData[highlightPoint].predicted || visibleData[highlightPoint].actual}
                r={6}
                fill="#F97316"
                stroke="none"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <PredictionControls 
            confidenceLevel={confidenceLevel}
            setConfidenceLevel={setConfidenceLevel}
            timeframe={timeframe}
            setTimeframe={setTimeframe}
          />
        </div>
        <PredictionExport 
          chartRef={chartRef} 
          visibleData={visibleData} 
        />
      </div>
    </div>
  );
};
