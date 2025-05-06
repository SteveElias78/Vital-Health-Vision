
import { AUTH_ENDPOINTS, API_KEYS } from '../../config/apiAuth';
import { AuthHeader } from './types';
import { TokenManager } from './TokenManager';
import { OAuthManager } from './OAuthManager';
import { KeyStorage } from './KeyStorage';
import { ApiKeyValidator } from './ApiKeyValidator';

/**
 * Main API key management class that coordinates all key operations
 */
export class ApiKeyManager {
  private static instance: ApiKeyManager;
  private keyStorage: KeyStorage;
  private tokenManager: TokenManager;
  private oauthManager: OAuthManager;
  
  private constructor() {
    this.keyStorage = new KeyStorage();
    this.tokenManager = new TokenManager();
    this.oauthManager = new OAuthManager(this.tokenManager);
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
    // Load API keys from config if not already in storage
    Object.entries(API_KEYS).forEach(([source, key]) => {
      if (key && !this.keyStorage.hasKey(source)) {
        this.keyStorage.setKey(source, key);
      }
    });
  }
  
  /**
   * Check if a key exists for a source
   */
  public hasKey(source: string): boolean {
    return this.keyStorage.hasKey(source);
  }
  
  /**
   * Get API key for a source
   */
  public getKey(source: string): string | undefined {
    return this.keyStorage.getKey(source);
  }
  
  /**
   * Set API key for a source
   */
  public setKey(source: string, key: string): void {
    this.keyStorage.setKey(source, key);
  }
  
  /**
   * Get OAuth token for a source
   */
  public async getOAuthToken(source: string): Promise<string | null> {
    return this.oauthManager.getOAuthToken(source);
  }
  
  /**
   * Build authorization header for a source
   */
  public async getAuthHeader(source: string): Promise<AuthHeader> {
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
  
  /**
   * Validate an API key
   */
  public async validateApiKey(source: string, key: string): Promise<boolean> {
    const result = await ApiKeyValidator.validateApiKey(source, key);
    return result.isValid;
  }
}
