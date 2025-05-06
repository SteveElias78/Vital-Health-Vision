
/**
 * Type definitions for API key management
 */

export interface TokenCacheEntry {
  token: string;
  expiry: number;
}

export interface AuthHeader {
  [key: string]: string;
}

export interface OAuthConfig {
  tokenUrl: string;
  clientId: string;
  clientSecret: string;
  prefix?: string;
  headerName?: string;
}

export interface ApiKeyValidationResult {
  isValid: boolean;
  error?: string;
}
