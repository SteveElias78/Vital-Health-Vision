
import { useState, useEffect } from 'react';
import { HybridHealthDataConnector } from '@/data/connector/HybridHealthDataConnector';
import { HealthDataResponse } from '@/data/connector/types';

interface UseHybridHealthDataOptions {
  initialMetric?: string;
  fetchOnMount?: boolean;
  fetchOptions?: Record<string, any>;
}

export function useHybridHealthData(options: UseHybridHealthDataOptions = {}) {
  const {
    initialMetric = 'obesity',
    fetchOnMount = true,
    fetchOptions = {}
  } = options;

  const [metric, setMetric] = useState(initialMetric);
  const [loading, setLoading] = useState(fetchOnMount);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<HealthDataResponse | null>(null);
  const [availableMetrics, setAvailableMetrics] = useState<string[]>([]);
  
  // Create instance of the connector
  const connector = new HybridHealthDataConnector();
  
  // Fetch list of available metrics
  useEffect(() => {
    try {
      const metrics = connector.getAvailableMetrics();
      setAvailableMetrics(metrics);
    } catch (err) {
      console.error('Error fetching available metrics:', err);
    }
  }, []);
  
  // Fetch data when metric changes or on mount if fetchOnMount is true
  useEffect(() => {
    if (!fetchOnMount && !metric) return;
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await connector.fetchHealthData(metric, fetchOptions);
        setData(result);
      } catch (err) {
        console.error('Error fetching health data:', err);
        setError(err instanceof Error ? err : new Error('Unknown error fetching health data'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [metric, fetchOnMount]);

  // Function to manually fetch data with new options
  const fetchData = async (newMetric?: string, newOptions: Record<string, any> = {}) => {
    const metricToFetch = newMetric || metric;
    setLoading(true);
    setError(null);
    
    try {
      const result = await connector.fetchHealthData(metricToFetch, {
        ...fetchOptions,
        ...newOptions
      });
      setData(result);
      
      // Update metric if a new one was provided
      if (newMetric && newMetric !== metric) {
        setMetric(newMetric);
      }
      
      return result;
    } catch (err) {
      console.error('Error fetching health data:', err);
      const error = err instanceof Error ? err : new Error('Unknown error fetching health data');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    metric,
    setMetric,
    fetchData,
    availableMetrics,
    connector,
    metricInfo: metric ? connector.getMetricInfo(metric) : null
  };
}
