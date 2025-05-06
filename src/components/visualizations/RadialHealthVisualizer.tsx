
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertCircle, CheckCircle, Download, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockFetchData } from './mockDataService';
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
  const svgRef = useRef<SVGSVGElement>(null);
  
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
  
  // Custom SVG radial visualization with Art Deco styling
  const renderRadialVisualization = () => {
    if (!data || !data.data || data.data.length === 0) {
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-gold-300">No data available</p>
        </div>
      );
    }
    
    const metricDetails = getMetricDetails();
    const total = data.data.reduce((sum, item) => sum + item.value, 0);
    const centerRadius = 100; // Central circle radius
    const segmentWidth = 50;  // Width of each radial segment
    const size = 400;         // SVG size
    const center = size / 2;  // Center point
    
    // Calculate angles for each segment
    let currentAngle = 0;
    const segments: RadialDataSegment[] = data.data.map((item, index) => {
      const percentage = item.value / total;
      const angle = percentage * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      currentAngle = endAngle;
      
      return {
        ...item,
        startAngle,
        endAngle,
        percentage
      };
    });
    
    // SVG path generator for radial segments with Art Deco styling
    const createRadialPath = (segment: RadialDataSegment, innerRadius: number, outerRadius: number) => {
      const startAngleRad = ((segment.startAngle || 0) - 90) * Math.PI / 180;
      const endAngleRad = ((segment.endAngle || 0) - 90) * Math.PI / 180;
      
      const innerStartX = center + innerRadius * Math.cos(startAngleRad);
      const innerStartY = center + innerRadius * Math.sin(startAngleRad);
      const innerEndX = center + innerRadius * Math.cos(endAngleRad);
      const innerEndY = center + innerRadius * Math.sin(endAngleRad);
      
      const outerStartX = center + outerRadius * Math.cos(startAngleRad);
      const outerStartY = center + outerRadius * Math.sin(startAngleRad);
      const outerEndX = center + outerRadius * Math.cos(endAngleRad);
      const outerEndY = center + outerRadius * Math.sin(endAngleRad);
      
      const largeArcFlag = (segment.endAngle || 0) - (segment.startAngle || 0) > 180 ? 1 : 0;
      
      // Generate the path with Art Deco styling
      return `
        M ${innerStartX} ${innerStartY}
        L ${outerStartX} ${outerStartY}
        A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEndX} ${outerEndY}
        L ${innerEndX} ${innerEndY}
        A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStartX} ${innerStartY}
        Z
      `;
    };
    
    // Generate decorative elements - radial lines
    const createDecorativeLines = () => {
      const lines = [];
      const numLines = 72; // Divide circle into 72 segments (every 5 degrees)
      
      for (let i = 0; i < numLines; i++) {
        const angle = (i * 360 / numLines - 90) * Math.PI / 180;
        const innerRadius = centerRadius - 5;
        const outerRadius = centerRadius + segmentWidth + 15;
        
        const x1 = center + innerRadius * Math.cos(angle);
        const y1 = center + innerRadius * Math.sin(angle);
        const x2 = center + outerRadius * Math.cos(angle);
        const y2 = center + outerRadius * Math.sin(angle);
        
        // Make some lines more prominent for Art Deco effect
        const strokeWidth = i % 9 === 0 ? 1 : 0.3;
        const opacity = i % 9 === 0 ? 0.8 : 0.2;
        
        lines.push(
          <line 
            key={`line-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#FFC700"
            strokeWidth={strokeWidth}
            opacity={opacity}
          />
        );
      }
      
      return lines;
    };
    
    return (
      <div className="relative h-96 w-full">
        <svg ref={svgRef} width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
          {/* Background decorative elements */}
          <circle 
            cx={center} 
            cy={center} 
            r={centerRadius + segmentWidth + 20} 
            fill="none" 
            stroke="#FFC700" 
            strokeWidth="0.5" 
            opacity="0.3"
          />
          
          <circle 
            cx={center} 
            cy={center} 
            r={centerRadius - 10} 
            fill="none" 
            stroke="#FFC700" 
            strokeWidth="0.5" 
            opacity="0.3"
          />
          
          {/* Decorative radial lines */}
          {createDecorativeLines()}
          
          {/* Data segments */}
          {segments.map((segment, index) => (
            <g key={`segment-${index}`}>
              <path 
                d={createRadialPath(segment, centerRadius, centerRadius + segmentWidth)}
                fill={segment.color}
                opacity="0.9"
                stroke="#000"
                strokeWidth="0.5"
              >
                <title>{`${segment.category}: ${segment.value.toFixed(1)}${metricDetails.unit}`}</title>
              </path>
              
              {/* Text labels */}
              {(segment.percentage || 0) > 0.1 && (
                <text
                  x={center + (centerRadius + segmentWidth / 2) * Math.cos(((segment.startAngle || 0) + (segment.endAngle || 0)) / 2 * Math.PI / 180)}
                  y={center + (centerRadius + segmentWidth / 2) * Math.sin(((segment.startAngle || 0) + (segment.endAngle || 0)) / 2 * Math.PI / 180)}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fontSize="12"
                  fill="#fff"
                  fontWeight="300"
                  transform={`rotate(${((segment.startAngle || 0) + (segment.endAngle || 0)) / 2}, ${center + (centerRadius + segmentWidth / 2) * Math.cos(((segment.startAngle || 0) + (segment.endAngle || 0)) / 2 * Math.PI / 180)}, ${center + (centerRadius + segmentWidth / 2) * Math.sin(((segment.startAngle || 0) + (segment.endAngle || 0)) / 2 * Math.PI / 180)})`}
                >
                  {segment.category}
                </text>
              )}
            </g>
          ))}
          
          {/* Center circle with metric value */}
          <circle 
            cx={center} 
            cy={center} 
            r={centerRadius - 5} 
            fill="#000723" 
            stroke="#FFC700" 
            strokeWidth="1"
          />
          
          <text
            x={center}
            y={center - 15}
            textAnchor="middle"
            fontSize="14"
            fill="#FFC700"
            fontWeight="300"
          >
            {metricDetails.name}
          </text>
          
          <text
            x={center}
            y={center + 20}
            textAnchor="middle"
            fontSize="28"
            fill="#FFC700"
            fontWeight="400"
          >
            {(data.data.reduce((sum, item) => sum + item.value, 0) / data.data.length).toFixed(1)}
            <tspan fontSize="16">{metricDetails.unit}</tspan>
          </text>
          
          {/* Art Deco decorative elements */}
          <line 
            x1={center - 50} 
            y1={center - 40} 
            x2={center + 50} 
            y2={center - 40} 
            stroke="#FFC700" 
            strokeWidth="0.5" 
          />
          
          <line 
            x1={center - 50} 
            y1={center + 40} 
            x2={center + 50} 
            y2={center + 40} 
            stroke="#FFC700" 
            strokeWidth="0.5" 
          />
          
          {/* Data source indicator */}
          <text
            x={center}
            y={size - 20}
            textAnchor="middle"
            fontSize="10"
            fill="#FFC700"
            opacity="0.7"
          >
            {data.metadata.source} • {new Date(data.metadata.lastUpdated).getFullYear()}
          </text>
        </svg>
        
        {/* Floating data source reliability indicator */}
        <div className="absolute top-2 right-2">
          {getReliabilityBadge(data.metadata.reliability)}
        </div>
      </div>
    );
  };
  
  // Download the visualization as SVG
  const handleDownloadSVG = () => {
    if (svgRef.current) {
      // Create a serialized SVG string
      const svgData = new XMLSerializer().serializeToString(svgRef.current);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      
      // Create a download link and trigger it
      const downloadLink = document.createElement('a');
      downloadLink.href = svgUrl;
      downloadLink.download = `vital-health-vision_${selectedMetric}_${selectedSource.replace(/\s/g, '-')}.svg`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      // Clean up the URL object
      URL.revokeObjectURL(svgUrl);
    }
  };
  
  return (
    <Card className="border border-gold-300 overflow-hidden bg-gradient-to-br from-midnight-900 to-midnight-950">
      <CardHeader className="bg-gradient-to-r from-midnight-800 to-midnight-900 border-b border-gold-500/30">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-gold-400">
              Health Metrics Visualization
            </CardTitle>
            <CardDescription className="text-gold-100/70">
              Explore demographic patterns in health data
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="border-gold-500/50 text-gold-400 hover:bg-midnight-800"
            onClick={handleDownloadSVG}
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
                  <SelectTrigger className="bg-midnight-800 border-gold-500/30 text-gold-50">
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
                  <Select value={selectedSource} onValueChange={setSelectedSource} className="flex-grow">
                    <SelectTrigger className="bg-midnight-800 border-gold-500/30 text-gold-50">
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
            
            {renderRadialVisualization()}
          </>
        )}
      </CardContent>
    </Card>
  );
};
