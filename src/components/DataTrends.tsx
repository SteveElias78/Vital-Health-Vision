
import { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend 
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// Sample data
const trendData = [
  { month: 'Jan', 'Heart Disease': 4000, 'Diabetes': 2400, 'Obesity': 2400 },
  { month: 'Feb', 'Heart Disease': 3000, 'Diabetes': 1398, 'Obesity': 2210 },
  { month: 'Mar', 'Heart Disease': 2000, 'Diabetes': 9800, 'Obesity': 2290 },
  { month: 'Apr', 'Heart Disease': 2780, 'Diabetes': 3908, 'Obesity': 2000 },
  { month: 'May', 'Heart Disease': 1890, 'Diabetes': 4800, 'Obesity': 2181 },
  { month: 'Jun', 'Heart Disease': 2390, 'Diabetes': 3800, 'Obesity': 2500 },
  { month: 'Jul', 'Heart Disease': 3490, 'Diabetes': 4300, 'Obesity': 2100 },
];

export function DataTrends() {
  const [timeRange, setTimeRange] = useState("7d");

  return (
    <Card className="col-span-1 md:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Health Condition Trends</CardTitle>
          <CardDescription>Historical trends over time</CardDescription>
        </div>
        <ToggleGroup type="single" value={timeRange} onValueChange={(value) => value && setTimeRange(value)}>
          <ToggleGroupItem value="7d" aria-label="Toggle 7 days">
            7d
          </ToggleGroupItem>
          <ToggleGroupItem value="1m" aria-label="Toggle 1 month">
            1m
          </ToggleGroupItem>
          <ToggleGroupItem value="1y" aria-label="Toggle 1 year">
            1y
          </ToggleGroupItem>
        </ToggleGroup>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={trendData}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="Heart Disease" 
                stroke="#8B5CF6" 
                strokeWidth={2} 
                dot={{ r: 3 }} 
                activeDot={{ r: 8 }} 
              />
              <Line 
                type="monotone" 
                dataKey="Diabetes" 
                stroke="#0EA5E9" 
                strokeWidth={2} 
                dot={{ r: 3 }} 
                activeDot={{ r: 8 }} 
              />
              <Line 
                type="monotone" 
                dataKey="Obesity" 
                stroke="#F97316" 
                strokeWidth={2} 
                dot={{ r: 3 }} 
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
