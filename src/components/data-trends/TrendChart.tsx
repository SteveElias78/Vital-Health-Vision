
import { useRef, useState } from 'react';
import { ChartContainer } from '@/components/ui/chart';
import { useChartContext } from '@/components/charts/ChartContext';
import { SelectedPointInfo } from './SelectedPointInfo';
import { TrendLineChart } from './TrendLineChart';
import { TrendDataPoint, ZoomDomain } from './types';

interface TrendChartProps {
  data: TrendDataPoint[];
  chartConfig: any;
  zoomMode: 'zoom' | 'pan' | 'select';
  handlePointClick: (data: any, index: number) => void;
  setZoomDomain: (domain: ZoomDomain | null) => void;
}

export function TrendChart({
  data,
  chartConfig,
  zoomMode,
  handlePointClick,
  setZoomDomain
}: TrendChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const { selectedPoint, setSelectedPoint } = useChartContext();
  const [refAreaLeft, setRefAreaLeft] = useState<string | null>(null);
  const [refAreaRight, setRefAreaRight] = useState<string | null>(null);

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
    const leftIndex = data.findIndex(d => d.month === refAreaLeft);
    const rightIndex = data.findIndex(d => d.month === refAreaRight);

    if (leftIndex >= 0 && rightIndex >= 0) {
      // Convert string values to numbers using type assertion
      setZoomDomain({
        x: [refAreaLeft, refAreaRight] as unknown as [number, number],
        y: null
      });
    }

    setRefAreaLeft(null);
    setRefAreaRight(null);
  };

  return (
    <div className="h-[300px] w-full relative" ref={chartRef}>
      <ChartContainer config={chartConfig} className="h-full">
        <TrendLineChart 
          data={data}
          handleMouseDown={handleMouseDown}
          handleMouseMove={handleMouseMove}
          handleMouseUp={handleMouseUp}
          handlePointClick={handlePointClick}
          refAreaLeft={refAreaLeft}
          refAreaRight={refAreaRight}
        />
      </ChartContainer>
      
      <SelectedPointInfo 
        selectedPoint={selectedPoint as TrendDataPoint} 
        setSelectedPoint={setSelectedPoint} 
      />
    </div>
  );
}
