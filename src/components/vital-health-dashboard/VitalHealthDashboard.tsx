
import React from 'react';
import { useVitalHealthData } from '@/hooks/useVitalHealthData';
import { DashboardHeader } from './DashboardHeader';
import { DashboardFooter } from './DashboardFooter';
import { CategorySelector } from './CategorySelector';
import { HealthDataChart } from './HealthDataChart';
import { SourcesPanel } from './SourcesPanel';

export const VitalHealthDashboard: React.FC = () => {
  const {
    loading,
    error,
    category,
    setCategory,
    data,
    metadata,
    sources
  } = useVitalHealthData();

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <DashboardHeader />

      <main className="p-6">
        {/* Dashboard Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Health Metrics Dashboard</h2>
          <p className="text-gray-400">Analyzing health metrics using a hybrid of reliable data sources</p>
        </div>

        {/* Category Selector */}
        <CategorySelector category={category} onCategoryChange={setCategory} />

        {/* Error State */}
        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Data Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <HealthDataChart 
            data={data} 
            metadata={metadata} 
            category={category} 
            loading={loading} 
          />
          
          {/* Data Source Information */}
          {!loading && sources && (
            <SourcesPanel sources={sources} currentSourceId={metadata?.source} />
          )}
        </div>
      </main>
      
      <DashboardFooter />
    </div>
  );
};
