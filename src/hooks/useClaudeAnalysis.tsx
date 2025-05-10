
import { useState, useCallback } from 'react';
import { claudeService, ClaudeService } from '@/services/ClaudeService';

interface ClaudeAnalysisOptions {
  datasetId?: string;
  category?: string;
  metric?: string;
  timeRange?: [Date, Date];
  detailLevel?: 'summary' | 'detailed' | 'technical';
}

interface ClaudeAnalysisResult {
  insights: string;
  keyFindings: string[];
  recommendations: string[];
  correlations?: {
    metric: string;
    correlationStrength: number;
    description: string;
  }[];
  visualizationSuggestions?: {
    type: string;
    title: string;
    description: string;
  }[];
}

export function useClaudeAnalysis() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<ClaudeAnalysisResult | null>(null);
  
  const analyzeData = useCallback(async (
    data: any[],
    options: ClaudeAnalysisOptions = {}
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const results = await claudeService.analyzeHealthData(data, options);
      setResults(results);
      return results;
    } catch (err) {
      console.error('Error analyzing data with Claude:', err);
      setError(err instanceof Error ? err.message : 'Unknown error during analysis');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return {
    loading,
    error,
    results,
    analyzeData
  };
}
