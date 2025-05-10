
import { useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { TrendControls } from './data-trends/TrendControls';
import { TrendChart } from './data-trends/TrendChart';
import { ExportMenu } from './data-trends/ExportMenu';
import { useTrendData } from './data-trends/useTrendData';
import { chartConfig } from './data-trends/data';
import { useChartContext } from './charts/ChartContext';

export function DataTrends() {
  const { 
    timeRange, 
    setTimeRange,
    visibleData,
    isPlaying,
    zoomMode,
    setZoomMode,
    handleReset,
    handlePlayPause,
    handlePointClick
  } = useTrendData();
  
  const { setZoomDomain } = useChartContext();
  const chartRef = useRef<HTMLDivElement>(null);

  return (
    <Card className="col-span-1 md:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Health Condition Trends</CardTitle>
          <CardDescription>Historical trends over time</CardDescription>
        </div>
        <TrendControls
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          zoomMode={zoomMode}
          setZoomMode={setZoomMode}
          isPlaying={isPlaying}
          handlePlayPause={handlePlayPause}
          handleReset={handleReset}
        />
      </CardHeader>
      <CardContent>
        <TrendChart
          data={visibleData}
          chartConfig={chartConfig}
          zoomMode={zoomMode}
          handlePointClick={handlePointClick}
          setZoomDomain={setZoomDomain}
        />
      </CardContent>
      <CardFooter className="flex justify-end">
        <ExportMenu 
          chartRef={chartRef}
          visibleData={visibleData}
        />
      </CardFooter>
    </Card>
  );
}
