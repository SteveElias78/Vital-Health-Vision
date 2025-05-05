
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

interface ApiClientOptions {
  headers?: Record<string, string>;
  cacheDuration?: number;
  timeout?: number;
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
    timeout = 30000 // 30 seconds default
  } = options;
  
  // Create the axios client
  const client = axios.create({
    baseURL,
    timeout,
    headers: {
      'Accept': 'application/json',
      ...headers
    }
  });
  
  // Add request/response interceptors as needed
  // For example, caching logic could be added here
  
  return client;
}
