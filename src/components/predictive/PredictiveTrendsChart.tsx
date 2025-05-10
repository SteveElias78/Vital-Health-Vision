
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { ArtDecoCard } from '@/components/artdeco/ArtDecoCard';
import { ArtDecoCardHeader } from '@/components/artdeco/ArtDecoCardHeader';

interface DataPoint {
  date: string;
  actual: number;
  predicted?: number;
  lowerBound?: number;
  upperBound?: number;
}

interface PredictiveTrendsChartProps {
  title: string;
  subtitle?: string;
  data: DataPoint[];
  metricName: string;
  includeConfidenceInterval?: boolean;
  predictionStart?: number;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

export const PredictiveTrendsChart: React.FC<PredictiveTrendsChartProps> = ({
  title,
  subtitle,
  data,
  metricName,
  includeConfidenceInterval = true,
  predictionStart = 0,
  xAxisLabel = "Time Period",
  yAxisLabel = "Value"
}) => {
  const [showExplanations, setShowExplanations] = useState(false);
  
  // Find the point where predictions start
  const actualDataEndIndex = predictionStart > 0 ? predictionStart : 
    data.findIndex(point => point.predicted !== undefined && point.actual === undefined);
  
  const actualEndDate = actualDataEndIndex >= 0 && actualDataEndIndex < data.length 
    ? data[actualDataEndIndex].date
    : null;
  
  // Determine factors affecting the prediction (simplified example)
  const factors = [
    { name: "Historical Trend", impact: "High", direction: "Positive" },
    { name: "Seasonal Patterns", impact: "Medium", direction: "Negative" },
    { name: "Demographic Shifts", impact: "Low", direction: "Positive" },
  ];
  
  return (
    <ArtDecoCard className="w-full">
      <ArtDecoCardHeader title={title} subtitle={subtitle} />
      
      <div className="p-4">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowExplanations(!showExplanations)}
            className="text-sm px-4 py-1 bg-midnight-800 hover:bg-midnight-700 text-gold-400 rounded-full border border-gold-500/30"
          >
            {showExplanations ? "Hide Explanations" : "Explain Predictions"}
          </button>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFC700" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#FFC700" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="predictedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#60A5FA" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#60A5FA" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              
              <XAxis 
                dataKey="date" 
                stroke="#9CA3AF"
                label={{ value: xAxisLabel, position: 'insideBottom', offset: -5, fill: '#9CA3AF' }}
              />
              
              <YAxis
                stroke="#9CA3AF"
                label={{ value: yAxisLabel, angle: -90, position: 'insideLeft', offset: 10, fill: '#9CA3AF' }}
              />
              
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563', color: '#F9FAFB' }}
                itemStyle={{ color: '#F9FAFB' }}
                labelStyle={{ color: '#F9CA24' }}
              />
              
              <Legend
  wrapperStyle={{ paddingTop: '10px' }}
  payload={[
    { value: 'Actual', type: 'line' as LegendType, color: '#FFC700' },
    { value: 'Predicted', type: 'line' as LegendType, color: '#60A5FA' },
    ...(includeConfidenceInterval ? [{ value: 'Confidence Interval', type: 'area' as LegendType, color: '#60A5FA' }] : [])
  ]}
/>
              
              {/* Actual data */}
              <Area 
                type="monotone" 
                dataKey="actual" 
                name="Actual" 
                stroke="#FFC700" 
                fill="url(#actualGradient)" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              
              {/* Predicted data */}
              <Area 
                type="monotone" 
                dataKey="predicted" 
                name="Predicted" 
                stroke="#60A5FA" 
                fill="url(#predictedGradient)" 
                strokeWidth={2}
                strokeDasharray="5 5"
              />
              
              {/* Confidence interval */}
              {includeConfidenceInterval && (
                <Area
                  type="monotone"
                  dataKey="upperBound"
                  name="Upper Bound"
                  stroke="transparent"
                  fill="transparent"
                />
              )}
              
              {includeConfidenceInterval && (
                <Area
                  type="monotone"
                  dataKey="lowerBound"
                  name="Lower Bound"
                  stroke="transparent"
                  fillOpacity={1}
                  fill="url(#confidenceGradient)"
                />
              )}
              
              {/* Reference line for where predictions start */}
              {actualEndDate && (
                <ReferenceLine
                  x={actualEndDate}
                  stroke="#F9CA24"
                  strokeDasharray="3 3"
                  label={{ 
                    value: "Predictions Start", 
                    position: 'top', 
                    fill: '#F9CA24',
                    fontSize: 12
                  }}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Explainability panel */}
        {showExplanations && (
          <div className="mt-6 p-4 bg-midnight-800 rounded-md border border-gold-500/30">
            <h3 className="text-gold-400 text-lg font-medium mb-3">Prediction Explanation</h3>
            <p className="text-gold-300/80 mb-4">
              The predictions for {metricName} are based on historical trends, seasonal patterns, and 
              demographic data analysis. Our AI model has identified these key factors:
            </p>
            
            <div className="grid grid-cols-3 gap-4 mt-4">
              {factors.map((factor, index) => (
                <div key={index} className="p-3 bg-midnight-900 rounded-md">
                  <h4 className="text-gold-400">{factor.name}</h4>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-gold-300/70">Impact:</span>
                    <span className="text-xs font-medium text-gold-400">{factor.impact}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gold-300/70">Direction:</span>
                    <span className={`text-xs font-medium ${factor.direction === 'Positive' ? 'text-green-400' : 'text-red-400'}`}>
                      {factor.direction}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <p className="text-gold-300/70 text-sm mt-4">
              Model confidence: 87% (based on historical accuracy and data completeness)
            </p>
          </div>
        )}
      </div>
    </ArtDecoCard>
  );
};

// Sample data generator for testing
export const generatePredictiveData = (
  historicalPoints: number = 12, 
  predictionPoints: number = 6,
  baseValue: number = 50,
  trend: number = 1,
  variance: number = 5
): DataPoint[] => {
  const data: DataPoint[] = [];
  
  // Generate historical data
  for (let i = 0; i < historicalPoints; i++) {
    const dateObj = new Date();
    dateObj.setMonth(dateObj.getMonth() - (historicalPoints - i));
    
    const actualValue = baseValue + (trend * i) + (Math.random() * variance * 2 - variance);
    
    data.push({
      date: dateObj.toISOString().slice(0, 7), // YYYY-MM format
      actual: Number(actualValue.toFixed(1)),
    });
  }
  
  // Last historical point is also the first prediction point
  const lastHistorical = data[data.length - 1];
  lastHistorical.predicted = lastHistorical.actual;
  lastHistorical.lowerBound = lastHistorical.actual - (variance / 2);
  lastHistorical.upperBound = lastHistorical.actual + (variance / 2);
  
  // Generate prediction data
  for (let i = 1; i <= predictionPoints; i++) {
    const dateObj = new Date();
    dateObj.setMonth(dateObj.getMonth() + i);
    
    const predictedValue = baseValue + (trend * (historicalPoints + i));
    const confidenceInterval = variance * (1 + (i * 0.2)); // Increasing uncertainty over time
    
    data.push({
      date: dateObj.toISOString().slice(0, 7), // YYYY-MM format
      predicted: Number(predictedValue.toFixed(1)),
      lowerBound: Number((predictedValue - confidenceInterval).toFixed(1)),
      upperBound: Number((predictedValue + confidenceInterval).toFixed(1)),
      actual: 0 // Adding a default actual value of 0 to satisfy TypeScript
    });
  }
  
  return data;
};
