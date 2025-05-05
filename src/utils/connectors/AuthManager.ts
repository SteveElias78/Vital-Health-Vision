
import axios from 'axios';
import { AUTH_CONFIG } from '../../config/dataSourceConfig';
import { AuthConfig } from '../types';

export class AuthManager {
  private sourceId: string;
  private requiresAuth: boolean;
  private authType?: 'apiKey' | 'oauth';

  constructor(sourceId: string, requiresAuth: boolean, authType?: 'apiKey' | 'oauth') {
    this.sourceId = sourceId;
    this.requiresAuth = requiresAuth;
    this.authType = authType;
  }

  /**
   * Gets an authentication token for this data source
   */
  public async getAuthToken(): Promise<string | null> {
    if (!this.requiresAuth) {
      return null;
    }
    
    const authConfig = AUTH_CONFIG[this.sourceId];
    if (!authConfig) {
      throw new Error(`Auth configuration not found for source: ${this.sourceId}`);
    }
    
    if (this.authType === 'apiKey') {
      return authConfig.apiKey || null;
    } else if (this.authType === 'oauth') {
      try {
        const response = await axios.post(authConfig.tokenUrl as string, {
          client_id: authConfig.clientId,
          client_secret: authConfig.clientSecret,
          grant_type: authConfig.grantType || 'client_credentials'
        });
        
        return response.data.access_token;
      } catch (error) {
        console.error(`OAuth token acquisition failed for ${this.sourceId}:`, error);
        throw new Error(`Authentication failed for ${this.sourceId}`);
      }
    }
    
    return null;
  }

  /**
   * Sets authentication header for a request
   */
  public async setAuthHeader(headers: Record<string, string> = {}): Promise<Record<string, string>> {
    if (!this.requiresAuth) {
      return headers;
    }
    
    const authConfig = AUTH_CONFIG[this.sourceId];
    if (!authConfig) {
      return headers;
    }
    
    const token = await this.getAuthToken();
    if (!token) {
      return headers;
    }
    
    const headerName = authConfig.headerName || 'Authorization';
    const prefix = authConfig.prefix || '';
    
    return {
      ...headers,
      [headerName]: `${prefix}${token}`
    };
  }
}
