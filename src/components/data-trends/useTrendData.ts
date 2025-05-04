
import { useState, useEffect } from 'react';
import { useChartContext } from '@/components/charts/ChartContext';
import { animateTimeSeries } from '@/components/charts/chartUtils';
import { trendData, transformedTrendData } from './data';
import { TrendDataPoint } from './types';

export function useTrendData() {
  const [timeRange, setTimeRange] = useState("7d");
  const [visibleData, setVisibleData] = useState(trendData);
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoomMode, setZoomMode] = useState<'zoom' | 'pan' | 'select'>('select');
  
  const { 
    filters, 
    setFilters, 
    setSelectedPoint,
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
  const handlePointClick = (data: TrendDataPoint, index: number) => {
    setSelectedPoint(data);
    
    // Update filters based on the clicked point
    setFilters({
      ...filters,
      condition: Object.keys(data).find(key => 
        key !== 'month' && key !== 'date' && data[key] === Math.max(data['Heart Disease'], data['Diabetes'], data['Obesity'])
      )
    });
  };

  return {
    timeRange,
    setTimeRange,
    visibleData,
    setVisibleData,
    isPlaying,
    setIsPlaying,
    zoomMode,
    setZoomMode,
    handleReset,
    handlePlayPause,
    handlePointClick
  };
}
