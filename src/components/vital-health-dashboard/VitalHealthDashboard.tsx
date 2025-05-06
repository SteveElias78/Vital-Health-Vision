
import React, { useState, useEffect } from 'react';
import { useVitalHealthData } from '@/hooks/useVitalHealthData';
import { DashboardHeader } from './DashboardHeader';
import { DashboardFooter } from './DashboardFooter';
import { CategorySelector } from './CategorySelector';
import { HealthDataChart } from './HealthDataChart';
import { SourcesPanel } from './SourcesPanel';
import { EnhancedHealthDataConnector } from '@/data/connectors/EnhancedHealthDataConnector';
import { Loader } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MockDataCategory } from '@/data/connectors/MockHybridHealthDataConnector';

export const VitalHealthDashboard: React.FC = () => {
  const [enhancedData, setEnhancedData] = useState<any>(null);
  const [enhancedLoading, setEnhancedLoading] = useState<boolean>(false);
  const [enhancedError, setEnhancedError] = useState<string | null>(null);
  
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
          const result = await enhancedConnector.getHealthData(categoryValue, {});
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
  }, [category]);

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
          
          {enhancedData && (
            <div className="mt-2 px-3 py-1 bg-blue-900 inline-block rounded text-sm">
              Enhanced data available for this category
            </div>
          )}
        </div>

        {/* Category Selector */}
        <CategorySelector category={category} onCategoryChange={setCategory} />

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center my-10">
            <Loader className="animate-spin h-8 w-8 mr-2 text-blue-500" />
            <span>Loading health data...</span>
          </div>
        )}

        {/* Error State */}
        {displayError && (
          <Alert variant="destructive" className="my-6">
            <AlertDescription>{displayError}</AlertDescription>
          </Alert>
        )}

        {/* Data Visualization */}
        {!isLoading && !displayError && displayData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Chart */}
            <HealthDataChart 
              data={displayData} 
              metadata={displayMetadata} 
              category={category} 
              loading={isLoading} 
            />
            
            {/* Data Source Information */}
            {sources && (
              <SourcesPanel sources={sources} currentSourceId={displayMetadata?.source} />
            )}
          </div>
        )}
      </main>
      
      <DashboardFooter />
    </div>
  );
};
