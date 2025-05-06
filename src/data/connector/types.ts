
/**
 * Core types for the Health Data Connector system
 */

export interface ConnectorConfig {
  name?: string;
  sourceType?: string;
  tier?: string;
  baseUrl?: string;
  apiKey?: string;
  cacheTime?: number;
}

export interface SourceMetadata {
  name: string;
  type: string;
  tier: string;
  reliability: number;
  lastUpdated: string | null;
  confidenceScore: number;
}

export interface CachedItem {
  data: any;
  timestamp: number;
}

export interface ValidationResult {
  isValid: boolean;
  score: number;
  issues: string[];
  outliers?: Array<{ index: number; value: number }> | null;
}

export interface MetricInfo {
  primarySources: string[];
  alternativeSources: string[];
  description: string;
  unit: string;
}

export interface MetricsRegistry {
  [key: string]: MetricInfo;
}

export interface HealthDataResponse {
  data: any;
  source: string;
  sourceMetadata: SourceMetadata;
  validationStatus: ValidationResult;
  fallbackNote?: string;
}
