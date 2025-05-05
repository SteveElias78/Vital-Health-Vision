
import React from 'react';
import ApiKeyManagement from '../components/ApiKeyManagement';

const DataSourceConfig: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Data Source Configuration</h1>
      <p className="text-gray-600 mb-6">
        Configure access to health data sources by providing the necessary API keys and credentials.
        This will allow Vital Health Vision to access real-time data directly from official sources.
      </p>
      
      <ApiKeyManagement />
      
      <div className="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">About Data Source Authentication</h2>
        <p className="mb-4">
          Some health data sources require authentication for access. Vital Health Vision can work with
          both authenticated and public datasets, automatically falling back to archived data when 
          live sources are unavailable.
        </p>
        <p>
          Your API keys are stored securely in your browser's local storage and are never transmitted
          to our servers. For organizational deployments, please contact your administrator for
          pre-configured API access.
        </p>
      </div>
    </div>
  );
};

export default DataSourceConfig;
