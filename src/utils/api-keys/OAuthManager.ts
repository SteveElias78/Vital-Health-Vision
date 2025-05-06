
import { OAuthConfig, TokenCacheEntry } from './types';
import { TokenManager } from './TokenManager';
import { AUTH_ENDPOINTS } from '../../config/apiAuth';

/**
 * Manages OAuth authentication flows
 */
export class OAuthManager {
  private tokenManager: TokenManager;
  
  constructor(tokenManager: TokenManager) {
    this.tokenManager = tokenManager;
  }
  
  /**
   * Get OAuth token for a source
   */
  public async getOAuthToken(source: string): Promise<string | null> {
    // Check cache first
    const cachedToken = this.tokenManager.getCachedToken(source);
    if (cachedToken) {
      return cachedToken;
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
      
      // Cache token
      const expiresIn = data.expires_in || 3600;
      this.tokenManager.cacheToken(source, data.access_token, expiresIn);
      
      return data.access_token;
    } catch (error) {
      console.error(`Error getting OAuth token for ${source}:`, error);
      return null;
    }
  }
  
  /**
   * Build OAuth authorization header
   */
  public getOAuthHeader(source: string, token: string): Record<string, string> {
    const authConfig = AUTH_ENDPOINTS[source as keyof typeof AUTH_ENDPOINTS];
    
    if (!authConfig) {
      return {};
    }
    
    const headerName = authConfig.headerName || 'Authorization';
    const prefix = authConfig.prefix || '';
    
    return { [headerName]: `${prefix}${token}` };
  }
}
