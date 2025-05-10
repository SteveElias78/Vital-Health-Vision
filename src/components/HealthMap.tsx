
import React from 'react';
import { useVitalHealthData } from '@/hooks/useVitalHealthData';
import { ComposedChart, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface HealthMapProps {
  category?: string;
}

export const HealthMap: React.FC<HealthMapProps> = ({ category = 'obesity' }) => {
  const { loading, error, data } = useVitalHealthData();
  
  // This is a placeholder visualization until we can properly integrate with react-simple-maps
  // In a real implementation, this would be a geographical map of the US with health data overlaid
  
  // Generate sample data for the visualization
  const generateData = () => {
    const regions = ['Northeast', 'Midwest', 'South', 'West'];
    return regions.map(region => {
      let value = 0;
      switch (region) {
        case 'Northeast':
          value = category === 'obesity' ? 27.4 : category === 'mental-health' ? 19.2 : 24.8;
          break;
        case 'Midwest':
          value = category === 'obesity' ? 32.8 : category === 'mental-health' ? 17.9 : 28.3;
          break;
        case 'South':
          value = category === 'obesity' ? 35.9 : category === 'mental-health' ? 20.4 : 31.2;
          break;
        case 'West':
          value = category === 'obesity' ? 25.3 : category === 'mental-health' ? 21.5 : 22.1;
          break;
      }
      
      return {
        region,
        value,
        avg: 30.4, // National average
        diff: value - 30.4
      };
    });
  };
  
  const chartData = generateData();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-80">
        <p className="text-muted-foreground">Loading map data...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-80">
        <p className="text-red-500">Error loading map: {error}</p>
      </div>
    );
  }
  
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="region" scale="band" />
          <YAxis />
          <Tooltip
            formatter={(value) => `${value}%`}
            labelFormatter={(label) => `Region: ${label}`}
          />
          <Legend />
          <Bar dataKey="value" name="Rate %" fill="#8884d8" barSize={40} />
          <Area type="monotone" dataKey="avg" name="National Average" stroke="#ff7300" fill="#ff7300" fillOpacity={0.2} />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="text-center text-xs text-muted-foreground mt-2">
        Note: Geographic map visualization is a placeholder in this demo.
      </div>
    </div>
  );
};

export default HealthMap;
