
import React from 'react';
import { RadialHealthVisualizer } from '@/components/visualizations';
import { ClaudeAIInsights } from '@/components/ai-insights';
import { DataSourceReliability } from './DataSourceReliability';
import type { VisualizationData } from '@/components/visualizations';

/**
 * Dashboard Home Page component - main landing page with multiple visualizations
 */
export const DashboardHome: React.FC = () => {
  // Sample data for visualizations
  const sampleData: Array<{category: string; value: number}> = [
    { category: '18-34', value: 31.5 },
    { category: '35-49', value: 35.8 },
    { category: '50-64', value: 38.2 },
    { category: '65+', value: 34.1 }
  ];
  
  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="border-b border-gold-500/30 pb-4">
        <h1 className="text-3xl font-light text-gold-400">
          Health Data <span className="font-medium">Analytics</span>
        </h1>
        <p className="mt-2 text-gold-300/70">
          Exploring public health trends and demographic analysis
        </p>
      </div>
      
      {/* Dashboard grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Health metrics visualization */}
        <div className="col-span-1 lg:col-span-2">
          <RadialHealthVisualizer />
        </div>
        
        {/* Claude AI Insights */}
        <div>
          <ClaudeAIInsights 
            data={sampleData}
            dataSource="NHANES 2023"
            metric="obesity" 
          />
        </div>
        
        {/* Data source reliability */}
        <div>
          <DataSourceReliability />
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
