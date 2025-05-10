import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ZAxis, Cell } from 'recharts';
import { MockDataCategory } from '../VitalHealthDashboard';

// Add this import for ValueType from recharts
import { ValueType } from 'recharts/types/component/DefaultTooltipContent';

interface CategoryChartViewProps {
  category: MockDataCategory;
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
  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  if (!displayData) {
    return <div className="flex items-center justify-center h-full">No data available</div>;
  }

  // Determine which chart to render based on category and view
  switch (category) {
    case 'obesity':
      return renderObesityCharts(dataView, displayData);
    case 'mental-health':
      return renderMentalHealthCharts(dataView, displayData);
    case 'lgbtq-health':
      return renderLGBTQHealthCharts(dataView, displayData);
    default:
      return <div>Select a category to view charts</div>;
  }
};

// Chart rendering functions based on category and view
const renderObesityCharts = (dataView: string, data: any) => {
  switch (dataView) {
    case 'comparison':
      return renderObesityComparisonChart(data);
    case 'predictions':
      return renderObesityPredictionChart(data);
    case 'correlations':
      return renderObesityCorrelationChart(data);
    default:
      return renderObesityComparisonChart(data);
  }
};

const renderMentalHealthCharts = (dataView: string, data: any) => {
  switch (dataView) {
    case 'comparison':
      return renderMentalHealthComparisonChart(data);
    case 'predictions':
      return renderMentalHealthPredictionChart(data);
    case 'correlations':
      return renderMentalHealthCorrelationChart(data);
    default:
      return renderMentalHealthComparisonChart(data);
  }
};

const renderLGBTQHealthCharts = (dataView: string, data: any) => {
  switch (dataView) {
    case 'comparison':
      return renderLGBTQComparisonChart(data);
    case 'predictions':
      return renderLGBTQPredictionChart(data);
    case 'correlations':
      return renderLGBTQCorrelationChart(data);
    default:
      return renderLGBTQComparisonChart(data);
  }
};

