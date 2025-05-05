
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { DataResponse } from '../types';
import { CacheManager } from './CacheManager';
import { AuthManager } from './AuthManager';

// Define a custom interface for responses that may have a cached property
interface CustomAxiosResponse extends AxiosResponse {
  cached?: boolean;
}

export class RequestManager {
  private sourceId: string;
  private baseUrl: string;
  private reliability: number;
  private client: AxiosInstance;
  private cacheManager: CacheManager;
  private authManager: AuthManager;

  constructor(
    sourceId: string, 
    baseUrl: string, 
    reliability: number,
    cacheManager: CacheManager,
    authManager: AuthManager
  ) {
    this.sourceId = sourceId;
    this.baseUrl = baseUrl;
    this.reliability = reliability;
    this.cacheManager = cacheManager;
    this.authManager = authManager;
    
    // Create the API client
    this.client = this.createApiClient();
  }

  /**
   * Creates an axios client for this data source
   */
  private createApiClient(): AxiosInstance {
    const headers: Record<string, string> = {};
    
    // Add default headers
    headers['Accept'] = 'application/json';
    
    // Create axios instance
    const client = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000, // 30 second timeout
      headers
    });
    
    // Add request interceptor for caching
    if (this.cacheManager.isCacheEnabled()) {
      client.interceptors.request.use(
        async (config: InternalAxiosRequestConfig) => {
          // Skip cache for non-GET requests
          if (config.method?.toLowerCase() !== 'get') {
            return config;
          }
          
          const cacheKey = this.cacheManager.getCacheKey(config.url as string, config.params);
          
          if (this.cacheManager.has(cacheKey) && this.cacheManager.isValid(cacheKey)) {
            // Return cached response
            // Using a custom adapter to simulate a cached response
            const cachedResponse = this.cacheManager.get(cacheKey);
            const cachedConfig = { ...config };
            (cachedConfig as any).adapter = () => Promise.resolve({
              data: cachedResponse?.data,
              status: 200,
              statusText: 'OK',
              headers: {},
              config: cachedConfig,
              cached: true
            });
            return cachedConfig;
          }
          
          return config;
        },
        error => Promise.reject(error)
      );
      
      // Add response interceptor for caching
      client.interceptors.response.use(
        (response: CustomAxiosResponse) => {
          if (response.config.method?.toLowerCase() === 'get' && !response.cached) {
            const cacheKey = this.cacheManager.getCacheKey(
              response.config.url as string, 
              response.config.params
            );
            
            this.cacheManager.set(cacheKey, response.data);
          }
          return response;
        },
        error => Promise.reject(error)
      );
    }
    
    return client;
  }

  /**
   * Makes an API request with authentication
   */
  public async makeRequest<T = any>(
    endpoint: string, 
    params: Record<string, any> = {}, 
    options: Partial<AxiosRequestConfig> = {}
  ): Promise<DataResponse<T>> {
    try {
      const headers = await this.authManager.setAuthHeader(options.headers as Record<string, string> || {});
      
      const response = await this.client.get<T>(endpoint, {
        params,
        headers,
        ...options
      }) as CustomAxiosResponse;
      
      return {
        data: response.data,
        metadata: {
          source: this.sourceId,
          endpoint,
          timestamp: new Date().toISOString(),
          reliability: this.reliability,
          cached: !!response.cached
        }
      };
    } catch (error: any) {
      console.error(`Request failed for ${this.sourceId}${endpoint}:`, error);
      throw new Error(`API request failed: ${error.message}`);
    }
  }
}
