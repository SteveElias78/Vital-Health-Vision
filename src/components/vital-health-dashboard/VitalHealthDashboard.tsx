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
import { ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

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

  // Get confidence level color
  const getConfidenceColor = (score: number) => {
    if (score >= 0.9) return '#4cd137'; // High confidence
    if (score >= 0.7) return '#fbc531';  // Medium confidence
    return '#e84118';                    // Low confidence
  };

  // Format source name for display
  const formatSourceName = (source: string) => {
    return source.replace(/_/g, ' ');
  };

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

        {/* View Selector */}
        <div className="mb-6 flex space-x-2">
          <button
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              dataView === 'comparison' 
                ? 'bg-yellow-500 bg-opacity-20 text-yellow-500' 
                : 'bg-transparent text-gray-400 hover:text-yellow-500'
            }`}
            onClick={() => setDataView('comparison')}
          >
            Compared View
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              dataView === 'nhanes' 
                ? 'bg-yellow-500 bg-opacity-20 text-yellow-500' 
                : 'bg-transparent text-gray-400 hover:text-yellow-500'
            }`}
            onClick={() => setDataView('nhanes')}
          >
            NHANES (Measured)
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              dataView === 'brfss' 
                ? 'bg-yellow-500 bg-opacity-20 text-yellow-500' 
                : 'bg-transparent text-gray-400 hover:text-yellow-500'
            }`}
            onClick={() => setDataView('brfss')}
          >
            BRFSS (Self-Reported)
          </button>
        </div>

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
            <AlertDescription>
              {displayError}
            </AlertDescription>
          </Alert>
        )}

        {/* Data Visualization */}
        {!isLoading && !displayError && displayData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Chart */}
            <div className="lg:col-span-2 bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 h-96">
              <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <h3 className="font-medium text-yellow-500">
                  {(category as string) === 'obesity' && 'BMI Measurements'}
                  {(category as string) === 'mental-health' && 'Mental Health Indicators'}
                  {(category as string) === 'lgbtq-health' && 'LGBTQ+ Health Metrics'}
                </h3>
                
                {/* Source Info Button */}
                <button 
                  onClick={() => setShowSourceInfo(!showSourceInfo)}
                  className="flex items-center text-xs bg-gray-700 hover:bg-gray-600 rounded-full px-3 py-1 text-gray-300"
                >
                  <span className="mr-1">Data Sources</span>
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: getConfidenceColor(displayMetadata?.reliability || 0.8) }}
                  ></div>
                </button>
              </div>
              
              {/* Source Information Panel */}
              {showSourceInfo && displayMetadata && (
                <div className="p-4 bg-gray-700 bg-opacity-50 border-b border-gray-600">
                  <div className="flex justify-between">
                    <div>
                      <span className="text-gray-400 text-xs">Primary Source:</span>
                      <span className="ml-2 text-white text-sm">
                        {Array.isArray(displayMetadata.sources) 
                          ? displayMetadata.sources.join(' & ') 
                          : displayMetadata.source || 'Multiple Sources'}
                      </span>
                    </div>
                    
                    <div className="text-right">
                      <span className="text-gray-400 text-xs">Confidence:</span>
                      <span 
                        className="ml-2 text-sm font-bold" 
                        style={{ color: getConfidenceColor(displayMetadata?.reliability) }}
                      >
                        {Math.round((displayMetadata?.reliability || 0) * 100)}%
                      </span>
                    </div>
                  </div>
                  
                  {/* Data Integrity Information */}
                  <div className="mt-3">
                    <div className="flex items-center">
                      <div 
                        className={`w-3 h-3 rounded-full mr-2 ${
                          displayMetadata.integrityVerified 
                            ? 'bg-green-500' 
                            : 'bg-yellow-500'
                        }`}
                      ></div>
                      <span className="text-xs text-gray-300">
                        {displayMetadata.integrityVerified 
                          ? 'Data integrity verified - no corruption detected' 
                          : 'Data may have been altered - using alternative sources'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Key Info */}
                  <div className="mt-3 text-xs text-gray-400">
                    <p>
                      NHANES data comes from physical examinations and laboratory tests, 
                      while BRFSS data is self-reported through telephone surveys.
                    </p>
                    <p className="mt-1">
                      Last updated: {displayMetadata.timestamp || 'Unknown'}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="p-4 h-full">
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
              </div>
            </div>
            
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
