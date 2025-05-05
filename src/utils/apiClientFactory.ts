
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

interface ApiClientOptions {
  headers?: Record<string, string>;
  cacheDuration?: number;
  timeout?: number;
  validateStatus?: (status: number) => boolean;
  withCredentials?: boolean;
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
    withCredentials = false
  } = options;
  
  // Create the axios client
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
  
  // Add request/response interceptors if needed
  client.interceptors.request.use(
    (config) => {
      // Request interceptor logic could be added here
      // For example, adding timestamps or custom headers
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
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
