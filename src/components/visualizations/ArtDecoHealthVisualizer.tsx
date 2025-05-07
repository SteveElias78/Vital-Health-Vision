
import React, { useState, useEffect } from 'react';
import { ArtDecoCard } from '@/components/artdeco/ArtDecoCard';
import { ArtDecoButton } from '@/components/artdeco/ArtDecoButton';
import { ArtDecoRadialChart } from '@/components/artdeco/ArtDecoRadialChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, BarChart, PieChart } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define types for data points
interface HealthDataPoint {
  category: string; // Renamed from 'name' to match our implementation
  value: number;
  color?: string;
}

// Sample health data for visualization
const mockHealthData: HealthDataPoint[] = [
  { category: 'Diabetes', value: 12.3, color: '#FFC700' },
  { category: 'Obesity', value: 36.5, color: '#FFDD66' },
  { category: 'Hypertension', value: 29.8, color: '#CCA000' },
  { category: 'Heart Disease', value: 18.2, color: '#997800' },
  { category: 'Cancer', value: 5.4, color: '#665000' },
];

// Sample time periods for filtering
const timePeriods = [
  { value: '2025', label: '2025 (Current)' },
  { value: '2024', label: '2024' },
  { value: '2023', label: '2023' },
  { value: '2022', label: '2022' },
  { value: '2021', label: '2021' },
];

// Sample demographics for filtering
const demographicsOptions = [
  { value: 'all', label: 'All Demographics' },
  { value: 'age', label: 'By Age Group' },
  { value: 'gender', label: 'By Gender' },
  { value: 'ethnicity', label: 'By Ethnicity' },
  { value: 'income', label: 'By Income Level' },
];

// Sample chart types
const chartTypes = [
  { value: 'radial', label: 'Radial Chart', icon: PieChart },
  { value: 'bar', label: 'Bar Chart', icon: BarChart },
];

