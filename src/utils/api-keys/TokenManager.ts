
import { TokenCacheEntry } from './types';

/**
 * Manages OAuth tokens and caching
 */
export class TokenManager {
  private tokenCache: Map<string, TokenCacheEntry>;
  
  constructor() {
    this.tokenCache = new Map();
  }
  
  /**
   * Get cached token if still valid
   */
  public getCachedToken(source: string): string | null {
    const cachedToken = this.tokenCache.get(source);
    
    if (cachedToken && cachedToken.expiry > Date.now()) {
      return cachedToken.token;
    }
    
    return null;
  }
  
  /**
   * Cache token with expiration
   */
  public cacheToken(source: string, token: string, expiresIn: number): void {
    this.tokenCache.set(source, {
      token,
      // Expire 1 minute early to avoid edge cases
      expiry: Date.now() + (expiresIn * 1000) - 60000
    });
  }
  
  /**
   * Clear cached token for a source
   */
  public clearToken(source: string): void {
    this.tokenCache.delete(source);
  }
  
  /**
   * Clear all cached tokens
   */
  public clearAllTokens(): void {
    this.tokenCache.clear();
  }
}
