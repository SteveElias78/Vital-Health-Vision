
import React from 'react';
import { Loader } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MockDataCategory } from '@/data/connectors/MockHybridHealthDataConnector';
import { SourcesPanel } from '../SourcesPanel';
import { CategoryChartView } from './CategoryChartView';

interface DataVisualizationContainerProps {
  isLoading: boolean;
  displayError: string | null;
  displayData: any;
  category: MockDataCategory;
  dataView: string;
  displayMetadata: any;
  sources: any;
  showSourceInfo: boolean;
  getConfidenceColor: (score: number) => string;
  formatSourceName: (id: string) => string;
  setShowSourceInfo: (show: boolean) => void;
}

export const DataVisualizationContainer: React.FC<DataVisualizationContainerProps> = ({
  isLoading,
  displayError,
  displayData,
  category,
  dataView,
  displayMetadata,
  sources,
  showSourceInfo,
  getConfidenceColor,
  formatSourceName,
  setShowSourceInfo
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center my-10">
        <Loader className="animate-spin h-8 w-8 mr-2 text-blue-500" />
        <span>Loading health data...</span>
      </div>
    );
  }

  if (displayError) {
    return (
      <Alert variant="destructive" className="my-6">
        <AlertDescription>
          {displayError}
        </AlertDescription>
      </Alert>
    );
  }

  if (!displayData) {
    return null;
  }

  return (
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
        
        <div className="p-4 h-full">
          <CategoryChartView
            category={category}
            dataView={dataView}
            displayData={displayData}
            displayMetadata={displayMetadata}
            isLoading={isLoading}
            showSourceInfo={showSourceInfo}
          />
        </div>
      </div>
      
      {/* Data Source Information */}
      {sources && (
        <SourcesPanel sources={sources} currentSourceId={displayMetadata?.source} />
      )}
    </div>
  );
};
