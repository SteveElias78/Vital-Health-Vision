
/**
 * API authentication configuration for health data sources
 */

// Import AuthConfig types if needed
import { AUTH_CONFIG } from './dataSourceConfig';

/**
 * API keys for various health data sources
 * Note: In a real application, these would be environment variables
 */
export const API_KEYS = {
  CDC_DATA_GOV: import.meta.env.VITE_CDC_API_KEY || '',
  WHO_GHO: import.meta.env.VITE_WHO_API_KEY || '',
  FENWAY_INSTITUTE: import.meta.env.VITE_FENWAY_API_KEY || '',
  // Add other API keys as needed
};

/**
 * OAuth endpoints and credentials for sources requiring OAuth authentication
 */
export const AUTH_ENDPOINTS = {
  THE_19TH_ARCHIVE: {
    tokenUrl: import.meta.env.VITE_19TH_TOKEN_URL || '',
    clientId: import.meta.env.VITE_19TH_CLIENT_ID || '',
    clientSecret: import.meta.env.VITE_19TH_CLIENT_SECRET || '',
    prefix: 'Bearer ',
    headerName: 'Authorization',
  },
  // Add other OAuth configs as needed
};

/**
 * Helper function to get API key for a specific source
 */
export const getApiKey = (source: string): string | undefined => {
  return API_KEYS[source as keyof typeof API_KEYS];
};

/**
 * Helper function to get OAuth configuration for a specific source
 */
export const getOAuthConfig = (source: string): Record<string, string | undefined> | undefined => {
  return AUTH_ENDPOINTS[source as keyof typeof AUTH_ENDPOINTS];
};
