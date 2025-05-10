
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { demoDataService } from '@/data/demo/DemoDataService';
import { MapPinned, Loader } from 'lucide-react';

interface HealthMapProps {
  category?: string;
  metric?: string;
}

export const HealthMap: React.FC<HealthMapProps> = ({
  category = 'obesity',
  metric = 'prevalence'
}) => {
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<string>('national');
  const [selectedMetric, setSelectedMetric] = useState<string>(metric);
  const [mapData, setMapData] = useState<any>(null);

  // Load map data when component mounts
  useEffect(() => {
    const loadMapData = async () => {
      setLoading(true);
      try {
        // In a real app this would load actual map data
        // For the demo, we'll use the regional data from DemoDataService
        const { data } = await demoDataService.getHealthData(category as any);
        setMapData(data.regional || []);
      } catch (err) {
        console.error('Error loading map data:', err);
      } finally {
        // Add a delay to simulate map loading
        setTimeout(() => setLoading(false), 800);
      }
    };
    
    loadMapData();
  }, [category]);

  // Get highest value state
  const getHighestValueState = () => {
    if (!mapData || mapData.length === 0) return 'N/A';
    
    const highest = [...mapData].sort((a, b) => b.value - a.value)[0];
    return highest.locationdesc;
  };
  
  // Get lowest value state
  const getLowestValueState = () => {
    if (!mapData || mapData.length === 0) return 'N/A';
    
    const lowest = [...mapData].sort((a, b) => a.value - b.value)[0];
    return lowest.locationdesc;
  };
  
  // Get national average
  const getNationalAverage = () => {
    if (!mapData || mapData.length === 0) return 'N/A';
    
    const sum = mapData.reduce((acc: number, curr: any) => acc + curr.value, 0);
    return (sum / mapData.length).toFixed(1) + '%';
  };
  
  // Placeholder for the proper map visualization
  // In a real implementation, this would render an actual map using D3 or a mapping library
  const renderMapPlaceholder = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-[300px]">
          <Loader className="h-8 w-8 animate-spin text-gold-400" />
        </div>
      );
    }
    
    return (
      <div className="h-[300px] border border-gold-500/30 rounded-lg overflow-hidden bg-midnight-950/50 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPinned className="h-12 w-12 mx-auto mb-2 text-gold-400/50" />
            <h3 className="text-lg font-medium text-gold-400">Geographic Health Map</h3>
            <p className="text-sm text-gold-300/70 max-w-[80%] mx-auto">
              This placeholder represents an interactive map showing regional {category.replace('-', ' ')} data.
            </p>
          </div>
        </div>
        
        {/* Map overlay for regional highlights - just for visual effect in the demo */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-[28%] left-[20%] w-[12%] h-[16%] bg-green-500/40 rounded-full blur-md"></div>
          <div className="absolute top-[45%] left-[35%] w-[15%] h-[25%] bg-yellow-500/30 rounded-full blur-md"></div>
          <div className="absolute top-[30%] left-[60%] w-[18%] h-[12%] bg-blue-500/30 rounded-full blur-md"></div>
          <div className="absolute top-[60%] left-[55%] w-[10%] h-[15%] bg-red-500/40 rounded-full blur-md"></div>
          <div className="absolute top-[50%] left-[80%] w-[15%] h-[10%] bg-purple-500/30 rounded-full blur-md"></div>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Geographic Distribution</CardTitle>
            <CardDescription>Regional health data comparison</CardDescription>
          </div>
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="national">National</SelectItem>
              <SelectItem value="northeast">Northeast</SelectItem>
              <SelectItem value="midwest">Midwest</SelectItem>
              <SelectItem value="south">South</SelectItem>
              <SelectItem value="west">West</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {renderMapPlaceholder()}
        
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="bg-midnight-900/50 border border-gold-500/20 rounded-lg p-3 text-center">
            <div className="text-sm font-medium text-gold-300">Highest</div>
            <div className="text-lg font-bold text-gold-400">{getHighestValueState()}</div>
          </div>
          
          <div className="bg-midnight-900/50 border border-gold-500/20 rounded-lg p-3 text-center">
            <div className="text-sm font-medium text-gold-300">Average</div>
            <div className="text-lg font-bold text-gold-400">{getNationalAverage()}</div>
          </div>
          
          <div className="bg-midnight-900/50 border border-gold-500/20 rounded-lg p-3 text-center">
            <div className="text-sm font-medium text-gold-300">Lowest</div>
            <div className="text-lg font-bold text-gold-400">{getLowestValueState()}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex justify-between w-full text-xs text-gold-300/50">
          <span>Source: CDC & State Health Departments</span>
          <span>Updated May 2025</span>
        </div>
      </CardFooter>
    </Card>
  );
};