// Obesity chart implementations
const renderObesityComparisonChart = (data: any) => {
  // Prepare comparison data between NHANES and BRFSS
  const nhanes = data.nhanes?.slice(0, 10) || [];
  const brfss = data.brfss?.slice(0, 10) || [];
  
  // If we have both sources, create comparison data
  if (nhanes.length > 0 && brfss.length > 0) {
    const comparisonData = nhanes.map((item: any, index: number) => {
      const brfssMatch = brfss.find((b: any) => b.locationdesc === item.locationdesc);
      return {
        locationdesc: item.locationdesc,
        nhanes: item.value,
        brfss: brfssMatch ? brfssMatch.value : null
      };
    });
    
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={comparisonData}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 100, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 'dataMax + 5']} />
          <YAxis dataKey="locationdesc" type="category" scale="band" />
          <Tooltip formatter={(value) => `${value}%`} />
          <Legend />
          <Bar dataKey="nhanes" name="NHANES (Measured)" fill="#2563eb" barSize={15} />
          <Bar dataKey="brfss" name="BRFSS (Self-reported)" fill="#f59e0b" barSize={15} />
        </BarChart>
      </ResponsiveContainer>
    );
  }
  
  // Fallback if one data source is missing
  const displayData = nhanes.length > 0 ? nhanes : brfss;
  const sourceName = nhanes.length > 0 ? "NHANES" : "BRFSS";
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={displayData}
        layout="vertical"
        margin={{ top: 10, right: 30, left: 100, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" domain={[0, 'dataMax + 5']} />
        <YAxis dataKey="locationdesc" type="category" scale="band" />
        <Tooltip formatter={(value) => `${value}%`} />
        <Legend />
        <Bar dataKey="value" name={`${sourceName} Obesity Rate (%)`} fill="#2563eb" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const renderObesityPredictionChart = (data: any) => {
  // Create mock prediction data based on available data
  const baseData = (data.nhanes || data.brfss)?.slice(0, 5) || [];
  
  if (baseData.length === 0) {
    return <div>No data available for predictions</div>;
  }
  
  const predictionData = baseData.map((item: any) => {
    // Fix TypeScript error by ensuring we're working with numbers before calculations
    const itemValue = typeof item.value === 'string' ? parseFloat(item.value) : item.value;
    const numericValue = isNaN(itemValue) ? 0 : itemValue;
    const predictionValue = numericValue * (1 + (Math.random() * 0.2 - 0.05)); // -5% to +15%
    
    return {
      locationdesc: item.locationdesc,
      current: numericValue,
      predicted: parseFloat(predictionValue.toFixed(1))
    };
  });
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={predictionData}
        margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
        layout="vertical"
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="locationdesc" type="category" scale="band" />
        <Tooltip formatter={(value) => `${value}%`} />
        <Legend />
        <Bar dataKey="current" name="Current Obesity Rate" fill="#2563eb" barSize={15} />
        <Bar dataKey="predicted" name="5-Year Projection" fill="#f59e0b" barSize={15} />
      </BarChart>
    </ResponsiveContainer>
  );
};

const renderObesityCorrelationChart = (data: any) => {
  // Create mock correlation data
  const correlationData = [
    { factor: "Income Level", correlation: -0.68, strength: 68 },
    { factor: "Education", correlation: -0.72, strength: 72 },
    { factor: "Physical Activity", correlation: -0.76, strength: 76 },
    { factor: "Fast Food Accessibility", correlation: 0.65, strength: 65 },
    { factor: "Healthcare Access", correlation: -0.58, strength: 58 }
  ];
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={correlationData}
        layout="vertical"
        margin={{ top: 10, right: 30, left: 120, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          type="number" 
          domain={[-1, 1]} 
          tickFormatter={(value) => `${Math.abs(value)}`} 
          label={{ value: 'Correlation Strength', position: 'insideBottom', offset: -10 }} 
        />
        <YAxis dataKey="factor" type="category" scale="band" />
        <Tooltip 
          formatter={(value) => `${Math.abs(value)} (${value < 0 ? 'Negative' : 'Positive'})`}
          labelFormatter={(label) => `Factor: ${label}`}
        />
        <Legend />
        <Bar dataKey="correlation" name="Correlation with Obesity Rate">
          {correlationData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.correlation < 0 ? '#22c55e' : '#ef4444'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

// Mental Health chart implementations
const renderMentalHealthComparisonChart = (data: any) => {
  const nhanes = data.nhanes || [];
  const displayData = nhanes.filter((item: any) => 
    item.stratification1 === 'Depression' || item.stratification1 === 'Anxiety'
  );
  
  if (displayData.length === 0) {
    return <div>No comparison data available</div>;
  }
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={displayData}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="locationdesc" />
        <YAxis label={{ value: 'Prevalence (%)', angle: -90, position: 'insideLeft' }} />
        <Tooltip formatter={(value) => `${value}%`} />
        <Legend />
        <Bar dataKey="value" name="Mental Health Condition Rate" fill="#8884d8">
          {displayData.map((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={entry.stratification1 === 'Depression' ? '#9333ea' : '#3b82f6'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

const renderMentalHealthPredictionChart = (data: any) => {
  // Create time-series prediction chart for mental health
  const mockTimeSeriesData = [
    { month: 'Jan', depression: 18.2, anxiety: 21.3 },
    { month: 'Feb', depression: 18.7, anxiety: 22.1 },
    { month: 'Mar', depression: 19.1, anxiety: 21.8 },
    { month: 'Apr', depression: 18.5, anxiety: 20.9 },
    { month: 'May', depression: 17.8, anxiety: 20.1 },
    { month: 'Jun', depression: 17.2, anxiety: 19.5 },
    // Prediction starts
    { month: 'Jul', depression: 17.5, anxiety: 19.8, isPrediction: true },
    { month: 'Aug', depression: 18.1, anxiety: 20.4, isPrediction: true },
    { month: 'Sep', depression: 18.9, anxiety: 21.2, isPrediction: true },
    { month: 'Oct', depression: 19.5, anxiety: 22.1, isPrediction: true },
    { month: 'Nov', depression: 20.1, anxiety: 22.8, isPrediction: true },
    { month: 'Dec', depression: 20.6, anxiety: 23.5, isPrediction: true }
  ];
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={mockTimeSeriesData}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis label={{ value: 'Prevalence (%)', angle: -90, position: 'insideLeft' }} />
        <Tooltip formatter={(value) => `${value}%`} />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="depression" 
          name="Depression" 
          stroke="#9333ea"
          strokeWidth={2}
          dot={{ fill: '#9333ea', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6 }}
          strokeDasharray="0"
          connectNulls
        />
        <Line 
          type="monotone" 
          dataKey="anxiety" 
          name="Anxiety" 
          stroke="#3b82f6" 
          strokeWidth={2}
          dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6 }}
          strokeDasharray="0"
          connectNulls
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

const renderMentalHealthCorrelationChart = (data: any) => {
  // Example correlation data for mental health
  const correlationData = [
    { x: 15, y: 75, z: 20, name: 'Rural Areas', group: 'Location' },
    { x: 23, y: 65, z: 15, name: 'Suburban', group: 'Location' },
    { x: 28, y: 60, z: 18, name: 'Urban Centers', group: 'Location' },
    { x: 32, y: 45, z: 12, name: 'Low Income', group: 'Income' },
    { x: 25, y: 55, z: 14, name: 'Middle Income', group: 'Income' },
    { x: 18, y: 70, z: 10, name: 'High Income', group: 'Income' }
  ];
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          type="number" 
          dataKey="x" 
          name="Access Score" 
          label={{ value: 'Mental Health Service Access', position: 'insideBottom', offset: -10 }} 
        />
        <YAxis 
          type="number" 
          dataKey="y" 
          name="Stress Score" 
          label={{ value: 'Stress Level', angle: -90, position: 'insideLeft' }} 
        />
        <ZAxis 
          type="number" 
          dataKey="z" 
          range={[50, 200]} 
          name="Population" 
        />
        <Tooltip 
          cursor={{ stroke: '#808080', strokeDasharray: '4 4' }}
          formatter={(value, name, props) => [value, name === 'z' ? 'Population Size' : name]}
          labelFormatter={(label) => correlationData[label].name}
        />
        <Legend />
        <Scatter 
          name="Mental Health Factors" 
          data={correlationData} 
          fill="#8884d8"
          shape="circle"
        >
          {correlationData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.group === 'Location' ? '#9333ea' : '#3b82f6'} />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
};

// LGBTQ+ Health chart implementations
const renderLGBTQComparisonChart = (data: any) => {
  const fenway = data.fenway || [];
  
  if (fenway.length === 0) {
    return <div>No comparison data available</div>;
  }
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={fenway}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="category" 
          angle={-45} 
          textAnchor="end"
          height={80}
        />
        <YAxis label={{ value: 'Score (%)', angle: -90, position: 'insideLeft' }} />
        <Tooltip formatter={(value) => `${value}%`} />
        <Legend />
        <Bar dataKey="value" name="LGBTQ+ Health Metric" fill="#9333ea" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const renderLGBTQPredictionChart = (data: any) => {
  // Regional comparison with predictions
  const nhanes = data.nhanes || [];
  
  if (nhanes.length === 0) {
    return <div>No regional data available</div>;
  }
  
  // Create prediction data based on available data
  const predictionData = nhanes.map((item: any) => {
    // Fix TypeScript error by ensuring we're working with numbers
    const currentValue = typeof item.value === 'string' ? parseFloat(item.value) : item.value;
    const numericValue = isNaN(currentValue) ? 0 : currentValue;
    const predictedValue = numericValue * (1 + (Math.random() * 0.15)); // 0-15% increase
    
    return {
      region: item.locationdesc,
      current: numericValue,
      target: parseFloat(predictedValue.toFixed(1))
    };
  });
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={predictionData}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="region" />
        <YAxis label={{ value: 'Access Score (%)', angle: -90, position: 'insideLeft' }} />
        <Tooltip formatter={(value) => formatTooltipValue(value)} />
        <Legend />
        <Bar dataKey="current" name="Current Access" fill="#3b82f6" />
        <Bar dataKey="target" name="Target (2027)" fill="#22c55e" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const renderLGBTQCorrelationChart = (data: any) => {
  // Example correlation data for LGBTQ+ health
  const correlationData = [
    { factor: "Provider Training", value: 0.72 },
    { factor: "Community Support", value: 0.63 },
    { factor: "Non-discrimination Policies", value: 0.59 },
    { factor: "Insurance Coverage", value: 0.56 },
    { factor: "Mental Health Services", value: 0.71 }
  ];
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={correlationData}
        layout="vertical"
        margin={{ top: 20, right: 30, left: 150, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          type="number" 
          domain={[0, 1]} 
          tickFormatter={(value) => {
            // Ensure value is a number before performing operations
            const numValue = typeof value === 'number' ? value : 0;
            return `${(numValue * 100).toFixed(0)}%`;
          }} 
        />
        <YAxis dataKey="factor" type="category" scale="band" />
        <Tooltip formatter={(value: any) => {
          // Fix for the type error by properly handling different value types
          const numValue = typeof value === 'number' ? value : parseFloat(value);
          return !isNaN(numValue) ? `${(numValue * 100).toFixed(1)}%` : '0%';
        }} />
        <Legend />
        <Bar 
          dataKey="value" 
          name="Correlation with Positive Health Outcomes" 
          fill="#22c55e" 
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

// Helper formatter that handles different value types
const formatTooltipValue = (value: any): string => {
  if (typeof value === 'number') {
    return `${value.toFixed(1)}%`;
  } else if (typeof value === 'string') {
    // If the value is a string, try to parse it as a number
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      return `${numValue.toFixed(1)}%`;
    }
    return value;
  }
  return '0%';
};
