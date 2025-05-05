
import { useState, useEffect, useMemo } from "react";
import { HybridHealthDataConnector } from "@/data/HybridHealthDataConnector";
import { DataSourceIntegrationManager } from "@/data/integration/DataSourceIntegrationManager";

export type HealthDataCategory = 'obesity' | 'mental-health' | 'lgbtq-health';

export const useHealthData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataCategory, setDataCategory] = useState<HealthDataCategory>('obesity');
  const [data, setData] = useState<any>(null);
  const [metadata, setMetadata] = useState<any>(null);
  const [sources, setSources] = useState<any>(null);

  // Create instances of our data connectors
  const dataConnector = useMemo(() => new HybridHealthDataConnector(), []);
  const integrationManager = useMemo(() => new DataSourceIntegrationManager(dataConnector), [dataConnector]);

  // Fetch data when category changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get data from the integration manager for better resilience
        const result = await integrationManager.getHealthDataWithAutoSwitch(dataCategory);
        
        if (result && result.data) {
          setData(result.data);
          setMetadata(result.metadata);
          
          // Get info about all sources
          const sourcesInfo = dataConnector.getSourcesInfo();
          setSources(sourcesInfo);
        } else {
          throw new Error('No data returned');
        }
      } catch (err: any) {
        console.error('Failed to fetch data:', err);
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [dataCategory, dataConnector, integrationManager]);

  return {
    loading,
    error,
    data,
    metadata,
    sources,
    dataCategory,
    setDataCategory
  };
};
