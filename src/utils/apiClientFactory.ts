import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { ApiKeyManager } from './api-keys';

interface ApiClientOptions {
  headers?: Record<string, string>;
  cacheDuration?: number;
  timeout?: number;
  validateStatus?: (status: number) => boolean;
  withCredentials?: boolean;
  authSource?: string; // Source ID for authentication
  authToken?: string; // Direct auth token if available
}

/**
 * Creates a pre-configured axios client for API requests
 * @param baseURL The base URL for the API
 * @param options Additional options for the client
 * @returns Configured axios instance
 */
export function createApiClient(baseURL: string, options: ApiClientOptions = {}): AxiosInstance {
  const { 
    headers = {}, 
    cacheDuration = 3600000, // 1 hour default
    timeout = 30000, // 30 seconds default
    validateStatus,
    withCredentials = false,
    authSource,
    authToken
  } = options;
  
  // Create the axios client with initial headers
  const client = axios.create({
    baseURL,
    timeout,
    withCredentials,
    validateStatus,
    headers: {
      'Accept': 'application/json',
      ...headers
    }
  });
  
  // Add request interceptor for authentication
  client.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      // If we have a direct auth token, use it
      if (authToken) {
        config.headers.set('Authorization', `Bearer ${authToken}`);
        return config;
      }
      
      // If we have an auth source, try to get auth headers
      if (authSource) {
        try {
          const authHeaders = await ApiKeyManager.getInstance().getAuthHeader(authSource);
          
          // Use proper Axios header methods to set headers
          for (const [key, value] of Object.entries(authHeaders)) {
            config.headers.set(key, value);
          }
        } catch (error) {
          console.warn(`Failed to get auth headers for ${authSource}:`, error);
        }
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  // Response interceptor remains the same
  client.interceptors.response.use(
    (response) => {
      // Response interceptor logic could be added here
      // For example, logging or transformation
      return response;
    },
    (error) => {
      // Error handling could be added here
      return Promise.reject(error);
    }
  );
  
  return client;
}
