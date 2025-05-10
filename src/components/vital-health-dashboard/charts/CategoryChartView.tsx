
import React from 'react';
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  Bar, 
  Line, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { MockDataCategory } from '@/components/vital-health-dashboard/VitalHealthDashboard';
import { Skeleton } from '@/components/ui/skeleton';

interface CategoryChartViewProps {
  category: MockDataCategory;
  dataView: string;
  displayData: any;
  displayMetadata: any;
  isLoading: boolean;
  displayError?: string | null;
  showSourceInfo?: boolean;
  getConfidenceColor?: (score: number) => string;
  formatSourceName?: (name: string) => string;
  setShowSourceInfo?: (show: boolean) => void;
}

export const CategoryChartView: React.FC<CategoryChartViewProps> = ({
  category,
  dataView,
  displayData,
  displayMetadata,
  isLoading,
  displayError,
  showSourceInfo,
  getConfidenceColor,
  formatSourceName,
  setShowSourceInfo
}) => {
  // Define chart colors based on category
  const getChartColors = () => {
    switch (category) {
      case 'obesity':
        return ['#ef4444', '#f87171', '#fca5a5', '#fee2e2'];
      case 'mental-health':
        return ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'];
      case 'lgbtq-health':
        return ['#ec4899', '#f472b6', '#f9a8d4', '#fbcfe8'];
      default:
        return ['#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'];
    }
  };
  
  // Function to format tooltip values and handle type conversion safely
  const formatTooltipValue = (value: ValueType): number => {
    if (typeof value === 'string') {
      return parseFloat(value);
    }
    return value as number;
  };
  
  // Generate sample data if real data is not available
  const getSampleData = () => {
    if (displayData && Array.isArray(displayData) && displayData.length > 0) {
      return displayData;
    }
    
    // Generate sample data for demo purposes
    const baseValue = category === 'obesity' ? 35 : 
                      category === 'mental-health' ? 20 : 75;
    
    return [
      { name: 'Group A', value: baseValue - 5 + Math.random() * 10 },
      { name: 'Group B', value: baseValue - 3 + Math.random() * 8 },
      { name: 'Group C', value: baseValue + Math.random() * 7 },
      { name: 'Group D', value: baseValue + 2 + Math.random() * 6 },
      { name: 'Group E', value: baseValue + 5 + Math.random() * 5 }
    ];
  };
  
  // Generate sample trend data
  const getSampleTrendData = () => {
    const baseValue = category === 'obesity' ? 32 : 
                      category === 'mental-health' ? 18 : 70;
    const years = 5;
    const data = [];
    
    for (let i = 0; i < years; i++) {
      const year = 2021 + i;
      let value = baseValue;
      
      // Different trends based on category
      if (category === 'obesity') {
        value += (0.7 * i) + (Math.random() * 2 - 1); // Increasing trend
      } else if (category === 'mental-health') {
        value += (1.2 * i) + (Math.random() * 2 - 1); // Steeper increasing trend
      } else {
        value += (i * 1.5) + (Math.random() * 3 - 1.5); // Improving trend for LGBTQ+ health scores
      }
      
      data.push({
        year,
        value: parseFloat(value.toFixed(1))
      });
    }
    
    return data;
  };
  
  // Generate sample correlation data
  const getSampleCorrelationData = () => {
    const factors = [
      { name: 'Factor A', correlation: 0.65 + (Math.random() * 0.2) },
      { name: 'Factor B', correlation: 0.58 + (Math.random() * 0.2) },
      { name: 'Factor C', correlation: 0.72 + (Math.random() * 0.2) },
      { name: 'Factor D', correlation: 0.48 + (Math.random() * 0.2) },
      { name: 'Factor E', correlation: 0.62 + (Math.random() * 0.2) }
    ];
    
    return factors;
  };
  
  // Determine what data to use
  const chartData = dataView === 'trends' ? getSampleTrendData() : 
                    dataView === 'correlations' ? getSampleCorrelationData() : 
                    getSampleData();
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <Skeleton className="h-full w-full" />
      </div>
    );
  }
  
  // Show error state
  if (displayError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <p className="text-red-500">Error: {displayError}</p>
        <p className="text-sm text-gray-500 mt-2">Please check your connection and try again.</p>
      </div>
    );
  }

  // Render different chart types based on the selected view
  if (dataView === 'comparison') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis 
            domain={
              category === 'obesity' || category === 'mental-health' 
                ? [0, 50] // Percentage range for conditions
                : [0, 100] // Score range for health access
            } 
          />
          <Tooltip 
            formatter={(value: ValueType) => {
              const numValue = formatTooltipValue(value);
              return [`${numValue}${category === 'lgbtq-health' ? '' : '%'}`, 'Value'];
            }}
          />
          <Legend />
          <Bar dataKey="value" name={
            category === 'obesity' ? 'Obesity Rate' : 
            category === 'mental-health' ? 'Prevalence' : 
            'Access Score'
          }>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getChartColors()[index % getChartColors().length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  } else if (dataView === 'trends') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis 
            domain={
              category === 'obesity' || category === 'mental-health' 
                ? [0, 50]
                : [0, 100]
            } 
          />
          <Tooltip 
            formatter={(value: ValueType) => {
              const numValue = formatTooltipValue(value);
              return [`${numValue}${category === 'lgbtq-health' ? '' : '%'}`, 'Value'];
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={getChartColors()[0]}
            strokeWidth={2}
            name={
              category === 'obesity' ? 'Obesity Rate' : 
              category === 'mental-health' ? 'Mental Health Prevalence' : 
              'Healthcare Access Score'
            }
            dot={{ r: 5, fill: getChartColors()[0] }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  } else if (dataView === 'correlations') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          layout="vertical"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 1]} />
          <YAxis dataKey="name" type="category" />
          <Tooltip 
            formatter={(value: ValueType) => {
              const numValue = formatTooltipValue(value);
              return [`${(numValue * 100).toFixed(1)}%`, 'Correlation'];
            }}
          />
          <Legend />
          <Bar 
            dataKey="correlation" 
            name="Correlation Strength"
            fill={getChartColors()[0]}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  } else {
    // Default to pie chart for any other view
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={true}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getChartColors()[index % getChartColors().length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: ValueType) => {
              const numValue = formatTooltipValue(value);
              return [`${numValue < 100 ? numValue : numValue.toFixed(1)}${category === 'lgbtq-health' ? '' : '%'}`, 'Value'];
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  }
};
