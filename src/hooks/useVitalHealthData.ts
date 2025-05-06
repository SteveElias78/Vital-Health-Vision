
import { useState, useEffect } from 'react';
import { MockHybridHealthDataConnector, MockDataCategory } from '@/data/connectors/MockHybridHealthDataConnector';

export type HealthDataMetadata = {
  source: string;
  sourceType: 'government' | 'alternative';
  reliability: number;
  dataCategory: string;
  integrityVerified?: boolean;
  validation?: {
    sourcesCompared: number;
    primarySource: string;
    discrepancies: any[];
    confidenceScore: number;
    sourceSwitch?: {
      from: string;
      to: string;
      reason: string;
    };
  };
};

export interface SourceInfo {
  id: string;
  name: string;
  type: 'government' | 'alternative';
  reliability: number;
  categories: string[];
  status: {
    available: boolean;
    integrityVerified?: boolean;
  };
}

export interface SourcesInfo {
  government: SourceInfo[];
  alternative: SourceInfo[];
  compromisedCategories: string[];
}

export function useVitalHealthData() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<MockDataCategory>('lgbtq-health');
  const [data, setData] = useState<any[] | null>(null);
  const [metadata, setMetadata] = useState<HealthDataMetadata | null>(null);
  const [sources, setSources] = useState<SourcesInfo | null>(null);
  
  // Create an instance of the data connector
  const dataConnector = new MockHybridHealthDataConnector();

  // Fetch data when category changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get data from the connector
        const result = await dataConnector.getHealthData(category, {}, {
          preserveSnapshot: true
        });
        
        setData(result.data);
        
        // Ensure metadata matches expected type before setting
        const typedMetadata: HealthDataMetadata = {
          source: result.metadata.source,
          sourceType: result.metadata.sourceType || 'government',
          reliability: result.metadata.reliability,
          dataCategory: result.metadata.dataCategory || category,
          integrityVerified: result.metadata.integrityVerified,
          validation: result.metadata.validation
        };
        
        setMetadata(typedMetadata);
        
        // Get info about all sources
        const sourcesInfo = dataConnector.getSourcesInfo();
        
        // Convert type strings to the expected union type
        const typedSourcesInfo: SourcesInfo = {
          government: sourcesInfo.government.map(source => ({
            ...source,
            type: source.type === 'government' ? 'government' : 'alternative'
          } as SourceInfo)),
          alternative: sourcesInfo.alternative.map(source => ({
            ...source,
            type: source.type === 'government' ? 'government' : 'alternative'
          } as SourceInfo)),
          compromisedCategories: sourcesInfo.compromisedCategories
        };
        
        setSources(typedSourcesInfo);
      } catch (err: any) {
        console.error('Failed to fetch data:', err);
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [category]);

  return {
    loading,
    error,
    category,
    setCategory,
    data,
    metadata,
    sources
  };
}
