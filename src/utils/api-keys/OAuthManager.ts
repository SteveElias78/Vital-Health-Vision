
import { AuthHeader, OAuthConfig } from './types';
import { TokenManager } from './TokenManager';

/**
 * Manages OAuth authentication flows
 */
export class OAuthManager {
  private tokenManager: TokenManager;
  
  constructor(tokenManager: TokenManager) {
    this.tokenManager = tokenManager;
  }
  
  /**
   * Get OAuth token and create auth header
   */
  public async getAuthHeader(source: string, config: OAuthConfig): Promise<AuthHeader> {
    // Check for cached token first
    const cachedToken = this.tokenManager.getCachedToken(source);
    
    if (cachedToken) {
      // If we have a valid cached token, use it
      return this.formatAuthHeader(cachedToken, config.headerName || 'Authorization', config.prefix || 'Bearer');
    }
    
    // No valid token, get a new one
    try {
      const token = await this.getToken(config);
      
      // Cache the new token if we got one
      if (token?.access_token && token?.expires_in) {
        this.tokenManager.cacheToken(source, token.access_token, token.expires_in);
        return this.formatAuthHeader(token.access_token, config.headerName || 'Authorization', config.prefix || 'Bearer');
      }
      
      throw new Error('Failed to get valid OAuth token');
    } catch (error) {
      console.error('OAuth token request failed:', error);
      throw new Error(`Failed to authenticate with ${source}`);
    }
  }
  
  /**
   * Format authentication header properly
   */
  private formatAuthHeader(token: string, headerName: string, prefix: string): AuthHeader {
    const header: AuthHeader = {};
    
    // Some APIs use different header formats
    if (prefix) {
      header[headerName] = `${prefix} ${token}`;
    } else {
      header[headerName] = token;
    }
    
    return header;
  }
  
  /**
   * Request an OAuth token using client credentials flow
   */
  private async getToken(config: OAuthConfig): Promise<any> {
    const { tokenUrl, clientId, clientSecret } = config;
    
    if (!tokenUrl || !clientId) {
      throw new Error('Missing required OAuth configuration');
    }
    
    // Create body parameters based on grant type
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', clientId);
    
    if (clientSecret) {
      params.append('client_secret', clientSecret);
    }
    
    // Make the token request
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OAuth token request failed: ${response.status} ${errorText}`);
    }
    
    return response.json();
  }
}
