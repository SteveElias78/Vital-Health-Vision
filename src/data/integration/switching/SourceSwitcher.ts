
import { DataResponse } from '@/utils/types';
import { HybridHealthDataConnector } from '@/data/HybridHealthDataConnector';
import { ResilientDataFetcher } from '../resilience/ResilientDataFetcher';

/**
 * Handles automatic switching between data sources
 */
export class SourceSwitcher {
  private hybridConnector: HybridHealthDataConnector;
  private resilientFetcher: ResilientDataFetcher;
  
  constructor(hybridConnector: HybridHealthDataConnector, resilientFetcher: ResilientDataFetcher) {
    this.hybridConnector = hybridConnector;
    this.resilientFetcher = resilientFetcher;
  }
  
  /**
   * Auto-switch to best available source based on data integrity
   */
  async getHealthDataWithAutoSwitch<T = any>(
    category: string, 
    options: Record<string, any> = {}
  ): Promise<DataResponse<T>> {
    // Check if category might be compromised
    const isCompromisedCategory = this.isCategoryPotentiallyCompromised(category);
    
    // For potentially compromised categories, use alternative sources directly
    if (isCompromisedCategory) {
      console.log(`Auto-switching to alternative sources for ${category}`);
      
      try {
        // Get data with alternative sources prioritized
        const result = await this.hybridConnector.getHealthData<T>(category, {
          ...options,
          preferAlternativeSources: true
        });
        
        return result;
      } catch (error) {
        // Fall back to resilient method if direct approach fails
        return this.resilientFetcher.getHealthDataResilient<T>(category, options);
      }
    }
    
    // For non-compromised categories, use the resilient method
    return this.resilientFetcher.getHealthDataResilient<T>(category, options);
  }
  
  /**
   * Helper method to check if a category is potentially compromised
   */
  private isCategoryPotentiallyCompromised(category: string): boolean {
    // Delegate to the hybrid connector if it has this method
    if (typeof this.hybridConnector.isCategoryPotentiallyCompromised === 'function') {
      return this.hybridConnector.isCategoryPotentiallyCompromised(category);
    }
    
    // Fallback implementation if the connector doesn't have this method
    // For example, check against a list of known compromised categories
    const compromisedCategories = ['obesity', 'mental-health', 'lgbtq-health'];
    return compromisedCategories.includes(category);
  }
}
