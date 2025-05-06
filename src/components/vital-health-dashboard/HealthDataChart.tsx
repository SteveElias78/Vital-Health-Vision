
import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { MockDataCategory } from '@/data/connectors/MockHybridHealthDataConnector';
import { HealthDataMetadata } from '@/hooks/useVitalHealthData';
import { SourceInfoPanel } from './SourceInfoPanel';

interface HealthDataChartProps {
  data: any[] | null;
  metadata: HealthDataMetadata | null;
  category: MockDataCategory;
  loading: boolean;
}

export const HealthDataChart: React.FC<HealthDataChartProps> = ({ data, metadata, category, loading }) => {
  const [showSourceInfo, setShowSourceInfo] = useState(false);

  // Get confidence level color
  const getConfidenceColor = (score: number) => {
    if (score >= 0.85) return '#4cd137'; // High confidence
    if (score >= 0.7) return '#fbc531';  // Medium confidence
    return '#e84118';                   // Low confidence
  };

  // Format source name for display
  const formatSourceName = (id: string) => {
    return id.replace(/_/g, ' ');
  };

  if (loading || !data) {
    return (
      <div className="lg:col-span-2 bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-2 bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 h-96">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h3 className="font-medium text-yellow-500">
          {category === 'lgbtq-health' ? 'LGBTQ+ Health Metrics' : 'Minority Health Metrics'}
        </h3>
        
        {/* Source Info Button */}
        <button 
          onClick={() => setShowSourceInfo(!showSourceInfo)}
          className="flex items-center text-xs bg-gray-700 hover:bg-gray-600 rounded-full px-3 py-1 text-gray-300"
        >
          <span className="mr-1">Data Source</span>
          <div 
            className="w-2 h-2 rounded-full" 
            style={{ backgroundColor: getConfidenceColor(metadata?.validation?.confidenceScore || metadata?.reliability || 0.7) }}
          ></div>
        </button>
      </div>
      
      {/* Source Information Panel */}
      {showSourceInfo && metadata && (
        <SourceInfoPanel metadata={metadata} formatSourceName={formatSourceName} getConfidenceColor={getConfidenceColor} />
      )}
      
      <div className="p-4 h-full">
        <ResponsiveContainer width="100%" height={showSourceInfo ? 240 : 320}>
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="year" 
              stroke="#9CA3AF" 
              label={{ value: 'Year', position: 'insideBottom', offset: -10, fill: '#9CA3AF' }}
            />
            <YAxis 
              stroke="#9CA3AF" 
              label={{ value: 'Percentage', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563', color: '#F9FAFB' }}
              itemStyle={{ color: '#F9FAFB' }}
              labelStyle={{ color: '#F9CA24' }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey={category === 'lgbtq-health' ? 'lgbtqHealthcareAccess' : 'minorityHealthcareAccess'}
              name="Healthcare Access"
              stroke="#F9CA24"
              strokeWidth={2}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey={category === 'lgbtq-health' ? 'lgbtqMentalHealth' : 'minorityMentalHealth'}
              name="Mental Health"
              stroke="#60A5FA"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
