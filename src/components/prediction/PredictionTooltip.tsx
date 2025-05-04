
import React from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { TooltipProps } from 'recharts';
import { ForecastDataPoint } from './types';

// Extending TooltipProps to ensure proper typing with Recharts
export type PredictionTooltipProps = TooltipProps<number, string> & {
  confidenceLevel: number[];
};

export const PredictionTooltip: React.FC<PredictionTooltipProps> = ({
  active,
  payload,
  label,
  confidenceLevel
}) => {
  if (!active || !payload || !payload.length) return null;
  
  const data = payload[0].payload as ForecastDataPoint;
  const isPrediction = !data.actual;
  
  return (
    <div className="bg-background border border-border rounded-lg p-3 shadow-lg max-w-xs">
      <p className="font-medium text-sm mb-2">{label}</p>
      <div className="space-y-2">
        {payload.map((entry: any, index: number) => {
          if (entry.dataKey === 'prediction_upper' || entry.dataKey === 'prediction_lower') {
            return null;
          }
          
          return (
            <div key={`tooltip-${index}`} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs text-muted-foreground">{entry.name}:</span>
              <span className="text-xs font-medium">{entry.value.toLocaleString()}</span>
            </div>
          );
        })}
        
        {isPrediction && (
          <div className="mt-2 text-xs">
            <p className="font-medium">Prediction Details:</p>
            <p className="text-muted-foreground">Confidence Interval: {confidenceLevel[0]}%</p>
            <p className="text-muted-foreground">Range: {data.prediction_lower.toFixed(1)} - {data.prediction_upper.toFixed(1)}</p>
            <div className="flex items-center gap-2 mt-1">
              <Button 
                size="icon" 
                variant="outline" 
                className="h-6 w-6"
                onClick={() => console.log("Prediction rated: Good")}
              >
                <ThumbsUp className="h-3 w-3" />
              </Button>
              <Button 
                size="icon" 
                variant="outline" 
                className="h-6 w-6"
                onClick={() => console.log("Prediction rated: Bad")}
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
