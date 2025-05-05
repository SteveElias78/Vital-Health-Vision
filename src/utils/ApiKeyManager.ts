
import { API_KEYS, AUTH_ENDPOINTS } from '../config/apiAuth';

/**
 * Manages API keys and authentication for health data sources
 */
export class ApiKeyManager {
  private static instance: ApiKeyManager;
  private keys: Map<string, string>;
  private tokenCache: Map<string, { token: string; expiry: number }>;
  
  private constructor() {
    this.keys = new Map();
    this.tokenCache = new Map();
    this.initializeKeys();
  }
  
  /**
   * Get singleton instance
   */
  public static getInstance(): ApiKeyManager {
    if (!ApiKeyManager.instance) {
      ApiKeyManager.instance = new ApiKeyManager();
    }
    return ApiKeyManager.instance;
  }
  
  /**
   * Initialize API keys from config
   */
  private initializeKeys(): void {
    // Load API keys from config
    Object.entries(API_KEYS).forEach(([source, key]) => {
      if (key) {
        this.keys.set(source, key);
      }
    });
  }
  
  /**
   * Check if a key exists for a source
   */
  public hasKey(source: string): boolean {
    return this.keys.has(source);
  }
  
  /**
   * Get API key for a source
   */
  public getKey(source: string): string | undefined {
    return this.keys.get(source);
  }
  
  /**
   * Set API key for a source (e.g., if user provides it)
   */
  public setKey(source: string, key: string): void {
    this.keys.set(source, key);
  }
  
  /**
   * Get OAuth token for a source
   */
  public async getOAuthToken(source: string): Promise<string | null> {
    const cachedToken = this.tokenCache.get(source);
    
    // Return cached token if still valid
    if (cachedToken && cachedToken.expiry > Date.now()) {
      return cachedToken.token;
    }
    
    // Get OAuth config
    const oauthConfig = AUTH_ENDPOINTS[source as keyof typeof AUTH_ENDPOINTS];
    if (!oauthConfig) {
      console.error(`No OAuth config for source: ${source}`);
      return null;
    }
    
    try {
      // Request new token
      const response = await fetch(oauthConfig.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          client_id: oauthConfig.clientId,
          client_secret: oauthConfig.clientSecret,
          grant_type: 'client_credentials'
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get token: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Cache token with expiration
      const expiresIn = data.expires_in || 3600;
      this.tokenCache.set(source, {
        token: data.access_token,
        expiry: Date.now() + (expiresIn * 1000) - 60000 // Expire 1 minute early
      });
      
      return data.access_token;
    } catch (error) {
      console.error(`Error getting OAuth token for ${source}:`, error);
      return null;
    }
  }
  
  /**
   * Build authorization header for a source
   */
  public async getAuthHeader(source: string): Promise<Record<string, string>> {
    const authConfig = AUTH_ENDPOINTS[source as keyof typeof AUTH_ENDPOINTS];
    
    if (!authConfig) {
      // Try to use API key
      const apiKey = this.getKey(source);
      if (apiKey) {
        return { 'X-API-Key': apiKey };
      }
      return {};
    }
    
    if (authConfig.clientId && authConfig.clientSecret) {
      // OAuth flow
      const token = await this.getOAuthToken(source);
      if (token) {
        const prefix = authConfig.prefix || '';
        return { 'Authorization': `${prefix}${token}` };
      }
    } else if (this.hasKey(source)) {
      // API key flow
      const apiKey = this.getKey(source);
      const headerName = authConfig.headerName || 'X-API-Key';
      const prefix = authConfig.prefix || '';
      
      if (apiKey) {
        return { [headerName]: `${prefix}${apiKey}` };
      }
    }
    
    return {};
  }
}

/**
 * Utility functions for obtaining and managing API access
 */
export const ApiKeyUtils = {
  /**
   * Check if we have access to a specific data source
   */
  hasAccessToSource(source: string): boolean {
    return ApiKeyManager.getInstance().hasKey(source);
  },
  
  /**
   * Get available data sources we have keys for
   */
  getAvailableSources(): string[] {
    const availableSources: string[] = [];
    
    // Check common sources
    ['CDC_DATA_GOV', 'WHO_GHO', 'FENWAY_INSTITUTE', 'THE_19TH_ARCHIVE'].forEach(source => {
      if (ApiKeyManager.getInstance().hasKey(source)) {
        availableSources.push(source);
      }
    });
    
    return availableSources;
  },
  
  /**
   * Attempt to validate an API key
   */
  async validateApiKey(source: string, key: string): Promise<boolean> {
    // Store key temporarily
    ApiKeyManager.getInstance().setKey(source, key);
    
    try {
      // Try a simple request to validate
      const headers = await ApiKeyManager.getInstance().getAuthHeader(source);
      
      // Choose API endpoint based on source
      let url = '';
      switch (source) {
        case 'CDC_DATA_GOV':
          url = 'https://data.cdc.gov/api/views/metadata';
          break;
        case 'WHO_GHO':
          url = 'https://ghoapi.azureedge.net/api/Dimension';
          break;
        // Add more sources as needed
        default:
          url = '';
      }
      
      if (!url) {
        return false;
      }
      
      const response = await fetch(url, { headers });
      return response.ok;
    } catch (error) {
      console.error(`API key validation failed for ${source}:`, error);
      return false;
    }
  }
};
