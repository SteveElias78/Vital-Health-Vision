
import { TokenManager } from './TokenManager';
import { AUTH_ENDPOINTS } from '../../config/apiAuth';

/**
 * Manages OAuth-based authentication flows
 */
export class OAuthManager {
  private tokenManager: TokenManager;
  
  constructor(tokenManager: TokenManager) {
    this.tokenManager = tokenManager;
  }
  
  /**
   * Get OAuth token for a specific source
   */
  public async getOAuthToken(source: string): Promise<string | null> {
    // First check if we have a cached token
    const cachedToken = this.tokenManager.getToken(source);
    if (cachedToken && !this.tokenManager.isTokenExpired(source)) {
      return cachedToken;
    }
    
    // If no cached token or it's expired, try to get a new one
    try {
      const authConfig = AUTH_ENDPOINTS[source as keyof typeof AUTH_ENDPOINTS];
      
      if (!authConfig || !authConfig.clientId || !authConfig.clientSecret || !authConfig.tokenUrl) {
        console.warn(`OAuth configuration missing for ${source}`);
        return null;
      }
      
      // Prepare token request
      const tokenRequest = new URLSearchParams({
        grant_type: authConfig.grantType || 'client_credentials',
        client_id: authConfig.clientId,
        client_secret: authConfig.clientSecret
      });
      
      // Request token
      const response = await fetch(authConfig.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: tokenRequest.toString()
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get OAuth token: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.access_token) {
        throw new Error('No access token in response');
      }
      
      // Save token
      this.tokenManager.setToken(source, data.access_token, data.expires_in);
      
      return data.access_token;
    } catch (error) {
      console.error(`Error getting OAuth token for ${source}:`, error);
      return null;
    }
  }
  
  /**
   * Refresh an expired token
   */
  public async refreshToken(source: string): Promise<string | null> {
    // For simplicity, we just get a new token
    // In a more complete implementation, this would use refresh tokens
    return this.getOAuthToken(source);
  }
}
