
import React, { useState, useEffect } from 'react';
import { ArtDecoRadialChart } from '@/components/artdeco';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChartPie, Info } from "lucide-react";

interface HealthDataPoint {
  category: string;
  value: number;
  color?: string;
}

interface HealthVisualizerProps {
  title?: string;
  className?: string;
}

export const ArtDecoHealthVisualizer: React.FC<HealthVisualizerProps> = ({ 
  title = "Health Data Visualization", 
  className 
}) => {
  const [selectedMetric, setSelectedMetric] = useState<string>('obesity');
  const [selectedRegion, setSelectedRegion] = useState<string>('national');
  const [loading, setLoading] = useState<boolean>(false);
  const [visualizationData, setVisualizationData] = useState<HealthDataPoint[]>([]);
  
  // List of available metrics
  const metrics = [
    { id: 'obesity', name: 'Obesity Rates', unit: '%', centerText: 'Average Rate' },
    { id: 'diabetes', name: 'Diabetes Prevalence', unit: '%', centerText: 'Average Rate' },
    { id: 'vaccination', name: 'Vaccination Coverage', unit: '%', centerText: 'Coverage Rate' },
    { id: 'heart-disease', name: 'Heart Disease Risk', unit: '%', centerText: 'Risk Factors' }
  ];
  
  // List of regions
  const regions = [
    { id: 'national', name: 'National Average' },
    { id: 'midwest', name: 'Midwest Region' },
    { id: 'south', name: 'Southern States' },
    { id: 'northeast', name: 'Northeast Region' },
    { id: 'west', name: 'Western States' }
  ];

  // Generate mock data based on selected metric and region
  useEffect(() => {
    setLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      const data = generateMockData(selectedMetric, selectedRegion);
      setVisualizationData(data);
      setLoading(false);
    }, 800);
  }, [selectedMetric, selectedRegion]);
  
  // Get selected metric details
  const getSelectedMetricDetails = () => {
    return metrics.find(m => m.id === selectedMetric) || metrics[0];
  };
  
  // Generate mock health data
  const generateMockData = (metric: string, region: string): HealthDataPoint[] => {
    // Define color palettes for each metric in Art Deco style
    const colorPalettes: Record<string, string[]> = {
      obesity: ['#FFC700', '#FFD233', '#FFDD66', '#CCA000', '#997800'],
      diabetes: ['#D4A010', '#E1AF29', '#EFC44F', '#C48C0C', '#A37707'],
      vaccination: ['#F9CA24', '#F0932B', '#FFE066', '#F8C471', '#F5B041'],
      'heart-disease': ['#F39C12', '#E67E22', '#F7DC6F', '#F0B27A', '#EB984E']
    };

    // Define categories for each metric
    const categories: Record<string, string[]> = {
      obesity: ['Adults 18-34', 'Adults 35-64', 'Adults 65+', 'Adolescents', 'Children'],
      diabetes: ['Type 1', 'Type 2', 'Gestational', 'Prediabetes', 'Other'],
      vaccination: ['COVID-19', 'Influenza', 'HPV', 'Tetanus', 'Pneumococcal'],
      'heart-disease': ['Hypertension', 'High Cholesterol', 'Smoking', 'Obesity', 'Inactivity']
    };

    // Create base values that will be adjusted by region
    const baseValues: Record<string, number[]> = {
      obesity: [24.6, 32.4, 29.8, 19.3, 17.5],
      diabetes: [5.2, 11.8, 4.6, 33.1, 2.5],
      vaccination: [73.5, 52.1, 68.9, 86.3, 62.7],
      'heart-disease': [32.6, 28.9, 21.4, 39.8, 17.1]
    };

    // Adjust values based on region (adding some variation)
    const regionFactors: Record<string, number> = {
      national: 1.0,
      midwest: 1.05,
      south: 1.15,
      northeast: 0.92,
      west: 0.95
    };

    const colors = colorPalettes[metric] || colorPalettes.obesity;
    const metricCategories = categories[metric] || categories.obesity;
    const values = baseValues[metric] || baseValues.obesity;
    const factor = regionFactors[region] || 1.0;

    return metricCategories.map((category, index) => ({
      category,
      value: Math.max(1, Math.min(99, values[index] * factor * (0.9 + Math.random() * 0.2))),
      color: colors[index % colors.length]
    }));
  };

  const selectedMetricDetails = getSelectedMetricDetails();

  return (
    <Card className="art-deco-card overflow-hidden relative">
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-gold-500/50 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-gold-500/50 pointer-events-none"></div>
      
      <CardHeader className="art-deco-card-header">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="art-deco-title flex items-center">
              <ChartPie className="mr-2 h-5 w-5 text-gold-400/70" />
              {title}
            </CardTitle>
            <CardDescription className="art-deco-subtitle">
              Visualizing patterns in health data with Art Deco elegance
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-sm text-gold-300 mb-2 block">Health Metric</label>
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="art-deco-select-trigger">
                <SelectValue placeholder="Select a metric" />
              </SelectTrigger>
              <SelectContent className="art-deco-select-content">
                {metrics.map(metric => (
                  <SelectItem key={metric.id} value={metric.id}>{metric.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm text-gold-300 mb-2 block">Region</label>
            <div className="flex gap-2 items-center">
              <Select value={selectedRegion} onValueChange={setSelectedRegion} className="flex-grow">
                <SelectTrigger className="art-deco-select-trigger">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent className="art-deco-select-content">
                  {regions.map(region => (
                    <SelectItem key={region.id} value={region.id}>{region.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="h-9 w-9 flex items-center justify-center rounded border border-gold-500/30 text-gold-400 hover:bg-midnight-800">
                      <Info className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-midnight-800 border border-gold-500/30 text-gold-50">
                    <p className="max-w-xs">
                      Regional data reflects demographic variations.
                      Southern states typically show higher rates of chronic conditions.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center min-h-[400px] art-deco-border-animate">
          {loading ? (
            <div className="art-deco-loader">
              <div className="h-12 w-12 border-2 border-t-gold-400 border-gold-400/30 rounded-full animate-spin"></div>
            </div>
          ) : (
            <ArtDecoRadialChart
              data={visualizationData}
              title={selectedMetricDetails.name}
              centerText={selectedMetricDetails.centerText}
              unit={selectedMetricDetails.unit}
            />
          )}
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-gold-300/70 text-sm">
            Data source: CDC Health Statistics {new Date().getFullYear()}
          </p>
        </div>
      </CardContent>
      
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-gold-500/50 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-gold-500/50 pointer-events-none"></div>
    </Card>
  );
};
