
import { useState, useRef, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend, ZAxis, ReferenceArea,
  Brush, ReferenceLine
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useChartContext } from '@/components/charts/ChartContext';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { 
  Download, ZoomIn, ZoomOut, Play, Pause, RefreshCw,
  ChevronLeft, ChevronRight, MousePointer, Move
} from 'lucide-react';
import { 
  exportChartAsImage, 
  exportChartDataAsCSV, 
  animateTimeSeries
} from '@/components/charts/chartUtils';

// Enhanced sample data with more data points and dates
const trendData = [
  { month: 'Jan', date: '2023-01-01', 'Heart Disease': 4000, 'Diabetes': 2400, 'Obesity': 2400 },
  { month: 'Feb', date: '2023-02-01', 'Heart Disease': 3000, 'Diabetes': 1398, 'Obesity': 2210 },
  { month: 'Mar', date: '2023-03-01', 'Heart Disease': 2000, 'Diabetes': 9800, 'Obesity': 2290 },
  { month: 'Apr', date: '2023-04-01', 'Heart Disease': 2780, 'Diabetes': 3908, 'Obesity': 2000 },
  { month: 'May', date: '2023-05-01', 'Heart Disease': 1890, 'Diabetes': 4800, 'Obesity': 2181 },
  { month: 'Jun', date: '2023-06-01', 'Heart Disease': 2390, 'Diabetes': 3800, 'Obesity': 2500 },
  { month: 'Jul', date: '2023-07-01', 'Heart Disease': 3490, 'Diabetes': 4300, 'Obesity': 2100 },
  { month: 'Aug', date: '2023-08-01', 'Heart Disease': 3590, 'Diabetes': 4500, 'Obesity': 2300 },
  { month: 'Sep', date: '2023-09-01', 'Heart Disease': 4290, 'Diabetes': 5100, 'Obesity': 2400 },
  { month: 'Oct', date: '2023-10-01', 'Heart Disease': 4890, 'Diabetes': 5600, 'Obesity': 2600 },
  { month: 'Nov', date: '2023-11-01', 'Heart Disease': 5290, 'Diabetes': 5900, 'Obesity': 2700 },
  { month: 'Dec', date: '2023-12-01', 'Heart Disease': 5490, 'Diabetes': 6100, 'Obesity': 2800 },
];

// Transform trendData to match TimeseriesDataPoint interface
const transformedTrendData = trendData.map(item => ({
  ...item,
  date: item.date,
  value: item['Heart Disease'] // Default value
}));

// Chart config for advanced tooltips
const chartConfig = {
  'Heart Disease': { label: 'Heart Disease', theme: { light: '#8B5CF6', dark: '#A78BFA' } },
  'Diabetes': { label: 'Diabetes', theme: { light: '#0EA5E9', dark: '#38BDF8' } },
  'Obesity': { label: 'Obesity', theme: { light: '#F97316', dark: '#FB923C' } }
};

