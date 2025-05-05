
import { AxiosRequestConfig } from 'axios';
import { DataSourceConfig, DataResponse } from './types';
import { CacheManager } from './connectors/CacheManager';
import { AuthManager } from './connectors/AuthManager';
import { RequestManager } from './connectors/RequestManager';

export class BaseDataConnector {
  protected sourceId: string;
  protected config: DataSourceConfig;
  protected baseUrl: string;
  protected requiresAuth: boolean;
  protected authType?: 'apiKey' | 'oauth';
  protected reliability: number;
  protected categories: string[];
  
  // Managers
  protected cacheManager: CacheManager;
  protected authManager: AuthManager;
  protected requestManager: RequestManager;
  
  constructor(sourceId: string, config: DataSourceConfig) {
    this.sourceId = sourceId;
    this.config = config;
    this.baseUrl = config.baseUrl;
    this.requiresAuth = config.requiresAuth || false;
    this.authType = config.authType;
    this.reliability = config.reliability || 0.8;
    this.categories = config.categories || [];
    
    // Initialize managers
    this.cacheManager = new CacheManager(
      config.cacheEnabled !== false,
      config.cacheDuration || 3600000
    );
    
    this.authManager = new AuthManager(
      sourceId,
      this.requiresAuth,
      this.authType
    );
    
    this.requestManager = new RequestManager(
      sourceId,
      this.baseUrl,
      this.reliability,
      this.cacheManager,
      this.authManager
    );
  }
  
  /**
   * Helper method to expose the cache key generation
   */
  protected getCacheKey(url: string, params: any): string {
    return this.cacheManager.getCacheKey(url, params);
  }
  
  /**
   * Makes an API request with authentication
   */
  public async makeRequest<T = any>(
    endpoint: string, 
    params: Record<string, any> = {}, 
    options: Partial<AxiosRequestConfig> = {}
  ): Promise<DataResponse<T>> {
    return this.requestManager.makeRequest<T>(endpoint, params, options);
  }
  
  /**
   * Verifies data integrity (to be implemented by subclasses)
   */
  public async verifyDataIntegrity(data: any): Promise<boolean> {
    // Default implementation assumes data is valid
    return true;
  }
  
  /**
   * Normalizes field names (to be implemented by subclasses)
   */
  public normalizeFieldNames<T = any>(data: any): T {
    // Default implementation returns data as-is
    return data;
  }
}
