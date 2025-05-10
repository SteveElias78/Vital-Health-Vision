
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart2, LineChart, PieChart } from 'lucide-react';
import { demoDataService, HealthDataCategory } from '@/data/demo/DemoDataService';
import { useAuth } from '@/hooks/useAuth';
import { DemoModeIndicator } from '@/components/demo/DemoModeIndicator';
import { HealthMap } from '@/components/geographical/HealthMap';
import { ClaudeAIInsights } from '@/components/ai-insights/ClaudeAIInsights';
import { CategoryChartView } from '@/components/vital-health-dashboard/charts/CategoryChartView';

export const HealthDashboard: React.FC = () => {
  const [category, setCategory] = useState<HealthDataCategory>('obesity');
  const [dataView, setDataView] = useState('comparison');
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>(null);
  const [metadata, setMetadata] = useState<any>(null);
  const { isDemo, demoRole } = useAuth();
  
  // Load health data when category changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        const { data, metadata } = await demoDataService.getHealthData(category);
        setData(data);
        setMetadata(metadata);
      } catch (err) {
        console.error('Error loading health data:', err);
      } finally {
        // Add a short delay to simulate loading
        setTimeout(() => setLoading(false), 500);
      }
    };
    
    fetchData();
  }, [category]);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Health Data Dashboard</h2>
          <p className="text-gray-500">Interactive visualization for health metrics</p>
        </div>
        <div className="flex items-center gap-4">
          {isDemo && <DemoModeIndicator />}
          <Select 
            value={category} 
            onValueChange={(value) => setCategory(value as HealthDataCategory)}
          >
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{category.replace('-', ' ').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())} Analysis</CardTitle>
                <CardDescription>
                  {dataView === 'comparison' && 'Compare metrics across different regions'}
                  {dataView === 'trends' && 'Historical trends and projections'}
                  {dataView === 'correlations' && 'Correlated factors and determinants'}
                </CardDescription>
              </div>
              
              <Tabs value={dataView} onValueChange={setDataView}>
                <TabsList>
                  <TabsTrigger value="comparison" className="flex items-center gap-1">
                    <BarChart2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Comparison</span>
                  </TabsTrigger>
                  <TabsTrigger value="trends" className="flex items-center gap-1">
                    <LineChart className="h-4 w-4" />
                    <span className="hidden sm:inline">Trends</span>
                  </TabsTrigger>
                  <TabsTrigger value="correlations" className="flex items-center gap-1">
                    <PieChart className="h-4 w-4" />
                    <span className="hidden sm:inline">Correlations</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="h-[400px]">
            <CategoryChartView
              category={category as any}
              dataView={dataView}
              displayData={data}
              displayMetadata={metadata}
              isLoading={loading}
              showSourceInfo={false}
            />
          </CardContent>
          <CardFooter>
            <div className="flex justify-between items-center w-full">
              <div className="text-xs text-gray-500">
                Source: {metadata?.source || 'CDC'} • Updated {new Date(metadata?.updated || Date.now()).toLocaleDateString()}
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/demographics">
                  Demographic Breakdown
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
        
        <div className="flex flex-col gap-6">
          <ClaudeAIInsights 
            data={data || []} 
            dataSource={category}
            metric="health"
          />
          <HealthMap category={category} />
        </div>
      </div>
      
      {demoRole === 'administrator' && (
        <Card>
          <CardHeader>
            <CardTitle>Admin Controls</CardTitle>
            <CardDescription>Administrative tools only visible to admin users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline">
                Data Management
              </Button>
              <Button variant="outline">
                User Access Control
              </Button>
              <Button variant="outline">
                System Settings
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <div className="text-xs text-gray-500">
              These controls are only visible to users with administrative privileges
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default HealthDashboard;
