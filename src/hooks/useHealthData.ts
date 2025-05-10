
import { useState, useEffect } from 'react';
import { DemoDataService, HealthDataCategory } from '@/data/demo/DemoDataService';

const demoDataService = new DemoDataService();

export type { HealthDataCategory };

export const useHealthData = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any | null>(null);
  const [metadata, setMetadata] = useState<any | null>(null);
  const [sources, setSources] = useState<any[] | null>(null);
  const [dataCategory, setDataCategory] = useState<HealthDataCategory>('obesity');
  
  useEffect(() => {
    const fetchHealthData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch health data for the selected category
        const { data, metadata } = await demoDataService.getHealthData(dataCategory);
        
        // Fetch sources information
        const sourcesData = await demoDataService.getDataSources();
        
        setData(data);
        setMetadata(metadata);
        setSources(sourcesData);
      } catch (err) {
        console.error('Error fetching health data:', err);
        setError('Failed to load health data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchHealthData();
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
