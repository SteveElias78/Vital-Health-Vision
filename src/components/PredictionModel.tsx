
import { useState, useRef, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend, Brush, ReferenceDot
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useChartContext } from '@/components/charts/ChartContext';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { 
  Download, Play, Pause, ThumbsUp, ThumbsDown, ArrowRight
} from 'lucide-react';
import { exportChartAsImage, exportChartDataAsCSV } from '@/components/charts/chartUtils';

// Enhanced forecast data
const forecastData = [
  { year: '2020', period: 0, actual: 120, predicted: 118, prediction_lower: 110, prediction_upper: 126 },
  { year: '2021', period: 1, actual: 132, predicted: 129, prediction_lower: 120, prediction_upper: 138 },
  { year: '2022', period: 2, actual: 141, predicted: 138, prediction_lower: 130, prediction_upper: 146 },
  { year: '2023', period: 3, actual: 152, predicted: 149, prediction_lower: 140, prediction_upper: 158 },
  { year: '2024', period: 4, actual: 165, predicted: 160, prediction_lower: 150, prediction_upper: 170 },
  { year: '2025', period: 5, actual: null, predicted: 172, prediction_lower: 160, prediction_upper: 184 },
  { year: '2026', period: 6, actual: null, predicted: 185, prediction_lower: 172, prediction_upper: 198 },
  { year: '2027', period: 7, actual: null, predicted: 196, prediction_lower: 182, prediction_upper: 210 },
];

// Chart config
const chartConfig = {
  'actual': { label: 'Historical', theme: { light: '#8B5CF6', dark: '#A78BFA' } },
  'predicted': { label: 'Predicted', theme: { light: '#0EA5E9', dark: '#38BDF8' } }
};

export function PredictionModel() {
  const [condition, setCondition] = useState("diabetes");
  const [confidenceLevel, setConfidenceLevel] = useState([95]);
  const [timeframe, setTimeframe] = useState([5]);
  const [visibleData, setVisibleData] = useState(forecastData);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationStep, setAnimationStep] = useState(4); // Start with showing historical data
  const [highlightPoint, setHighlightPoint] = useState<number | null>(null);
  
  const chartRef = useRef<HTMLDivElement>(null);
  const { filters, isAnimating, setIsAnimating } = useChartContext();

  // Apply cross-filtering based on ChartContext filters
  useEffect(() => {
    if (filters.condition) {
      setCondition(filters.condition.toLowerCase());
    }
  }, [filters]);

  // Handle animation of forecast progression
  useEffect(() => {
    if (isPlaying) {
      setIsAnimating(true);
      const interval = setInterval(() => {
        setAnimationStep(prev => {
          if (prev >= forecastData.length - 1) {
            setIsPlaying(false);
            setIsAnimating(false);
            return forecastData.length - 1;
          }
          return prev + 1;
        });
      }, 1000);
      
      return () => {
        clearInterval(interval);
        setIsAnimating(false);
      };
    }
  }, [isPlaying, setIsAnimating]);

  // Update visible data based on animation step and confidence level
  useEffect(() => {
    // Show only up to the current animation step
    const currentData = forecastData.slice(0, animationStep + 1);
    
    // Update confidence interval based on slider
    const confidenceWidth = confidenceLevel[0] / 100;
    const updatedData = currentData.map(item => ({
      ...item,
      prediction_lower: item.predicted - (item.prediction_upper - item.prediction_lower) * confidenceWidth / 2,
      prediction_upper: item.predicted + (item.prediction_upper - item.prediction_lower) * confidenceWidth / 2
    }));
    
    setVisibleData(updatedData);
  }, [animationStep, confidenceLevel]);

  // Handle play/pause button click
  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      // Reset to historical data if we're at the end
      if (animationStep >= forecastData.length - 1) {
        setAnimationStep(4); // Show only historical data
      }
      setIsPlaying(true);
    }
  };

  // Handle reset button click
  const handleReset = () => {
    setIsPlaying(false);
    setAnimationStep(4); // Show only historical data
  };

  // Handle point click for engagement
  const handlePointClick = (data: any, index: number) => {
    setHighlightPoint(index);
  };

  // Custom tooltip with rich context
  const renderCustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    
    const data = payload[0].payload;
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

  // Update visible timeframe
  useEffect(() => {
    // Show all historical data plus prediction years based on timeframe
    const maxPeriod = 4 + timeframe[0]; // 4 historical years + prediction years
    setVisibleData(forecastData.slice(0, maxPeriod + 1));
    setAnimationStep(Math.min(maxPeriod, animationStep));
  }, [timeframe]);

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
        <div className="h-[300px]">
          <ChartContainer config={chartConfig} className="h-full">
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
                <Tooltip content={renderCustomTooltip} />
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
                    onClick: (event) => {
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
                    onClick: (event) => {
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
          </ChartContainer>
        </div>
        
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
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <div className="flex flex-col">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="justify-start"
                  onClick={() => exportChartAsImage(chartRef, 'prediction-model')}
                >
                  Export as PNG
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="justify-start"
                  onClick={() => exportChartDataAsCSV(visibleData, 'prediction-data')}
                >
                  Export as CSV
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardFooter>
      <div className="px-6 pb-4 text-xs text-gray-500 text-center">
        <p>Machine learning model based on historical trends and demographic factors</p>
        <p className="mt-1">Confidence interval: {confidenceLevel[0]}%</p>
      </div>
    </Card>
  );
}
