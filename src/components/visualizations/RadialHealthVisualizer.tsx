
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertCircle, CheckCircle, Download, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import RadialHealthViz from './RadialHealthViz';
import { mockFetchData } from './RadialHealthViz/mockDataService';
import { DataSource, HealthMetric, RadialDataSegment, VisualizationData } from './types';

/**
 * RadialHealthVisualizer component renders health data in a beautiful Art Deco radial visualization
 */
export const RadialHealthVisualizer: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<string>('obesity');
  const [selectedSource, setSelectedSource] = useState<string>('NHANES 2023');
  const [data, setData] = useState<VisualizationData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Available data sources
  const dataSources: DataSource[] = [
    { id: 'NHANES 2023', name: 'NHANES 2023', tier: '1A' },
    { id: 'BRFSS 2024', name: 'BRFSS 2024', tier: '1A' },
    { id: 'WHO GHO', name: 'WHO Global Health Observatory', tier: '1A' },
    { id: 'CDC Wonder', name: 'CDC Wonder Database', tier: '1B' },
    { id: 'FenwayInstitute', name: 'Fenway Institute LGBTQ+ Health', tier: '3' }
  ];
  
  // Available health metrics
  const healthMetrics: HealthMetric[] = [
    { id: 'obesity', name: 'Obesity Rate', unit: '%' },
    { id: 'diabetes', name: 'Diabetes Prevalence', unit: '%' },
    { id: 'hypertension', name: 'Hypertension', unit: '%' },
    { id: 'vaccination', name: 'Vaccination Coverage', unit: '%' }
  ];
  
  // Fetch data when selections change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await mockFetchData(selectedMetric, selectedSource);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [selectedMetric, selectedSource]);
  
  // Get the selected metric details
  const getMetricDetails = (): HealthMetric => {
    return healthMetrics.find(m => m.id === selectedMetric) || healthMetrics[0];
  };
  
  // Get the data source details
  const getSourceDetails = (): DataSource => {
    return dataSources.find(s => s.id === selectedSource) || dataSources[0];
  };
  
  // Get source reliability badge
  const getReliabilityBadge = (reliability: number) => {
    if (reliability >= 0.85) {
      return (
        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" /> High Reliability
        </span>
      );
    } else if (reliability >= 0.7) {
      return (
        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
          <CheckCircle className="w-3 h-3 mr-1" /> Medium Reliability
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
          <AlertCircle className="w-3 h-3 mr-1" /> Low Reliability
        </span>
      );
    }
  };
  
  // Get tier badge
  const getTierBadge = (tier: string) => {
    const colorMap: Record<string, string> = {
      '1A': 'bg-blue-100 text-blue-800',
      '1B': 'bg-indigo-100 text-indigo-800',
      '2': 'bg-purple-100 text-purple-800',
      '3': 'bg-pink-100 text-pink-800'
    };
    
    return (
      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colorMap[tier] || 'bg-gray-100 text-gray-800'}`}>
        Tier {tier}
      </span>
    );
  };

  const handleSegmentClick = (segment: any) => {
    console.log('Segment clicked:', segment);
    // Here you could implement drill-down functionality
  };
  
  return (
    <Card className="art-deco-card">
      <CardHeader className="art-deco-card-header">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="art-deco-title">
              Health Metrics Visualization
            </CardTitle>
            <CardDescription className="art-deco-subtitle">
              Explore demographic patterns in health data
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="border-gold-500/50 text-gold-400 hover:bg-midnight-800"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-400"></div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-red-500">
              <AlertCircle className="w-8 h-8 mx-auto mb-2" />
              <p>{error}</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-sm text-gold-300 mb-1 block">Health Metric</label>
                <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                  <SelectTrigger className="art-deco-input">
                    <SelectValue placeholder="Select metric" />
                  </SelectTrigger>
                  <SelectContent className="bg-midnight-800 border-gold-500/30">
                    {healthMetrics.map(metric => (
                      <SelectItem key={metric.id} value={metric.id} className="text-gold-50">
                        {metric.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm text-gold-300 mb-1 block">Data Source</label>
                <div className="flex gap-2 items-center">
                  <div className="flex-grow">
                    <Select value={selectedSource} onValueChange={setSelectedSource}>
                      <SelectTrigger className="art-deco-input">
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                      <SelectContent className="bg-midnight-800 border-gold-500/30">
                        {dataSources.map(source => (
                          <SelectItem key={source.id} value={source.id} className="text-gold-50">
                            <div className="flex items-center justify-between">
                              <span>{source.name}</span>
                              {getTierBadge(source.tier)}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-gold-400 hover:bg-midnight-800 p-2">
                          <Info className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-midnight-800 border-gold-500/30">
                        <p className="text-gold-100 text-xs max-w-xs">
                          Data sources are classified by tiers:
                          <br />
                          • Tier 1A: Verified government sources (NHANES, WHO)
                          <br />
                          • Tier 1B: Selected CDC/NIH data
                          <br />
                          • Tier 2: Archived government data
                          <br />
                          • Tier 3: Independent sources
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
            
            <div className="h-96">
              {data && (
                <RadialHealthViz
                  data={data.data}
                  valueField="value"
                  labelField="category"
                  title={getMetricDetails().name}
                  subtitle={`Source: ${getSourceDetails().name}`}
                  colorRange={data.data.map(d => d.color)}
                  innerRadius={0.3}
                  showLabels={true}
                  animate={true}
                  onSegmentClick={handleSegmentClick}
                />
              )}
            </div>
            
            {data && (
              <div className="mt-3 flex justify-end">
                {getReliabilityBadge(data.metadata.reliability)}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
