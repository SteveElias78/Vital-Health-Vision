
import React, { useState, useEffect } from 'react';
import { useVitalHealthData } from '@/hooks/useVitalHealthData';
import { DashboardHeader } from './DashboardHeader';
import { DashboardFooter } from './DashboardFooter';
import { CategorySelector } from './CategorySelector';
import { EnhancedHealthDataConnector } from '@/data/connectors/EnhancedHealthDataConnector';
import { ViewSelector } from './controls/ViewSelector';
import { EnhancedDataBadge } from './badges/EnhancedDataBadge';
import { DataVisualizationContainer } from './charts/DataVisualizationContainer';
import { SourceInfoDisplay } from './panels/SourceInfoDisplay';
import { getConfidenceColor, formatSourceName } from './utils/dataVisualizationUtils';

export const VitalHealthDashboard: React.FC = () => {
  const [enhancedData, setEnhancedData] = useState<any>(null);
  const [enhancedLoading, setEnhancedLoading] = useState<boolean>(false);
  const [enhancedError, setEnhancedError] = useState<string | null>(null);
  const [dataView, setDataView] = useState<string>('comparison');
  const [showSourceInfo, setShowSourceInfo] = useState<boolean>(false);
  
  const {
    loading,
    error,
    category,
    setCategory,
    data,
    metadata,
    sources
  } = useVitalHealthData();
  
  // Create instance of enhanced connector
  const enhancedConnector = new EnhancedHealthDataConnector();
  
  // Fetch enhanced data when category changes
  useEffect(() => {
    const fetchEnhancedData = async () => {
      setEnhancedLoading(true);
      setEnhancedError(null);
      
      try {
        // Cast the category to string to safely compare with string literals
        const categoryValue = category as string;
        
        if (categoryValue === 'mental-health' || categoryValue === 'lgbtq-health' || categoryValue === 'obesity') {
          const result = await enhancedConnector.getHealthData(categoryValue, {
            view: dataView
          });
          setEnhancedData(result);
        } else {
          setEnhancedData(null);
        }
      } catch (err: any) {
        console.error('Error fetching enhanced data:', err);
        setEnhancedError(err.message || 'Failed to fetch enhanced data');
      } finally {
        setEnhancedLoading(false);
      }
    };
    
    fetchEnhancedData();
  }, [category, dataView]);

  // Determine which data to display (enhanced or regular)
  const displayData = enhancedData || data;
  const displayMetadata = enhancedData?.metadata || metadata;
  const isLoading = loading || enhancedLoading;
  const displayError = enhancedError || error;

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <DashboardHeader />

      <main className="p-6">
        {/* Dashboard Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Health Metrics Dashboard</h2>
          <p className="text-gray-400">Analyzing health metrics using a hybrid of reliable data sources</p>
          
          <EnhancedDataBadge enhancedData={enhancedData} />
        </div>

        {/* Category Selector */}
        <CategorySelector category={category} onCategoryChange={setCategory} />

        {/* View Selector */}
        <ViewSelector dataView={dataView} setDataView={setDataView} />

        {/* Source Information Panel - Rendered conditionally */}
        {showSourceInfo && displayMetadata && (
          <SourceInfoDisplay 
            showSourceInfo={showSourceInfo}
            displayMetadata={displayMetadata}
            getConfidenceColor={getConfidenceColor}
            formatSourceName={formatSourceName}
          />
        )}

        {/* Data Visualization */}
        <DataVisualizationContainer 
          isLoading={isLoading}
          displayError={displayError}
          displayData={displayData}
          category={category}
          dataView={dataView}
          displayMetadata={displayMetadata}
          sources={sources}
          showSourceInfo={showSourceInfo}
          getConfidenceColor={getConfidenceColor}
          formatSourceName={formatSourceName}
          setShowSourceInfo={setShowSourceInfo}
        />
      </main>
      
      <DashboardFooter />
    </div>
  );
};
