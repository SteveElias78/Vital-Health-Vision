
import { OfflineStorageManager } from '@/data/caching/OfflineStorageManager';
import { DataResponse } from '@/utils/types';
import { HybridHealthDataConnector } from '@/data/HybridHealthDataConnector';

/**
 * Handles resilient data fetching with offline fallback
 */
export class ResilientDataFetcher {
  private offlineStorage: OfflineStorageManager;
  private hybridConnector: HybridHealthDataConnector;
  
  constructor(hybridConnector: HybridHealthDataConnector) {
    this.hybridConnector = hybridConnector;
    this.offlineStorage = new OfflineStorageManager();
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
      const result = await this.hybridConnector.getHealthData(category, options);
      
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
}
