
import { useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';
import { usePrediction } from './prediction/usePrediction';
import { PredictionChart } from './prediction/PredictionChart';
import { PredictionControls } from './prediction/PredictionControls';
import { PredictionExport } from './prediction/PredictionExport';
import { chartConfig } from './prediction/forecastData';

export function PredictionModel() {
  const chartRef = useRef<HTMLDivElement>(null);
  const {
    condition,
    setCondition,
    confidenceLevel,
    setConfidenceLevel,
    timeframe,
    setTimeframe,
    visibleData,
    isPlaying,
    highlightPoint,
    handlePlayPause,
    handleReset,
    handlePointClick
  } = usePrediction();

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Predictive Analysis</CardTitle>
          <CardDescription>Forecasted health trends</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Select value={condition} onValueChange={setCondition}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="diabetes">Diabetes</SelectItem>
              <SelectItem value="heart-disease">Heart Disease</SelectItem>
              <SelectItem value="obesity">Obesity</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent ref={chartRef}>
        <PredictionChart 
          data={visibleData} 
          config={chartConfig}
          confidenceLevel={confidenceLevel}
          highlightPoint={highlightPoint}
          handlePointClick={handlePointClick}
        />
        
        <PredictionControls
          confidenceLevel={confidenceLevel}
          setConfidenceLevel={setConfidenceLevel}
          timeframe={timeframe}
          setTimeframe={setTimeframe}
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePlayPause}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isPlaying ? 'Pause' : 'Animate Projection'}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleReset}
          >
            Reset
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <PredictionExport chartRef={chartRef} visibleData={visibleData} />
        </div>
      </CardFooter>
      <div className="px-6 pb-4 text-xs text-gray-500 text-center">
        <p>Machine learning model based on historical trends and demographic factors</p>
        <p className="mt-1">Confidence interval: {confidenceLevel[0]}%</p>
      </div>
    </Card>
  );
}
