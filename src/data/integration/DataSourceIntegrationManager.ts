
import { HybridHealthDataConnector } from '@/data/HybridHealthDataConnector';
import { OfflineStorageManager } from '@/data/caching/OfflineStorageManager';
import { DataResponse } from '@/utils/types';

export interface SourceHealthCheck {
  sourceId: string;
  status: 'healthy' | 'unhealthy';
  error?: string;
  timestamp: number;
}

export interface SourceHealthResults {
  [key: string]: SourceHealthCheck;
}

/**
 * Manages integration with multiple data sources and handles
 * source switching, data reconciliation, and error recovery
 */
export class DataSourceIntegrationManager {
  private hybridConnector: HybridHealthDataConnector;
  private offlineStorage: OfflineStorageManager;
  private cachedStatus: Record<string, any>;
  private sourceHealthChecks: Record<string, SourceHealthCheck>;
  
  constructor(hybridConnector: HybridHealthDataConnector) {
    this.hybridConnector = hybridConnector;
    this.offlineStorage = new OfflineStorageManager();
    this.cachedStatus = {};
    this.sourceHealthChecks = {};
  }
  
  /**
   * Check health of all data sources
   */
  async checkAllSourcesHealth(): Promise<SourceHealthResults> {
    const sources = this.hybridConnector.getSourcesInfo();
    const results: SourceHealthResults = {};
    
    // Check government sources
    for (const source of sources.government) {
      results[source.id] = await this.checkSourceHealth(source.id);
    }
    
    // Check alternative sources
    for (const source of sources.alternative) {
      results[source.id] = await this.checkSourceHealth(source.id);
    }
    
    return results;
  }
  
  /**
   * Check health of a specific source
   */
  async checkSourceHealth(sourceId: string): Promise<SourceHealthCheck> {
    // If we already have a recent check, return it
    if (this.sourceHealthChecks[sourceId]) {
      const check = this.sourceHealthChecks[sourceId];
      
      // If check is less than 1 hour old, use cached result
      if (Date.now() - check.timestamp < 60 * 60 * 1000) {
        return check;
      }
    }
    
    try {
      // Try to fetch a small amount of test data
      // In a real implementation, we'd make an actual API call here
      // For now, just simulate with a simple check
      const result = await this.testSourceConnectivity(sourceId);
      
      // Store health check result
      const healthCheck: SourceHealthCheck = {
        sourceId,
        status: result ? 'healthy' : 'unhealthy',
        timestamp: Date.now()
      };
      
      this.sourceHealthChecks[sourceId] = healthCheck;
      
      return healthCheck;
    } catch (error: any) {
      // Source is unhealthy
      const healthCheck: SourceHealthCheck = {
        sourceId,
        status: 'unhealthy',
        error: error.message,
        timestamp: Date.now()
      };
      
      this.sourceHealthChecks[sourceId] = healthCheck;
      
      return healthCheck;
    }
  }
  
  /**
   * Helper method to test source connectivity
   * In a real implementation, this would make an actual API call
   */
  private async testSourceConnectivity(sourceId: string): Promise<boolean> {
    // Simulate connectivity check - this would be replaced with actual implementation
    return Promise.resolve(Math.random() > 0.2); // 80% success rate for simulation
  }
  
  /**
   * Get health data with resilience
   * This adds offline fallback capability to the regular connector
   */
  async getHealthDataResilient<T = any>(
    category: string, 
    options: Record<string, any> = {}
  ): Promise<DataResponse<T>> {
    try {
      // Try to get data from the connector
      const result = await this.hybridConnector.getHealthData<T>(category, options);
      
      // Store for offline use
      await this.offlineStorage.storeData(category, result.data, result.metadata);
      
      return result;
    } catch (error) {
      console.error(`Failed to fetch ${category} data online:`, error);
      
      // Try to get from offline storage
      const offlineData = await this.offlineStorage.retrieveData(category, {
        ignoreAge: true  // In a real outage, we'll use old data if needed
      });
      
      if (offlineData) {
        console.log(`Using offline data for ${category}`);
        
        // Extract the existing metadata to preserve required fields
        const originalMetadata = offlineData.metadata || {};
        
        // Create proper metadata that preserves all required fields from the original
        // while adding offline indicators
        const metadata = {
          ...originalMetadata,
          offline: true,
          originalFetchedAt: originalMetadata.fetchedAt || originalMetadata.timestamp,
          fetchedAt: new Date().toISOString(),
          // Ensure required fields are present
          source: originalMetadata.source || 'offline-storage',
          endpoint: originalMetadata.endpoint || 'local-storage',
          timestamp: new Date().toISOString(),
          reliability: originalMetadata.reliability || 0.7, // Lower reliability for offline data
          cached: true
        };
        
        return {
          data: offlineData.data as T,
          metadata
        };
      }
      
      // If no offline data, re-throw the error
      throw error;
    }
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
        return this.getHealthDataResilient<T>(category, options);
      }
    }
    
    // For non-compromised categories, use the resilient method
    return this.getHealthDataResilient<T>(category, options);
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
