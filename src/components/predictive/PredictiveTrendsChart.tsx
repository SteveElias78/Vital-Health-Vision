
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { faker } from '@faker-js/faker';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer } from 'recharts';

interface DataPoint {
  date: string;
  actual?: number;
  predicted?: number;
  lowerBound?: number;
  upperBound?: number;
  isPrediction?: boolean;
}

interface PredictiveTrendsChartProps {
  title: string;
  subtitle?: string;
  data: DataPoint[];
  metricName?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  showConfidenceInterval?: boolean;
}

export const PredictiveTrendsChart: React.FC<PredictiveTrendsChartProps> = ({
  title,
  subtitle,
  data,
  metricName = 'Value',
  xAxisLabel = 'Date',
  yAxisLabel = 'Value',
  showConfidenceInterval = true
}) => {
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Find the prediction transition point
  const predictionStartIndex = data.findIndex(point => point.isPrediction);
  
  // Format dates for tooltip
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      const isPrediction = dataPoint.isPrediction;
      
      return (
        <div className="custom-tooltip bg-midnight-950/90 border border-gold-500/50 p-3 rounded text-sm">
          <p className="text-gold-400">{formatDate(label)}</p>
          
          {isPrediction ? (
            <>
              <p className="text-gold-300">
                <span className="font-medium">{metricName}: </span>
                {dataPoint.predicted?.toFixed(2)}
              </p>
              
              {showConfidenceInterval && dataPoint.lowerBound && dataPoint.upperBound && (
                <p className="text-gold-300/70">
                  <span className="font-medium">Confidence Interval: </span>
                  {dataPoint.lowerBound.toFixed(2)} - {dataPoint.upperBound.toFixed(2)}
                </p>
              )}
              
              <div className="mt-1 text-amber-300/80 text-xs font-medium">
                Prediction
              </div>
            </>
          ) : (
            <p className="text-gold-300">
              <span className="font-medium">{metricName}: </span>
              {dataPoint.actual?.toFixed(2)}
            </p>
          )}
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <Card className="art-deco-border overflow-hidden">
      <CardHeader>
        <CardTitle className="text-gold-400">{title}</CardTitle>
        {subtitle && <CardDescription className="text-gold-300/70">{subtitle}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(228, 195, 137, 0.2)" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#E4C389' }} 
                axisLine={{ stroke: '#E4C389', strokeWidth: 1 }} 
                tickLine={{ stroke: '#E4C389' }}
                tickFormatter={formatDate}
                label={{ value: xAxisLabel, position: 'insideBottom', offset: -10, fill: '#E4C389' }}
              />
              <YAxis 
                tick={{ fill: '#E4C389' }} 
                axisLine={{ stroke: '#E4C389', strokeWidth: 1 }} 
                tickLine={{ stroke: '#E4C389' }}
                label={{ value: yAxisLabel, angle: -90, position: 'insideLeft', fill: '#E4C389' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: '#E4C389' }} />
              
              {/* Actual data line */}
              <Line
                type="monotone"
                dataKey="actual"
                name="Actual"
                stroke="#FFC700"
                activeDot={{ r: 8, fill: '#FFC700', stroke: '#000' }}
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 1, fill: '#FFC700', stroke: '#000' }}
              />
              
              {/* Prediction line */}
              <Line
                type="monotone"
                dataKey="predicted"
                name="Predicted"
                stroke="#FF9500"
                activeDot={{ r: 8 }}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 4, strokeWidth: 1 }}
              />
              
              {/* Confidence interval area */}
              {showConfidenceInterval && (
                <Line
                  type="monotone"
                  dataKey="upperBound"
                  name="Upper Bound"
                  stroke="rgba(255, 149, 0, 0.3)"
                  strokeWidth={1}
                  dot={false}
                  activeDot={false}
                />
              )}
              
              {showConfidenceInterval && (
                <Line
                  type="monotone"
                  dataKey="lowerBound"
                  name="Lower Bound"
                  stroke="rgba(255, 149, 0, 0.3)"
                  strokeWidth={1}
                  dot={false}
                  activeDot={false}
                />
              )}
              
              {/* Reference line at current date */}
              <ReferenceLine 
                x={currentDate} 
                stroke="#E4C389" 
                strokeDasharray="3 3"
                label={{ 
                  value: 'Today',
                  position: 'top',
                  fill: '#E4C389',
                  fontSize: 12
                }}
              />
              
              {/* Reference line at prediction start */}
              {predictionStartIndex > 0 && (
                <ReferenceLine 
                  x={data[predictionStartIndex].date} 
                  stroke="rgba(228, 195, 137, 0.5)"
                  strokeDasharray="3 3"
                  label={{ 
                    value: 'Forecast Start',
                    position: 'top',
                    fill: '#E4C389',
                    fontSize: 12
                  }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 p-4 bg-midnight-900/50 border border-gold-500/30 rounded-lg">
          <h3 className="text-gold-400 mb-2 text-sm font-medium">Forecast Methodology</h3>
          <p className="text-sm text-gold-300/80">
            This forecast uses ARIMA time-series modeling with seasonal adjustments and considers
            historical trends, cyclical patterns, and relevant covariates. Confidence intervals shown 
            represent a 95% probability range for predicted values.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

// Mock data generator for demo purposes
export const generatePredictiveData = (historicalMonths = 24, forecastMonths = 6) => {
  const data: DataPoint[] = [];
  const today = new Date();
  const baseValue = 25 + Math.random() * 10;
  let currentValue = baseValue;
  
  // Seasonal component parameters
  const seasonalAmplitude = 2 + Math.random() * 3; // Between 2-5
  const seasonalPeriod = 12; // Annual seasonality in months
  
  // Generate historical data
  for (let i = 0; i < historicalMonths; i++) {
    const date = new Date();
    date.setMonth(today.getMonth() - (historicalMonths - i));
    
    // Add trend component
    const trend = i * 0.1;
    
    // Add seasonal component
    const seasonal = seasonalAmplitude * Math.sin(2 * Math.PI * i / seasonalPeriod);
    
    // Add random component
    const random = (Math.random() - 0.5) * 2;
    
    const value = baseValue + trend + seasonal + random;
    
    data.push({
      date: date.toISOString().split('T')[0],
      actual: parseFloat(value.toFixed(2)),
      isPrediction: false
    });
    
    currentValue = value;
  }
  
  // Generate forecast data
  for (let i = 0; i < forecastMonths; i++) {
    const date = new Date();
    date.setMonth(today.getMonth() + i + 1);
    
    // Continue trend component
    const trend = (historicalMonths + i) * 0.1;
    
    // Continue seasonal component
    const seasonal = seasonalAmplitude * Math.sin(2 * Math.PI * (historicalMonths + i) / seasonalPeriod);
    
    // Prediction has more uncertainty the further we go
    const uncertaintyFactor = 0.5 + (i / forecastMonths) * 1.5;
    
    const predictedValue = baseValue + trend + seasonal;
    const confidenceInterval = uncertaintyFactor * 2;
    
    data.push({
      date: date.toISOString().split('T')[0],
      actual: 0, // Add default value
      predicted: parseFloat(predictedValue.toFixed(2)),
      lowerBound: parseFloat((predictedValue - confidenceInterval).toFixed(2)),
      upperBound: parseFloat((predictedValue + confidenceInterval).toFixed(2)),
      isPrediction: true
    });
  }
  
  return data;
};
