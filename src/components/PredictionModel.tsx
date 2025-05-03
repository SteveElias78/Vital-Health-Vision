
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Sample forecast data
const forecastData = [
  { year: '2020', actual: 120, predicted: 118 },
  { year: '2021', actual: 132, predicted: 129 },
  { year: '2022', actual: 141, predicted: 138 },
  { year: '2023', actual: 152, predicted: 149 },
  { year: '2024', actual: 165, predicted: 160 },
  { year: '2025', actual: null, predicted: 172 },
  { year: '2026', actual: null, predicted: 185 },
  { year: '2027', actual: null, predicted: 196 },
];

export function PredictionModel() {
  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Predictive Analysis</CardTitle>
          <CardDescription>Forecasted health trends</CardDescription>
        </div>
        <Select defaultValue="diabetes">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="diabetes">Diabetes</SelectItem>
            <SelectItem value="heart-disease">Heart Disease</SelectItem>
            <SelectItem value="obesity">Obesity</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={forecastData}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="actual" 
                name="Historical" 
                stackId="1" 
                stroke="#8B5CF6" 
                fill="#8B5CF6" 
                fillOpacity={0.2} 
              />
              <Area 
                type="monotone" 
                dataKey="predicted" 
                name="Predicted" 
                stackId="2" 
                stroke="#0EA5E9" 
                strokeDasharray="5 5" 
                fill="#0EA5E9" 
                fillOpacity={0.2} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 text-xs text-gray-500 text-center">
          <p>Machine learning model based on historical trends and demographic factors</p>
          <p className="mt-1">Confidence interval: 95%</p>
        </div>
      </CardContent>
    </Card>
  );
}
