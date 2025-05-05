
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface AuthConfig {
  apiKey?: string;
  headerName?: string;
  prefix?: string;
  clientId?: string;
  clientSecret?: string;
  tokenUrl?: string;
  grantType?: string;
}

export interface DataSourceConfig {
  baseUrl: string;
  requiresAuth?: boolean;
  authType?: 'apiKey' | 'oauth';
  reliability?: number;
  categories?: string[];
  cacheEnabled?: boolean;
  cacheDuration?: number;
  integrityVerificationRequired?: boolean;
  [key: string]: any;
}

export interface CachedResponse {
  data: any;
  timestamp: number;
}

export interface DataResponse<T = any> {
  data: T;
  metadata: {
    source: string;
    endpoint: string;
    timestamp: string;
    reliability: number;
    cached: boolean;
    [key: string]: any; // For additional metadata properties
  };
}

// Connector related interfaces
export interface ConnectorOptions {
  [key: string]: any;
}

export interface StateData {
  state: string;
  value: number;
  [key: string]: any;
}

export interface DataCategory {
  description: string;
  [key: string]: any;
}

export interface DataCategories {
  [key: string]: DataCategory;
}
