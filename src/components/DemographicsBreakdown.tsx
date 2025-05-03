
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend 
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Sample data
const demographicsData = [
  { age: '18-24', male: 400, female: 800 },
  { age: '25-34', male: 700, female: 1000 },
  { age: '35-44', male: 1000, female: 750 },
  { age: '45-54', male: 930, female: 880 },
  { age: '55-64', male: 800, female: 820 },
  { age: '65+', male: 500, female: 600 },
];

export function DemographicsBreakdown() {
  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Demographics Breakdown</CardTitle>
          <CardDescription>Health conditions by age and gender</CardDescription>
        </div>
        <Select defaultValue="diabetes">
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
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={demographicsData}
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
              <Tooltip />
              <Legend />
              <Bar dataKey="male" name="Male" fill="#0EA5E9" />
              <Bar dataKey="female" name="Female" fill="#D946EF" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
