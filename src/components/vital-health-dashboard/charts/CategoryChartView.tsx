
import React from 'react';
import { ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { MockDataCategory } from '@/data/connectors/MockHybridHealthDataConnector';
import { HealthDataChart } from '../HealthDataChart';

interface CategoryChartViewProps {
  category: MockDataCategory | string;
  dataView: string;
  displayData: any;
  displayMetadata: any;
  isLoading: boolean;
  showSourceInfo: boolean;
}

export const CategoryChartView: React.FC<CategoryChartViewProps> = ({
  category,
  dataView,
  displayData,
  displayMetadata,
  isLoading,
  showSourceInfo
}) => {
  // Get chart data for the comparison view
  const getComparisonChartData = () => {
    if (!displayData || !displayData.comparison) return [];
    return displayData.comparison;
  };

  // Get chart data for NHANES
  const getNHANESChartData = () => {
    if (!displayData || !displayData.nhanes) return [];
    
    const categoryString = category as string;
    if (categoryString === 'obesity') {
      // Group by age and gender
      const grouped = displayData.nhanes.reduce((acc: any, item: any) => {
        const key = item.age_group;
        if (!acc[key]) {
          acc[key] = {
            age_group: key,
            male_bmi: 0,
            female_bmi: 0,
            male_count: 0,
            female_count: 0
          };
        }
        
        if (item.gender === 'Male') {
          acc[key].male_bmi += item.measured_bmi;
          acc[key].male_count++;
        } else {
          acc[key].female_bmi += item.measured_bmi;
          acc[key].female_count++;
        }
        
        return acc;
      }, {});
      
      // Calculate averages
      return Object.values(grouped).map((group: any) => ({
        age_group: group.age_group,
        male_bmi: group.male_count > 0 ? group.male_bmi / group.male_count : 0,
        female_bmi: group.female_count > 0 ? group.female_bmi / group.female_count : 0
      }));
    }
    
    return displayData.nhanes;
  };

  // Get chart data for BRFSS state comparison
  const getStateChartData = () => {
    if (!displayData || !displayData.brfss) return [];
    
    return displayData.brfss.slice(0, 10); // Take first 10 states for simplicity
  };

  return (
    <ResponsiveContainer width="100%" height={showSourceInfo ? 240 : 320}>
      {/* Advanced Data Visualization */}
      {(category as string) === 'obesity' && dataView === 'comparison' && (
        <ComposedChart
          data={getComparisonChartData()}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="age_group" 
            stroke="#9CA3AF" 
            label={{ value: 'Age Group', position: 'insideBottom', offset: -10, fill: '#9CA3AF' }}
          />
          <YAxis 
            stroke="#9CA3AF" 
            label={{ value: 'BMI (kg/m²)', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563', color: '#F9FAFB' }}
            itemStyle={{ color: '#F9FAFB' }}
            labelStyle={{ color: '#F9CA24' }}
          />
          <Legend />
          <Bar
            dataKey="measured_bmi"
            name="Measured BMI (NHANES)"
            fill="#F9CA24"
            barSize={20}
          />
          <Bar
            dataKey="self_reported_bmi"
            name="Self-Reported BMI (BRFSS)"
            fill="#60A5FA"
            barSize={20}
          />
          <Line
            type="monotone"
            dataKey="difference"
            name="Difference"
            stroke="#EC4899"
            strokeWidth={2}
          />
        </ComposedChart>
      )}
      
      {(category as string) === 'obesity' && dataView === 'nhanes' && (
        <ComposedChart
          data={getNHANESChartData()}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="age_group" 
            stroke="#9CA3AF" 
            label={{ value: 'Age Group', position: 'insideBottom', offset: -10, fill: '#9CA3AF' }}
          />
          <YAxis 
            stroke="#9CA3AF" 
            label={{ value: 'BMI (kg/m²)', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563', color: '#F9FAFB' }}
            itemStyle={{ color: '#F9FAFB' }}
            labelStyle={{ color: '#F9CA24' }}
          />
          <Legend />
          <Bar
            dataKey="male_bmi"
            name="Male BMI (NHANES)"
            fill="#3B82F6"
            barSize={20}
          />
          <Bar
            dataKey="female_bmi"
            name="Female BMI (NHANES)"
            fill="#EC4899"
            barSize={20}
          />
        </ComposedChart>
      )}
      
      {(category as string) === 'obesity' && dataView === 'brfss' && (
        <ComposedChart
          data={getStateChartData()}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          layout="vertical"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            type="number"
            stroke="#9CA3AF" 
            label={{ value: 'Percentage (%)', position: 'insideBottom', offset: -10, fill: '#9CA3AF' }}
          />
          <YAxis 
            dataKey="state"
            type="category"
            stroke="#9CA3AF"
            width={100}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563', color: '#F9FAFB' }}
            itemStyle={{ color: '#F9FAFB' }}
            labelStyle={{ color: '#F9CA24' }}
          />
          <Legend />
          <Bar
            dataKey="obesity_pct"
            name="Obesity (%)"
            fill="#F9CA24"
            barSize={20}
          />
          <Bar
            dataKey="overweight_pct"
            name="Overweight (%)"
            fill="#60A5FA"
            barSize={20}
          />
        </ComposedChart>
      )}
      
      {/* Fallback to basic chart when no specialized view is available */}
      {!((category as string) === 'obesity' && (dataView === 'comparison' || dataView === 'nhanes' || dataView === 'brfss')) && (
        <HealthDataChart 
          data={displayData} 
          metadata={displayMetadata} 
          category={category} 
          loading={isLoading} 
        />
      )}
    </ResponsiveContainer>
  );
};
