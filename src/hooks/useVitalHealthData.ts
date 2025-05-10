
import { useState, useEffect } from 'react';
import { demoDataService, HealthDataCategory, HealthDataMetadata } from '@/data/demo/DemoDataService';

export interface HealthDataMetadata {
  source: string;
  lastUpdated: string;
  description?: string;
  methods?: string[];
  sampleSize?: number;
  geographicCoverage?: string[];
  reliability?: number;
  sourceType?: string;
  validation?: {
    confidenceScore?: number;
    sourceSwitch?: {
      from: string;
      to: string;
      reason?: string;
    };
    discrepancies?: Array<{
      primarySource: string;
      comparisonSource: string;
      discrepancies: Array<{
        primary: any;
        comparison: any;
        percentDiff?: number;
      }>;
    }>;
  };
}

export const useVitalHealthData = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any | null>(null);
  const [metadata, setMetadata] = useState<HealthDataMetadata | null>(null);
  const [sources, setSources] = useState<any[] | null>(null);
  const [category, setCategory] = useState<HealthDataCategory>('obesity');
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch health data
        const result = await demoDataService.getHealthData(category);
        
        // Convert HealthDataMetadata to our local interface format
        const convertedMetadata: HealthDataMetadata = {
          source: result.metadata.source,
          lastUpdated: result.metadata.updated || '',
          description: result.metadata.description,
          reliability: result.metadata.reliability,
          sourceType: 'government', // Default value
          methods: result.metadata.methods,
          sampleSize: result.metadata.sampleSize,
          geographicCoverage: result.metadata.geographicCoverage
        };
        
        setData(result.data);
        setMetadata(convertedMetadata);
        
        // Fetch data sources
        const sourcesData = await demoDataService.getDataSources();
        setSources(sourcesData);
      } catch (err: any) {
        console.error('Error fetching health data:', err);
        setError(err.message || 'Failed to load health data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [category]);
  
  return {
    loading,
    error,
    data,
    metadata,
    sources,
    category,
    setCategory
  };
};

export default useVitalHealthData;
