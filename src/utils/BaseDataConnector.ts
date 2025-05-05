
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { AUTH_CONFIG } from '../config/dataSourceConfig';
import { AuthConfig, DataSourceConfig, CachedResponse, DataResponse } from './types';

// Define a custom interface for responses that may have a cached property
interface CustomAxiosResponse extends AxiosResponse {
  cached?: boolean;
}

export class BaseDataConnector {
  protected sourceId: string;
  protected config: DataSourceConfig;
  protected baseUrl: string;
  protected requiresAuth: boolean;
  protected authType?: 'apiKey' | 'oauth';
  protected reliability: number;
  protected categories: string[];
  
  // Cache configuration
  protected cacheEnabled: boolean;
  protected cacheDuration: number; // milliseconds
  protected cache: Map<string, CachedResponse>;
  
  // Request client
  protected client: AxiosInstance;
  
  constructor(sourceId: string, config: DataSourceConfig) {
    this.sourceId = sourceId;
    this.config = config;
    this.baseUrl = config.baseUrl;
    this.requiresAuth = config.requiresAuth || false;
    this.authType = config.authType;
    this.reliability = config.reliability || 0.8;
    this.categories = config.categories || [];
    
    // Cache configuration
    this.cacheEnabled = config.cacheEnabled !== false;
    this.cacheDuration = config.cacheDuration || 3600000; // 1 hour default
    this.cache = new Map<string, CachedResponse>();
    
    // Request client
    this.client = this.createApiClient();
  }
  
  /**
   * Creates an axios client for this data source
   */
  protected createApiClient(): AxiosInstance {
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
    if (this.cacheEnabled) {
      client.interceptors.request.use(
        async (config: InternalAxiosRequestConfig) => {
          // Skip cache for non-GET requests
          if (config.method?.toLowerCase() !== 'get') {
            return config;
          }
          
          const cacheKey = this.getCacheKey(config.url as string, config.params);
          
          if (this.cache.has(cacheKey)) {
            const cachedResponse = this.cache.get(cacheKey);
            if (cachedResponse && Date.now() - cachedResponse.timestamp < this.cacheDuration) {
              // Return cached response
              // Using a custom adapter to simulate a cached response
              const cachedConfig = { ...config };
              (cachedConfig as any).adapter = () => Promise.resolve({
                data: cachedResponse.data,
                status: 200,
                statusText: 'OK',
                headers: {},
                config: cachedConfig,
                cached: true
              });
              return cachedConfig;
            }
          }
          
          return config;
        },
        error => Promise.reject(error)
      );
      
      // Add response interceptor for caching
      client.interceptors.response.use(
        (response: CustomAxiosResponse) => {
          if (response.config.method?.toLowerCase() === 'get' && !response.cached) {
            const cacheKey = this.getCacheKey(
              response.config.url as string, 
              response.config.params
            );
            
            this.cache.set(cacheKey, {
              data: response.data,
              timestamp: Date.now()
            });
          }
          return response;
        },
        error => Promise.reject(error)
      );
    }
    
    return client;
  }
  
  /**
   * Gets an authentication token for this data source
   */
  protected async getAuthToken(): Promise<string | null> {
    if (!this.requiresAuth) {
      return null;
    }
    
    const authConfig = AUTH_CONFIG[this.sourceId];
    if (!authConfig) {
      throw new Error(`Auth configuration not found for source: ${this.sourceId}`);
    }
    
    if (this.authType === 'apiKey') {
      return authConfig.apiKey || null;
    } else if (this.authType === 'oauth') {
      try {
        const response = await axios.post(authConfig.tokenUrl as string, {
          client_id: authConfig.clientId,
          client_secret: authConfig.clientSecret,
          grant_type: authConfig.grantType || 'client_credentials'
        });
        
        return response.data.access_token;
      } catch (error) {
        console.error(`OAuth token acquisition failed for ${this.sourceId}:`, error);
        throw new Error(`Authentication failed for ${this.sourceId}`);
      }
    }
    
    return null;
  }
  
  /**
   * Sets authentication header for a request
   */
  protected async setAuthHeader(headers: Record<string, string> = {}): Promise<Record<string, string>> {
    if (!this.requiresAuth) {
      return headers;
    }
    
    const authConfig = AUTH_CONFIG[this.sourceId];
    if (!authConfig) {
      return headers;
    }
    
    const token = await this.getAuthToken();
    if (!token) {
      return headers;
    }
    
    const headerName = authConfig.headerName || 'Authorization';
    const prefix = authConfig.prefix || '';
    
    return {
      ...headers,
      [headerName]: `${prefix}${token}`
    };
  }
  
  /**
   * Gets a cache key for a request
   */
  protected getCacheKey(url: string, params: any): string {
    return `${url}:${JSON.stringify(params || {})}`;
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
      const headers = await this.setAuthHeader(options.headers as Record<string, string> || {});
      
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
