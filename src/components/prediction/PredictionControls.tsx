
import React from 'react';
import { Slider } from '@/components/ui/slider';

interface PredictionControlsProps {
  confidenceLevel: number[];
  setConfidenceLevel: React.Dispatch<React.SetStateAction<number[]>>;
  timeframe: number[];
  setTimeframe: React.Dispatch<React.SetStateAction<number[]>>;
}

export const PredictionControls: React.FC<PredictionControlsProps> = ({
  confidenceLevel,
  setConfidenceLevel,
  timeframe,
  setTimeframe
}) => {
  return (
    <div className="mt-4 space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Confidence Level</span>
          <span className="font-medium">{confidenceLevel[0]}%</span>
        </div>
        <Slider
          value={confidenceLevel}
          onValueChange={setConfidenceLevel}
          max={99}
          min={80}
          step={1}
          className="w-full"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Prediction Timeframe</span>
          <span className="font-medium">{timeframe[0]} years</span>
        </div>
        <Slider
          value={timeframe}
          onValueChange={setTimeframe}
          max={10}
          min={1}
          step={1}
          className="w-full"
        />
      </div>
    </div>
  );
};
