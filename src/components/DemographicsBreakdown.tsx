
import { useState, useRef, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend, Brush, Cell
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Download, ZoomIn, ZoomOut, MousePointer } from 'lucide-react';
import { useChartContext } from '@/components/charts/ChartContext';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { exportChartAsImage, exportChartDataAsCSV } from '@/components/charts/chartUtils';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Tooltip as TooltipComponent, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Enhanced sample data
const demographicsData = [
  { age: '18-24', male: 400, female: 800, malePercent: 15, femalePercent: 22 },
  { age: '25-34', male: 700, female: 1000, malePercent: 21, femalePercent: 28 },
  { age: '35-44', male: 1000, female: 750, malePercent: 30, femalePercent: 24 },
  { age: '45-54', male: 930, female: 880, malePercent: 35, femalePercent: 30 },
  { age: '55-64', male: 800, female: 820, malePercent: 40, femalePercent: 38 },
  { age: '65+', male: 500, female: 600, malePercent: 42, femalePercent: 45 },
];

// Chart config
const chartConfig = {
  'male': { label: 'Male', theme: { light: '#0EA5E9', dark: '#38BDF8' } },
  'female': { label: 'Female', theme: { light: '#D946EF', dark: '#E879F9' } }
};

export function DemographicsBreakdown() {
  const [condition, setCondition] = useState("diabetes");
  const [drilldownData, setDrilldownData] = useState<any | null>(null);
  const [selectedBars, setSelectedBars] = useState<string[]>([]);
  
  const chartRef = useRef<HTMLDivElement>(null);
  const { filters, setFilters } = useChartContext();

  // Apply cross-filtering based on ChartContext filters
  useEffect(() => {
    if (filters.condition) {
      setCondition(filters.condition.toLowerCase());
    }
    if (filters.age) {
      setSelectedBars(filters.age);
    }
  }, [filters]);

  // Custom click handler for bars to drill down
  const handleBarClick = (data: any, barIndex: number, barKey: string) => {
    // If already in drill-down mode, go back to main view
    if (drilldownData) {
      setDrilldownData(null);
      return;
    }
    
    // Set up drill-down data
    const drilldown = {
      age: data.age,
      gender: barKey === 'male' ? 'Male' : 'Female',
      data: [
        { condition: 'Diabetes', value: Math.round(data[barKey] * 0.3) },
        { condition: 'Heart Disease', value: Math.round(data[barKey] * 0.25) },
        { condition: 'Obesity', value: Math.round(data[barKey] * 0.35) },
        { condition: 'Hypertension', value: Math.round(data[barKey] * 0.2) },
      ]
    };
    
    setDrilldownData(drilldown);
    
    // Update global filters
    setFilters({
      ...filters,
      age: [data.age]
    });
  };

  // Toggle bar selection for filtering
  const handleBarSelect = (data: any) => {
    const age = data.age;
    
    if (selectedBars.includes(age)) {
      const newSelectedBars = selectedBars.filter(b => b !== age);
      setSelectedBars(newSelectedBars);
      
      // Update global filters
      setFilters({
        ...filters,
        age: newSelectedBars.length > 0 ? newSelectedBars : undefined
      });
    } else {
      const newSelectedBars = [...selectedBars, age];
      setSelectedBars(newSelectedBars);
      
      // Update global filters
      setFilters({
        ...filters,
        age: newSelectedBars
      });
    }
  };

  // Filter data based on selections
  const getFilteredData = () => {
    if (selectedBars.length === 0) return demographicsData;
    return demographicsData.filter(item => selectedBars.includes(item.age));
  };

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Demographics Breakdown</CardTitle>
          <CardDescription>Health conditions by age and gender</CardDescription>
        </div>
        <Select value={condition} onValueChange={setCondition}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="diabetes">Diabetes</SelectItem>
            <SelectItem value="heart-disease">Heart Disease</SelectItem>
            <SelectItem value="obesity">Obesity</SelectItem>
            <SelectItem value="hypertension">Hypertension</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent ref={chartRef}>
        <div className="h-[300px]">
          {drilldownData ? (
            // Drill-down view
            <ChartContainer config={chartConfig} className="h-full">
              <div className="mb-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setDrilldownData(null)}
                >
                  ← Back
                </Button>
                <span className="ml-2 text-sm font-medium">
                  {drilldownData.age} Age Group • {drilldownData.gender}
                </span>
              </div>
              <ResponsiveContainer width="100%" height="85%">
                <BarChart
                  data={drilldownData.data}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="condition" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar 
                    dataKey="value" 
                    name="Prevalence" 
                    fill={drilldownData.gender === 'Male' ? '#0EA5E9' : '#D946EF'} 
                    animationDuration={1000}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            // Main view
            <ChartContainer config={chartConfig} className="h-full">
              <TooltipProvider>
                <div className="ml-2 mb-2 text-xs text-muted-foreground flex items-center">
                  <span className="mr-1">Click bars to drill-down. Double-click to filter.</span>
                  <TooltipComponent>
                    <TooltipTrigger>
                      <span className="inline-flex items-center justify-center rounded-full bg-muted h-4 w-4 text-xs">?</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-xs">
                        Click on any bar to see a breakdown by condition. Double-click to filter the bar by age group.
                      </p>
                    </TooltipContent>
                  </TooltipComponent>
                </div>
              </TooltipProvider>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart
                  data={getFilteredData()}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="age" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar 
                    dataKey="male" 
                    name="Male" 
                    fill="#0EA5E9" 
                    onClick={(data, index) => handleBarClick(data, index, 'male')}
                    onDoubleClick={(data) => handleBarSelect(data)}
                    animationDuration={800}
                  >
                    {getFilteredData().map((entry, index) => (
                      <Cell 
                        key={`cell-male-${index}`} 
                        fill={selectedBars.includes(entry.age) ? '#0075ad' : '#0EA5E9'}
                        opacity={selectedBars.length > 0 && !selectedBars.includes(entry.age) ? 0.4 : 1}
                      />
                    ))}
                  </Bar>
                  <Bar 
                    dataKey="female" 
                    name="Female" 
                    fill="#D946EF"
                    onClick={(data, index) => handleBarClick(data, index, 'female')}
                    onDoubleClick={(data) => handleBarSelect(data)}
                    animationDuration={800}
                  >
                    {getFilteredData().map((entry, index) => (
                      <Cell 
                        key={`cell-female-${index}`}
                        fill={selectedBars.includes(entry.age) ? '#a924bd' : '#D946EF'} 
                        opacity={selectedBars.length > 0 && !selectedBars.includes(entry.age) ? 0.4 : 1}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center">
          {selectedBars.length > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setSelectedBars([]);
                setFilters({...filters, age: undefined});
              }}
            >
              Clear Filters
            </Button>
          )}
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
                  onClick={() => exportChartAsImage(chartRef, 'demographics-breakdown')}
                >
                  Export as PNG
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="justify-start"
                  onClick={() => drilldownData 
                    ? exportChartDataAsCSV(drilldownData.data, 'demographics-drilldown-data')
                    : exportChartDataAsCSV(getFilteredData(), 'demographics-data')
                  }
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
