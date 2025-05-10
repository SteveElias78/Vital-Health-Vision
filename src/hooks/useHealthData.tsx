
import { useState, useEffect } from 'react';
import { demoDataService, HealthDataCategory, HealthDataPoint, HealthDataMetadata, DataSource } from '@/data/demo/DemoDataService';

interface HealthDataFilters {
  dateRange?: [Date, Date];
  ageGroup?: string;
  gender?: string;
  region?: string;
  state?: string;
  race?: string;
}

interface UseHealthDataResult {
  loading: boolean;
  error: string | null;
  data: HealthDataPoint[] | null;
  metadata: HealthDataMetadata | null;
  sources: DataSource[] | null;
  dataCategory: HealthDataCategory;
  setDataCategory: (category: HealthDataCategory) => void;
  setFilters: (filters: HealthDataFilters) => void;
  refreshData: () => Promise<void>;
}

export const useHealthData = (): UseHealthDataResult => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<HealthDataPoint[] | null>(null);
  const [metadata, setMetadata] = useState<HealthDataMetadata | null>(null);
  const [sources, setSources] = useState<DataSource[] | null>(null);
  const [dataCategory, setDataCategory] = useState<HealthDataCategory>('obesity');
  const [filters, setFilters] = useState<HealthDataFilters>({});
  
  // Load data when category or filters change
  useEffect(() => {
    loadData();
    loadSources();
  }, [dataCategory, filters]);
  
  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await demoDataService.getHealthData(dataCategory, filters);
      setData(result.data);
      setMetadata(result.metadata);
    } catch (err) {
      console.error('Error loading health data:', err);
      setError('Failed to load health data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const loadSources = async () => {
    try {
      const sourcesData = await demoDataService.getDataSources();
      setSources(sourcesData);
    } catch (err) {
      console.error('Error loading data sources:', err);
      // Don't set error state here as it would override the main data error
    }
  };
  
  const refreshData = async () => {
    await loadData();
  };
  
  return {
    loading,
    error,
    data,
    metadata,
    sources,
    dataCategory,
    setDataCategory,
    setFilters,
    refreshData
  };
};

export { HealthDataCategory };
export default useHealthData;
