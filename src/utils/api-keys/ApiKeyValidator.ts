
import { ApiKeyValidationResult } from './types';

/**
 * Validates API keys against their respective services
 */
export class ApiKeyValidator {
  /**
   * Validate API key with a simple request
   */
  public static async validateApiKey(source: string, key: string): Promise<ApiKeyValidationResult> {
    try {
      // Choose API endpoint based on source
      let url = '';
      let headers: Record<string, string> = {};
      
      switch (source) {
        case 'CDC_DATA_GOV':
          url = 'https://data.cdc.gov/api/views/metadata';
          headers = { 'X-App-Token': key };
          break;
        case 'WHO_GHO':
          url = 'https://ghoapi.azureedge.net/api/Dimension';
          headers = { 'X-API-Key': key };
          break;
        case 'FENWAY_INSTITUTE':
          url = 'https://fenwayhealth.org/api/research-data';
          headers = { 'Authorization': `Bearer ${key}` };
          break;
        // Add more validation endpoints as needed
        default:
          return { isValid: false, error: `Unknown source: ${source}` };
      }
      
      if (!url) {
        return { isValid: false, error: 'No validation endpoint available' };
      }
      
      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        return { 
          isValid: false, 
          error: `API returned status ${response.status}: ${response.statusText}` 
        };
      }
      
      return { isValid: true };
    } catch (error) {
      return { 
        isValid: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}
