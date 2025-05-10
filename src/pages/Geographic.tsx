
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HealthMap } from '@/components/geographical/HealthMap';
import { useAuth } from '@/hooks/useAuth';
import { DemoModeIndicator } from '@/components/demo/DemoModeIndicator';
import { HealthDataCategory } from '@/data/demo/DemoDataService';
import { ClaudeAIInsights } from '@/components/ai-insights/ClaudeAIInsights';

const Geographic: React.FC = () => {
  const [category, setCategory] = useState<HealthDataCategory>('obesity');
  const [view, setView] = useState<string>('national');
  const { isDemo } = useAuth();

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Geographic Analysis</h1>
          <p className="text-gray-500">Health metrics by geographic region</p>
        </div>
        <div className="flex items-center gap-4">
          {isDemo && <DemoModeIndicator />}
          <Select value={category} onValueChange={(value) => setCategory(value as HealthDataCategory)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Health Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="obesity">Obesity</SelectItem>
              <SelectItem value="mental-health">Mental Health</SelectItem>
              <SelectItem value="lgbtq-health">LGBTQ+ Health</SelectItem>
              <SelectItem value="chronic-disease">Chronic Disease</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="col-span-1 md:col-span-3">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Geographic Distribution</CardTitle>
                <CardDescription>Health metrics across regions</CardDescription>
              </div>
              <Tabs value={view} onValueChange={setView}>
                <TabsList>
                  <TabsTrigger value="national">National</TabsTrigger>
                  <TabsTrigger value="regional">Regional</TabsTrigger>
                  <TabsTrigger value="county">County</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="h-[500px]">
            <HealthMap category={category} view={view} />
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              Source: Demo data based on CDC and census patterns
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Regional Insights</CardTitle>
            <CardDescription>AI analysis of geographic patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <ClaudeAIInsights 
              data={[]}
              dataSource={category}
              metric="geographic"
            />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Affected Regions</CardTitle>
            <CardDescription>Areas with highest health metric values</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-medium">Region</span>
                <span className="font-medium">Prevalence</span>
              </div>
              
              {[
                { region: category === 'obesity' ? 'Mississippi' : category === 'mental-health' ? 'Oregon' : 'Alabama', value: category === 'obesity' ? '39.5%' : category === 'mental-health' ? '25.2%' : '15.8%' },
                { region: category === 'obesity' ? 'West Virginia' : category === 'mental-health' ? 'Utah' : 'West Virginia', value: category === 'obesity' ? '39.1%' : category === 'mental-health' ? '24.5%' : '14.9%' },
                { region: category === 'obesity' ? 'Alabama' : category === 'mental-health' ? 'Idaho' : 'Mississippi', value: category === 'obesity' ? '38.3%' : category === 'mental-health' ? '23.8%' : '14.2%' },
                { region: category === 'obesity' ? 'Louisiana' : category === 'mental-health' ? 'Oklahoma' : 'Kentucky', value: category === 'obesity' ? '38.0%' : category === 'mental-health' ? '22.9%' : '13.8%' },
                { region: category === 'obesity' ? 'Arkansas' : category === 'mental-health' ? 'Kentucky' : 'Arkansas', value: category === 'obesity' ? '37.5%' : category === 'mental-health' ? '22.6%' : '13.5%' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span>{item.region}</span>
                  <span className="font-medium text-red-500">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Lowest Rate Regions</CardTitle>
            <CardDescription>Areas with lowest health metric values</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-medium">Region</span>
                <span className="font-medium">Prevalence</span>
              </div>
              
              {[
                { region: category === 'obesity' ? 'Colorado' : category === 'mental-health' ? 'New Jersey' : 'Hawaii', value: category === 'obesity' ? '24.2%' : category === 'mental-health' ? '12.9%' : '8.3%' },
                { region: category === 'obesity' ? 'DC' : category === 'mental-health' ? 'Hawaii' : 'California', value: category === 'obesity' ? '24.7%' : category === 'mental-health' ? '13.2%' : '8.7%' },
                { region: category === 'obesity' ? 'Hawaii' : category === 'mental-health' ? 'Florida' : 'Colorado', value: category === 'obesity' ? '25.0%' : category === 'mental-health' ? '14.1%' : '8.9%' },
                { region: category === 'obesity' ? 'California' : category === 'mental-health' ? 'Illinois' : 'Vermont', value: category === 'obesity' ? '26.2%' : category === 'mental-health' ? '14.6%' : '9.2%' },
                { region: category === 'obesity' ? 'Massachusetts' : category === 'mental-health' ? 'Connecticut' : 'Massachusetts', value: category === 'obesity' ? '26.5%' : category === 'mental-health' ? '15.0%' : '9.8%' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span>{item.region}</span>
                  <span className="font-medium text-green-500">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Geographic;
