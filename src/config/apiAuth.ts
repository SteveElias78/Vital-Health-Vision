
/**
 * API authentication configuration for health data sources
 */

import { AUTH_CONFIG } from './dataSourceConfig';

/**
 * API keys for various health data sources
 * Note: In a real application, these would be environment variables
 */
export const API_KEYS = {
  CDC_DATA_GOV: AUTH_CONFIG.CDC_DATA_GOV.apiKey,
  WHO_GHO: AUTH_CONFIG.WHO_GHO.apiKey,
  FENWAY_INSTITUTE: AUTH_CONFIG.FENWAY_INSTITUTE.apiKey,
  // Add other API keys as needed
};

/**
 * OAuth endpoints and credentials for sources requiring OAuth authentication
 */
export const AUTH_ENDPOINTS = {
  THE_19TH_ARCHIVE: {
    tokenUrl: AUTH_CONFIG.THE_19TH_ARCHIVE.tokenUrl,
    clientId: AUTH_CONFIG.THE_19TH_ARCHIVE.clientId,
    clientSecret: AUTH_CONFIG.THE_19TH_ARCHIVE.clientSecret,
    prefix: AUTH_CONFIG.THE_19TH_ARCHIVE.prefix || 'Bearer ',
    headerName: AUTH_CONFIG.THE_19TH_ARCHIVE.headerName || 'Authorization',
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