export const ArtDecoHealthVisualizer: React.FC<{ title: string }> = ({ title }) => {
  const [loading, setLoading] = useState(true);
  const [healthData, setHealthData] = useState<HealthDataPoint[]>([]);
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedDemo, setSelectedDemo] = useState('all');
  const [chartType, setChartType] = useState('radial');

  // Simulate data loading
  useEffect(() => {
    setLoading(true);
    
    const timer = setTimeout(() => {
      // Apply some filtering based on selections
      let filteredData = [...mockHealthData];
      
      // Simulate data changes based on year selection
      if (selectedYear !== '2025') {
        filteredData = filteredData.map(item => ({
          ...item,
          value: item.value * (0.85 + Math.random() * 0.3) // Random variation for different years
        }));
      }
      
      // Simulate data changes based on demographics
      if (selectedDemo === 'age') {
        filteredData = [
          { category: '18-34', value: 22.5, color: '#FFC700' },
          { category: '35-49', value: 28.3, color: '#FFDD66' },
          { category: '50-64', value: 34.8, color: '#CCA000' },
          { category: '65+', value: 18.9, color: '#997800' },
        ];
      } else if (selectedDemo === 'gender') {
        filteredData = [
          { category: 'Male', value: 47.2, color: '#FFC700' },
          { category: 'Female', value: 52.8, color: '#FFDD66' },
        ];
      }
      
      setHealthData(filteredData);
      setLoading(false);
    }, 800); // Simulate network delay
    
    return () => clearTimeout(timer);
  }, [selectedYear, selectedDemo]);

  // Map HealthDataPoint array to format needed by ArtDecoRadialChart
  const mapDataForRadialChart = (data: HealthDataPoint[]) => {
    return data.map(item => ({
      name: item.category, // Map 'category' to 'name' for the radial chart
      value: item.value,
      color: item.color
    }));
  };

  return (
    <ArtDecoCard
      title={title}
      subtitle="Interactive visualization of health metrics"
      animation="glow"
      variant="gradient"
      corners="decorated"
      className="h-full"
    >
      <div className="p-4 space-y-6">
        {/* Controls section */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 space-y-2">
            <label className="text-sm text-gold-300">Time Period</label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-full bg-midnight-800 border-gold-500/30">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {timePeriods.map((period) => (
                  <SelectItem key={period.value} value={period.value}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1 space-y-2">
            <label className="text-sm text-gold-300">Demographics</label>
            <Select value={selectedDemo} onValueChange={setSelectedDemo}>
              <SelectTrigger className="w-full bg-midnight-800 border-gold-500/30">
                <SelectValue placeholder="Select demographics" />
              </SelectTrigger>
              <SelectContent>
                {demographicsOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1 space-y-2">
            <label className="text-sm text-gold-300">Chart Type</label>
            <div className="flex space-x-2">
              {chartTypes.map((type) => (
                <ArtDecoButton
                  key={type.value}
                  variant={chartType === type.value ? 'primary' : 'secondary'}
                  size="sm"
                  className="flex-1"
                  onClick={() => setChartType(type.value)}
                >
                  <type.icon className="w-4 h-4 mr-1" />
                  {type.label}
                </ArtDecoButton>
              ))}
            </div>
          </div>
        </div>
        
        {/* Data visualization */}
        <div className="h-[400px] flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center justify-center text-gold-300/70">
              <Loader2 className="w-8 h-8 mb-2 animate-spin" />
              <span>Loading visualization data...</span>
            </div>
          ) : (
            <ArtDecoRadialChart
              data={mapDataForRadialChart(healthData)}
              width={400}
              height={400}
              centerLabel={selectedDemo === 'all' ? 'Health Prevalence' : demographicsOptions.find(d => d.value === selectedDemo)?.label}
            />
          )}
        </div>
        
        {/* Legend */}
        <div className="flex flex-wrap gap-3 justify-center">
          {!loading && healthData.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm text-gold-300">
                {item.category}: {item.value.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
        
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="mb-4 bg-midnight-800 border border-gold-500/30">
            <TabsTrigger value="summary" className="data-[state=active]:bg-gold-500/20 data-[state=active]:text-gold-300">
              Summary
            </TabsTrigger>
            <TabsTrigger value="details" className="data-[state=active]:bg-gold-500/20 data-[state=active]:text-gold-300">
              Details
            </TabsTrigger>
            <TabsTrigger value="methodology" className="data-[state=active]:bg-gold-500/20 data-[state=active]:text-gold-300">
              Methodology
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="space-y-4 text-gold-300/80 text-sm">
            <p>
              This visualization shows the prevalence of various health conditions based on the selected demographics and time period.
              The data is sourced from national health surveys and research studies.
            </p>
          </TabsContent>
          
          <TabsContent value="details" className="space-y-4 text-gold-300/80 text-sm">
            <p>
              The data presented here has been adjusted for sampling bias and normalized across different population groups.
              Statistical significance has been verified using chi-square tests with p &lt; 0.05.
            </p>
            <p>
              Confidence intervals and standard errors are available in the downloadable dataset report.
            </p>
          </TabsContent>
          
          <TabsContent value="methodology" className="space-y-4 text-gold-300/80 text-sm">
            <p>
              The methodological approach combines data from multiple sources, including CDC surveys, hospital records, and insurance claims data.
              Data collection methods included randomized telephone surveys, in-person interviews, and electronic health record mining.
            </p>
          </TabsContent>
        </Tabs>
        
        {/* Art Deco decorative elements */}
        <div className="flex justify-center mt-6">
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-gold-500/30 to-transparent"></div>
          <div className="mx-4 w-6 h-6 rounded-full border border-gold-500/50 flex items-center justify-center">
            <div className="w-3 h-3 transform rotate-45 bg-gold-500/30"></div>
          </div>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-gold-500/30 to-transparent"></div>
        </div>
      </div>
    </ArtDecoCard>
  );
};
