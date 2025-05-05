
import React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DataVisualizationProps {
  data: any;
  category: string;
}

export const DataVisualization: React.FC<DataVisualizationProps> = ({ data, category }) => {
  // Get chart data based on category
  const getChartData = () => {
    if (!data) return [];
    
    // Different data processing based on category
    if (category === 'obesity') {
      // If we have NHANES data (measured BMI)
      if (data.nhanes) {
        return data.nhanes.slice(0, 10); // Take first 10 items
      }
      
      // If we have BRFSS data (self-reported)
      if (data.brfss) {
        return data.brfss.slice(0, 10);
      }
    }
    
    // For mental health data
    if (category === 'mental-health') {
      if (data.nhanes) {
        return data.nhanes.slice(0, 10);
      }
      
      if (data.brfss) {
        return data.brfss.slice(0, 10);
      }
    }
    
    // For LGBTQ health data
    if (category === 'lgbtq-health') {
      if (data.fenway) {
        return data.fenway.slice(0, 10);
      }
      
      if (data.nhanes) {
        return data.nhanes.slice(0, 10);
      }
      
      if (data.brfss) {
        return data.brfss.slice(0, 10);
      }
    }
    
    // Default case - just return an empty array
    return [];
  };

  const chartData = getChartData();

  if (chartData.length === 0) {
    return (
      <Alert>
        <AlertDescription>
          No visualization data available for this category.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="h-[400px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="locationdesc" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
