
import { ApiKeyManager } from './ApiKeyManager';
import { ApiKeyValidator } from './ApiKeyValidator';

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
      // Use the validator to check the key
      return await ApiKeyManager.getInstance().validateApiKey(source, key);
    } catch (error) {
      console.error(`API key validation failed for ${source}:`, error);
      return false;
    }
  }
};
