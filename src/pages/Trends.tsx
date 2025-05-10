
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { demoDataService, HealthDataCategory } from '@/data/demo/DemoDataService';
import { useAuth } from '@/hooks/useAuth';
import { DemoModeIndicator } from '@/components/demo/DemoModeIndicator';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Trends: React.FC = () => {
  const [category, setCategory] = useState<HealthDataCategory>('obesity');
  const [timeRange, setTimeRange] = useState<string>('3y');
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any[]>([]);
  const [trends, setTrends] = useState<any[]>([]);
  const { isDemo, demoRole } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // Get health data from demo service
        const healthData = await demoDataService.getHealthData(
          category, 
          { timeRange: timeRange as any }
        );
        
        // Process data for the trends chart
        const trendData = generateTrendData(category, timeRange);
        
        setData(healthData.data.nhanes || healthData.data.brfss || []);
        setTrends(trendData);
      } catch (err) {
        console.error('Error fetching trend data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [category, timeRange]);

  // Generate trend data with actual points and forecasted data
  const generateTrendData = (category: HealthDataCategory, timeRange: string) => {
    const startYear = 2022;
    const currentYear = 2025;
    const forecastYears = 3;
    
    // Base trend values for each category
    const baseTrendValues = {
      'obesity': { start: 32.5, annual: 0.6, forecast: 0.7 },
      'mental-health': { start: 18.2, annual: 1.2, forecast: 1.0 },
      'lgbtq-health': { start: 24.1, annual: -0.3, forecast: -0.2 },
      'chronic-disease': { start: 27.8, annual: 0.3, forecast: 0.4 }
    };
    
    const trend = baseTrendValues[category];
    const data = [];
    
    // Generate historical data
    for (let i = 0; i <= (currentYear - startYear); i++) {
      data.push({
        year: startYear + i,
        value: +(trend.start + (trend.annual * i)).toFixed(1),
        type: 'historical'
      });
    }
    
    // Generate forecast data
    const lastValue = data[data.length - 1].value;
    for (let i = 1; i <= forecastYears; i++) {
      data.push({
        year: currentYear + i,
        value: +(lastValue + (trend.forecast * i)).toFixed(1),
        type: 'forecast'
      });
    }
    
    return data;
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Health Trends Analysis</h1>
          <p className="text-gray-500">Time-series analysis and projections</p>
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
          
          <Select value={timeRange} onValueChange={setTimeRange}>
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Health Metric Trend Over Time</CardTitle>
            <CardDescription>Historical data with future projections</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <p>Loading trend data...</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={trends}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`${value}%`, 'Prevalence']}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    name="Historical Data"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 8 }}
                    hide={trends.findIndex(d => d.type === 'historical') === -1}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    name="Forecast"
                    stroke="#82ca9d"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    hide={trends.findIndex(d => d.type === 'forecast') === -1}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <span className="text-xs text-muted-foreground">
              Source: Demo Data Service • Based on CDC patterns
            </span>
            <Button variant="outline" size="sm">Export Data</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Trend Analysis</CardTitle>
            <CardDescription>Key insights from time-series data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <h3 className="font-medium">Overall Direction</h3>
                <p className="text-sm text-gray-500">
                  {category === 'obesity' && "Increasing trend by 0.6% annually"}
                  {category === 'mental-health' && "Significant increase of 1.2% annually"}
                  {category === 'lgbtq-health' && "Slight improvement with 0.3% annual decrease"}
                  {category === 'chronic-disease' && "Gradual increase of 0.3% per year"}
                </p>
              </div>
              <div className="border-l-4 border-amber-500 pl-4 py-2">
                <h3 className="font-medium">Regional Variations</h3>
                <p className="text-sm text-gray-500">
                  {category === 'obesity' && "Southern states show 1.2x higher growth rate"}
                  {category === 'mental-health' && "Urban areas experiencing fastest increase"}
                  {category === 'lgbtq-health' && "Greatest improvement in metropolitan areas"}
                  {category === 'chronic-disease' && "Southeastern states showing 1.5x average growth"}
                </p>
              </div>
              <div className="border-l-4 border-green-500 pl-4 py-2">
                <h3 className="font-medium">Projection Confidence</h3>
                <p className="text-sm text-gray-500">
                  {category === 'obesity' && "High confidence (92%) in projected trajectory"}
                  {category === 'mental-health' && "Medium confidence (84%) due to intervention variables"}
                  {category === 'lgbtq-health' && "Medium confidence (86%) with policy dependency"}
                  {category === 'chronic-disease' && "High confidence (91%) based on consistent patterns"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Demographic Breakdown of Trends</CardTitle>
          <CardDescription>Health metric changes across population groups</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border rounded p-4">
              <h3 className="font-medium text-lg mb-2">By Age Group</h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>18-34</span>
                  <span className={category === 'lgbtq-health' ? "text-green-500" : "text-red-500"}>
                    {category === 'lgbtq-health' ? "-0.5%" : "+0.2%"}/year
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>35-49</span>
                  <span className={category === 'lgbtq-health' ? "text-green-500" : "text-red-500"}>
                    {category === 'lgbtq-health' ? "-0.3%" : "+0.4%"}/year
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>50-64</span>
                  <span className={category === 'lgbtq-health' ? "text-green-500" : "text-red-500"}>
                    {category === 'lgbtq-health' ? "-0.2%" : "+0.7%"}/year
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>65+</span>
                  <span className={category === 'lgbtq-health' ? "text-amber-500" : "text-red-500"}>
                    {category === 'lgbtq-health' ? "+0.1%" : "+0.5%"}/year
                  </span>
                </li>
              </ul>
            </div>
            
            <div className="border rounded p-4">
              <h3 className="font-medium text-lg mb-2">By Income Level</h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>Low Income</span>
                  <span className="text-red-500">
                    +{category === 'obesity' ? "0.9" : category === 'mental-health' ? "1.4" : "0.6"}%/year
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Middle Income</span>
                  <span className={category === 'lgbtq-health' ? "text-green-500" : "text-red-500"}>
                    {category === 'lgbtq-health' ? "-0.4%" : "+0.5%"}/year
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>High Income</span>
                  <span className={category === 'obesity' || category === 'mental-health' ? "text-amber-500" : "text-green-500"}>
                    {category === 'obesity' || category === 'mental-health' ? "+0.1%" : "-0.2%"}/year
                  </span>
                </li>
              </ul>
            </div>
            
            <div className="border rounded p-4">
              <h3 className="font-medium text-lg mb-2">By Geographic Region</h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>Northeast</span>
                  <span className={category === 'lgbtq-health' ? "text-green-500" : "text-amber-500"}>
                    {category === 'lgbtq-health' ? "-0.6%" : "+0.3%"}/year
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Midwest</span>
                  <span className="text-amber-500">
                    {category === 'lgbtq-health' ? "-0.1%" : "+0.4%"}/year
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>South</span>
                  <span className="text-red-500">
                    +{category === 'obesity' ? "0.8" : category === 'mental-health' ? "0.9" : "0.7"}%/year
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>West</span>
                  <span className={category === 'lgbtq-health' ? "text-green-500" : "text-amber-500"}>
                    {category === 'lgbtq-health' ? "-0.5%" : "+0.2%"}/year
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Trends;
