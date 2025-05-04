
import { useState, useEffect } from 'react';
import { useChartContext } from '@/components/charts/ChartContext';
import { forecastData } from './forecastData';
import { ForecastDataPoint } from './types';

export const usePrediction = () => {
  const [condition, setCondition] = useState("diabetes");
  const [confidenceLevel, setConfidenceLevel] = useState([95]);
  const [timeframe, setTimeframe] = useState([5]);
  const [visibleData, setVisibleData] = useState<ForecastDataPoint[]>(forecastData);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationStep, setAnimationStep] = useState(4); // Start with showing historical data
  const [highlightPoint, setHighlightPoint] = useState<number | null>(null);
  
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

  // Update visible timeframe
  useEffect(() => {
    // Show all historical data plus prediction years based on timeframe
    const maxPeriod = 4 + timeframe[0]; // 4 historical years + prediction years
    setVisibleData(forecastData.slice(0, maxPeriod + 1));
    setAnimationStep(Math.min(maxPeriod, animationStep));
  }, [timeframe, animationStep]);

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

  return {
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
  };
};
