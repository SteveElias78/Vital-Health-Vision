
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export const DataTrends: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>('3y');
  
  // Generate trend data with actual and projected values
  const generateTrendData = (timeRange: string) => {
    const years = timeRange === '1y' ? 1 : timeRange === '3y' ? 3 : timeRange === '5y' ? 5 : 10;
    const data = [];
    
    // Starting point
    const baseValue = 34.5; // For obesity
    const annualChange = 0.6;
    
    // Generate historical data
    for (let i = 0; i < years; i++) {
      const year = 2025 - years + i;
      const value = baseValue + (annualChange * i);
      
      data.push({
        year,
        value: +value.toFixed(1),
        type: 'historical'
      });
    }
    
    // Add current year if not already included
    if (!data.find(d => d.year === 2025)) {
      data.push({
        year: 2025,
        value: +(baseValue + (annualChange * years)).toFixed(1),
        type: 'historical'
      });
    }
    
    // Generate projected data (next 3 years)
    const lastValue = data[data.length - 1].value;
    for (let i = 1; i <= 3; i++) {
      data.push({
        year: 2025 + i,
        value: +(lastValue + (annualChange * i)).toFixed(1),
        type: 'projected'
      });
    }
    
    return data;
  };
  
  const trendData = generateTrendData(timeRange);

  return (
    <Card className="col-span-1 md:col-span-3">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Historical Health Trends</CardTitle>
            <CardDescription>Long-term patterns with projections</CardDescription>
          </div>
          
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
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={trendData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis domain={[20, 50]} />
            <Tooltip 
              formatter={(value: number) => [`${value}%`, 'Prevalence']}
              labelFormatter={(label) => `Year: ${label}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              name="Historical Data"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              connectNulls
              isAnimationActive={true}
            />
            <Line
              type="monotone"
              dataKey="value"
              name="Projected"
              stroke="#82ca9d"
              strokeDasharray="5 5"
              strokeWidth={2}
              dot={{ r: 4 }}
              connectNulls
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Source: Demo data based on CDC trends • Projection confidence: 87%
        </div>
      </CardFooter>
    </Card>
  );
};