export function DataTrends() {
  const [timeRange, setTimeRange] = useState("7d");
  const [visibleData, setVisibleData] = useState(trendData);
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoomMode, setZoomMode] = useState<'zoom' | 'pan' | 'select'>('select');
  const [refAreaLeft, setRefAreaLeft] = useState<string | null>(null);
  const [refAreaRight, setRefAreaRight] = useState<string | null>(null);

  const chartRef = useRef<HTMLDivElement>(null);
  const { 
    filters, 
    setFilters, 
    selectedPoint, 
    setSelectedPoint,
    isAnimating,
    setIsAnimating,
    zoomDomain,
    setZoomDomain
  } = useChartContext();

  // Handle time range changes
  useEffect(() => {
    if (timeRange === '7d') {
      setVisibleData(trendData.slice(-7));
    } else if (timeRange === '1m') {
      setVisibleData(trendData.slice(-30));
    } else {
      setVisibleData(trendData);
    }
  }, [timeRange]);

  // Functions for zoom/pan interactions
  const handleMouseDown = (e: any) => {
    if (zoomMode !== 'zoom' || !e) return;
    setRefAreaLeft(e.activeLabel);
  };

  const handleMouseMove = (e: any) => {
    if (zoomMode !== 'zoom' || !refAreaLeft || !e) return;
    setRefAreaRight(e.activeLabel);
  };

  const handleMouseUp = () => {
    if (zoomMode !== 'zoom' || !refAreaLeft || !refAreaRight) {
      setRefAreaLeft(null);
      setRefAreaRight(null);
      return;
    }

    // Find indices for the labels
    const leftIndex = visibleData.findIndex(d => d.month === refAreaLeft);
    const rightIndex = visibleData.findIndex(d => d.month === refAreaRight);

    if (leftIndex >= 0 && rightIndex >= 0) {
      setVisibleData(visibleData.slice(
        Math.min(leftIndex, rightIndex), 
        Math.max(leftIndex, rightIndex) + 1
      ));
      setZoomDomain({
        x: [refAreaLeft, refAreaRight] as [number, number],
        y: null
      });
    }

    setRefAreaLeft(null);
    setRefAreaRight(null);
  };

  const handleReset = () => {
    setVisibleData(trendData);
    setZoomDomain(null);
  };

  // Animation handler
  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      setIsAnimating(false);
      setVisibleData(trendData);
    } else {
      setIsPlaying(true);
      // We're using transformedTrendData for animation because it matches the TimeseriesDataPoint interface
      const cleanup = animateTimeSeries(
        transformedTrendData,
        setVisibleData as React.Dispatch<React.SetStateAction<any[]>>,
        setIsAnimating,
        500
      );
      return cleanup;
    }
  };

  // Point click handler for drill-down
  const handlePointClick = (data: any, index: number) => {
    setSelectedPoint(data);
    
    // Update filters based on the clicked point
    setFilters({
      ...filters,
      condition: Object.keys(data).find(key => 
        key !== 'month' && key !== 'date' && data[key] === Math.max(data['Heart Disease'], data['Diabetes'], data['Obesity'])
      )
    });
  };

  // Custom tooltip with more information
  const renderCustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-sm mb-2">{label}</p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={`tooltip-${index}`} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-xs text-muted-foreground">{entry.name}:</span>
                <span className="text-xs font-medium">{entry.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-1 md:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Health Condition Trends</CardTitle>
          <CardDescription>Historical trends over time</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <ToggleGroup type="single" value={timeRange} onValueChange={(value) => value && setTimeRange(value)}>
            <ToggleGroupItem value="7d" aria-label="Toggle 7 days">
              7d
            </ToggleGroupItem>
            <ToggleGroupItem value="1m" aria-label="Toggle 1 month">
              1m
            </ToggleGroupItem>
            <ToggleGroupItem value="1y" aria-label="Toggle 1 year">
              1y
            </ToggleGroupItem>
          </ToggleGroup>
          
          <ToggleGroup type="single" value={zoomMode} onValueChange={(value: any) => value && setZoomMode(value)}>
            <ToggleGroupItem value="select" aria-label="Select mode">
              <MousePointer className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="zoom" aria-label="Zoom mode">
              <ZoomIn className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="pan" aria-label="Pan mode">
              <Move className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full relative" ref={chartRef}>
          <ChartContainer config={chartConfig} className="h-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={visibleData}
                margin={{
                  top: 5,
                  right: 10,
                  left: 10,
                  bottom: 5,
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis 
                  dataKey="month" 
                  allowDataOverflow={true}
                />
                <YAxis allowDataOverflow={true} />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  cursor={{ strokeDasharray: '3 3', strokeWidth: 1 }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="Heart Disease" 
                  stroke="#8B5CF6" 
                  strokeWidth={2} 
                  dot={{ r: 3 }} 
                  activeDot={{ 
                    r: 8,
                    onClick: (data) => handlePointClick(data.payload, data.index)
                  }}
                  isAnimationActive={true}
                  animationDuration={1000}
                />
                <Line 
                  type="monotone" 
                  dataKey="Diabetes" 
                  stroke="#0EA5E9" 
                  strokeWidth={2} 
                  dot={{ r: 3 }} 
                  activeDot={{ 
                    r: 8,
                    onClick: (data) => handlePointClick(data.payload, data.index)
                  }}
                  isAnimationActive={true}
                  animationDuration={1000}
                />
                <Line 
                  type="monotone" 
                  dataKey="Obesity" 
                  stroke="#F97316" 
                  strokeWidth={2} 
                  dot={{ r: 3 }} 
                  activeDot={{ 
                    r: 8,
                    onClick: (data) => handlePointClick(data.payload, data.index)
                  }}
                  isAnimationActive={true}
                  animationDuration={1000}
                />
                <Brush dataKey="month" height={30} stroke="#8b5cf6" />
                {refAreaLeft && refAreaRight ? (
                  <ReferenceArea
                    x1={refAreaLeft}
                    x2={refAreaRight}
                    strokeOpacity={0.3}
                    fill="#8884d8"
                    fillOpacity={0.3}
                  />
                ) : null}
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
          
          {selectedPoint && (
            <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 border rounded-md p-2 text-xs shadow-md">
              <p className="font-bold">Selected Point: {selectedPoint.month}</p>
              <p>Heart Disease: {selectedPoint['Heart Disease']}</p>
              <p>Diabetes: {selectedPoint['Diabetes']}</p>
              <p>Obesity: {selectedPoint['Obesity']}</p>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setSelectedPoint(null)}
                className="mt-2"
              >
                Clear
              </Button>
            </div>
          )}
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
            {isPlaying ? 'Pause' : 'Animate'}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleReset}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
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
                  onClick={() => exportChartAsImage(chartRef, 'health-trends')}
                >
                  Export as PNG
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="justify-start"
                  onClick={() => exportChartDataAsCSV(visibleData, 'health-trends-data')}
                >
                  Export as CSV
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardFooter>
    </Card>
  );
}
