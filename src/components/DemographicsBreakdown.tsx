
import { useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer } from '@/components/ui/chart';
import { useDemographicsData } from '@/components/demographics/useDemographicsData';
import { DrilldownView } from '@/components/demographics/DrilldownView';
import { MainChartView } from '@/components/demographics/MainChartView';
import { ChartControls } from '@/components/demographics/ChartControls';
import { chartConfig } from '@/components/demographics/data';

export function DemographicsBreakdown() {
  const chartRef = useRef<HTMLDivElement>(null);
  const { 
    condition, 
    setCondition, 
    drilldownData, 
    setDrilldownData, 
    selectedBars, 
    handleBarClick, 
    handleBarSelect, 
    getFilteredData 
  } = useDemographicsData();

  // Clear filters handler
  const handleClearFilters = () => {
    const { setFilters } = require('@/components/charts/ChartContext').useChartContext();
    setFilters((prevFilters: any) => ({...prevFilters, age: undefined}));
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
            <DrilldownView 
              drilldownData={drilldownData} 
              onBack={() => setDrilldownData(null)} 
              chartConfig={chartConfig}
            />
          ) : (
            // Main view
            <ChartContainer config={chartConfig} className="h-full">
              <MainChartView 
                filteredData={getFilteredData()} 
                selectedBars={selectedBars} 
                onBarClick={handleBarClick} 
                onBarSelect={handleBarSelect}
                chartConfig={chartConfig}
              />
            </ChartContainer>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <ChartControls 
          chartRef={chartRef} 
          selectedBars={selectedBars}
          onClearFilters={handleClearFilters}
          drilldownData={drilldownData}
          getFilteredData={getFilteredData}
        />
      </CardFooter>
    </Card>
  );
}
