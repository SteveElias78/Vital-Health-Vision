
import { ConnectorConfig, SourceMetadata, CachedItem } from './types';

/**
 * Base connector class that all specialized health data connectors extend
 */
export class BaseDataConnector {
  protected config: ConnectorConfig;
  protected name: string;
  protected sourceType: string;
  protected tier: string;
  protected baseUrl: string;
  protected apiKey: string | null;
  protected lastFetched: string | null;
  protected cacheTime: number;
  protected cache: Map<string, CachedItem>;

  constructor(config: ConnectorConfig = {}) {
    this.config = config;
    this.name = config.name || 'Unnamed Connector';
    this.sourceType = config.sourceType || 'unknown';
    this.tier = config.tier || '3';
    this.baseUrl = config.baseUrl || '';
    this.apiKey = config.apiKey || null;
    this.lastFetched = null;
    this.cacheTime = config.cacheTime || 3600000; // Default cache: 1 hour
    this.cache = new Map();
  }

  /**
   * Fetch data from the source - must be implemented by subclasses
   * @param params - Parameters to customize the request
   * @returns Promise with the fetched data
   */
  async fetchData(params: Record<string, any> = {}): Promise<any> {
    throw new Error(`${this.name} must implement fetchData`);
  }

  /**
   * Get metadata about this data source
   * @returns Metadata including reliability score
   */
  getSourceMetadata(): SourceMetadata {
    return {
      name: this.name,
      type: this.sourceType,
      tier: this.tier,
      reliability: this.assessReliability(),
      lastUpdated: this.lastFetched,
      confidenceScore: this.calculateConfidenceScore()
    };
  }

  /**
   * Assess the reliability of this data source
   * @returns Reliability score between 0 and 1
   */
  protected assessReliability(): number {
    // Base reliability on tier by default
    switch (this.tier) {
      case '1A': return 0.95;
      case '1B': return 0.9;
      case '2': return 0.8;
      case '3': return 0.7;
      default: return 0.6;
    }
  }

  /**
   * Calculate confidence score for the data
   * @returns Confidence score between 0 and 1
   */
  protected calculateConfidenceScore(): number {
    // Default implementation - subclasses can override
    return this.assessReliability();
  }

  /**
   * Check if cached data exists and is still valid
   * @param cacheKey - Key to identify the cached data
   * @returns Whether valid cached data exists
   */
  protected hasCachedData(cacheKey: string): boolean {
    if (!this.cache.has(cacheKey)) return false;
    
    const cached = this.cache.get(cacheKey);
    const now = Date.now();
    
    return cached ? (now - cached.timestamp) < this.cacheTime : false;
  }

  /**
   * Get cached data if available
   * @param cacheKey - Key to identify the cached data
   * @returns Cached data or null if not available
   */
  protected getCachedData(cacheKey: string): any | null {
    if (!this.hasCachedData(cacheKey)) return null;
    const cached = this.cache.get(cacheKey);
    return cached ? cached.data : null;
  }

  /**
   * Store data in cache
   * @param cacheKey - Key to identify the cached data
   * @param data - Data to cache
   */
  protected cacheData(cacheKey: string, data: any): void {
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * Generate a cache key from parameters
   * @param params - Parameters to hash into a cache key
   * @returns Generated cache key
   */
  protected generateCacheKey(params: Record<string, any>): string {
    return JSON.stringify(params);
  }
}
