
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DemographicsBreakdown } from '@/components/DemographicsBreakdown';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HealthDataVisualization, getDefaultHealthData } from '@/components/dashboard/HealthDataVisualization';
import { DataTrends } from '@/components/DataTrends';
import { HealthMap } from '@/components/geographical/HealthMap';
import { PredictionModel } from '@/components/PredictionModel';
import { ClaudeAIInsights } from '@/components/ai-insights/ClaudeAIInsights';
import { ChartProvider } from '@/components/charts/ChartContext';
import { DemoModeIndicator } from '@/components/demo/DemoModeIndicator';
import { useAuth } from '@/hooks/useAuth';

const Demographics: React.FC = () => {
  const [category, setCategory] = useState<string>('obesity');
  const [timeFrame, setTimeFrame] = useState<string>('3y');
  const { isDemo } = useAuth();
  
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Demographic Analysis</h1>
            <p className="text-gray-500">Health metrics by demographic groups</p>
          </div>
          <div className="flex items-center gap-4">
            {isDemo && <DemoModeIndicator />}
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Health Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="obesity">Obesity</SelectItem>
                <SelectItem value="mental-health">Mental Health</SelectItem>
                <SelectItem value="diabetes">Diabetes</SelectItem>
                <SelectItem value="heart-disease">Heart Disease</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={timeFrame} onValueChange={setTimeFrame}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1y">Last Year</SelectItem>
                <SelectItem value="3y">Last 3 Years</SelectItem>
                <SelectItem value="5y">Last 5 Years</SelectItem>
                <SelectItem value="10y">Last 10 Years</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <ChartProvider>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <DemographicsBreakdown />
            <ClaudeAIInsights 
              data={getDefaultHealthData()} 
              dataSource={category as any}
              metric="prevalence"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <DataTrends />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <HealthMap category={category} />
            <PredictionModel />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>Age Distribution Analysis</CardTitle>
                <CardDescription>Distribution of health conditions across age groups</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <HealthDataVisualization 
                  data={getDefaultHealthData()}
                  title="Age Group Distribution"
                  centerText="Average"
                  centerValue={34.9}
                  unit="%"
                />
              </CardContent>
              <CardFooter>
                <div className="text-xs text-muted-foreground">
                  Source: Demo data based on CDC patterns
                </div>
              </CardFooter>
            </Card>
            
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>Socioeconomic Factors</CardTitle>
                <CardDescription>Impact of education and income on health outcomes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center border rounded">
                  <p className="text-center text-gray-500">
                    Socioeconomic analysis visualization would appear here in the full implementation
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <div className="text-xs text-muted-foreground">
                  Source: Demo data based on health equity research
                </div>
              </CardFooter>
            </Card>
          </div>
        </ChartProvider>
      </div>
    </DashboardLayout>
  );
};

export default Demographics;
