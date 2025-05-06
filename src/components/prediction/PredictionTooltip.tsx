
import React from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { ForecastDataPoint } from './types';
import { TooltipProps } from 'recharts';

/**
 * Props for the PredictionTooltip component
 * Extended from Recharts TooltipProps with generic parameters
 */
export interface PredictionTooltipProps extends TooltipProps<number, string> {
  confidenceLevel: number[];
}

/**
 * A tooltip component for displaying prediction data in a chart
 */
export const PredictionTooltip: React.FC<PredictionTooltipProps> = ({
  active,
  payload,
  label,
  confidenceLevel
}) => {
  // If the tooltip is not active or there's no data, don't render anything
  if (!active || !payload || !payload.length) return null;
  
  // Get the data point from the first payload item
  const dataPoint = payload[0].payload as ForecastDataPoint;
  
  // Determine if this is a prediction (no actual value) or historical data
  const isPrediction = !dataPoint.actual;
  
  return (
    <div className="bg-background border border-border rounded-lg p-3 shadow-lg max-w-xs">
      {/* Display the time period (e.g. year) */}
      <p className="font-medium text-sm mb-2">{label}</p>
      
      <div className="space-y-2">
        {/* Map through payload data and display relevant metrics */}
        {payload.map((entry, index) => {
          // Skip confidence interval bounds in the main display
          if (entry.dataKey === 'prediction_upper' || entry.dataKey === 'prediction_lower') {
            return null;
          }
          
          return (
            <div key={`tooltip-item-${index}`} className="flex items-center gap-2">
              {/* Color indicator for the data series */}
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs text-muted-foreground">{entry.name}:</span>
              <span className="text-xs font-medium">{entry.value?.toLocaleString()}</span>
            </div>
          );
        })}
        
        {/* Show additional prediction details only for prediction points */}
        {isPrediction && (
          <div className="mt-2 text-xs">
            <p className="font-medium">Prediction Details:</p>
            <p className="text-muted-foreground">Confidence Interval: {confidenceLevel[0]}%</p>
            <p className="text-muted-foreground">
              Range: {dataPoint.prediction_lower.toFixed(1)} - {dataPoint.prediction_upper.toFixed(1)}
            </p>
            
            {/* Feedback buttons for predictions */}
            <div className="flex items-center gap-2 mt-1">
              <Button 
                size="icon" 
                variant="outline" 
                className="h-6 w-6"
                onClick={() => console.log("Prediction rated: Good")}
                aria-label="Rate prediction as good"
              >
                <ThumbsUp className="h-3 w-3" />
              </Button>
              <Button 
                size="icon" 
                variant="outline" 
                className="h-6 w-6"
                onClick={() => console.log("Prediction rated: Bad")}
                aria-label="Rate prediction as bad"
              >
                <ThumbsDown className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
