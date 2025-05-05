
import { useState, useEffect } from "react";
import { HybridHealthDataConnector } from "@/data/HybridHealthDataConnector";

export type HealthDataCategory = 'obesity' | 'mental-health' | 'lgbtq-health';

export const useHealthData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataCategory, setDataCategory] = useState<HealthDataCategory>('obesity');
  const [data, setData] = useState<any>(null);
  const [metadata, setMetadata] = useState<any>(null);
  const [sources, setSources] = useState<any>(null);

  // Create an instance of our data connector
  const dataConnector = new HybridHealthDataConnector();

  // Fetch data when category changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get data from the connector
        const result = await dataConnector.getHealthData(dataCategory);
        
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
  }, [dataCategory]);

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
