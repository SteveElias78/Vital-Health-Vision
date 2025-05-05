
import { createApiClient } from '../../utils/apiClientFactory';
import { DataResponse } from '../../utils/types';
import { ApiKeyManager } from '../../utils/ApiKeyManager';

export class ArchiveConnector {
  private internetArchiveClient: ReturnType<typeof createApiClient>;
  private the19thClient: ReturnType<typeof createApiClient> | null;
  
  constructor() {
    // Use a basic client initially, we'll get auth token when needed
    this.internetArchiveClient = createApiClient('https://archive.org/download', {
      cacheDuration: 30 * 24 * 60 * 60 * 1000 // 30 day cache - archive data doesn't change
    });
    
    this.the19thClient = null; // Will be initialized with auth
  }
  
  /**
   * Initialize 19th Archive client with authentication
   */
  async initThe19thClient(): Promise<void> {
    if (this.the19thClient) return;
    
    try {
      // Get OAuth token using our new ApiKeyManager
      const token = await ApiKeyManager.getInstance().getOAuthToken('THE_19TH_ARCHIVE');
      
      if (!token) {
        throw new Error('Failed to obtain authentication token for The 19th Archive');
      }
      
      // Create authenticated client
      this.the19thClient = createApiClient('https://19tharchive.org/api', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        cacheDuration: 7 * 24 * 60 * 60 * 1000 // 7 day cache
      });
    } catch (error: any) {
      console.error('Error initializing The 19th client:', error);
      throw new Error(`The 19th authentication failed: ${error.message}`);
    }
  }
  
  /**
   * Fetch CDC data from Internet Archive
   */
  async fetchArchivedCDCData<T = any>(
    dataset: string, 
    snapshotDate: string = '20250128'
  ): Promise<DataResponse<T>> {
    try {
      const response = await this.internetArchiveClient.get<T>(
        `/20250128-cdc-datasets/${snapshotDate}-${dataset}.json`
      );
      
      return {
        data: response.data,
        metadata: {
          source: 'Internet Archive CDC',
          endpoint: `/20250128-cdc-datasets/${snapshotDate}-${dataset}.json`,
          timestamp: new Date().toISOString(),
          reliability: 0.9,
          cached: false,
          dataset,
          snapshotDate,
          dataType: 'archived'
        }
      };
    } catch (error: any) {
      console.error(`Error fetching archived CDC data ${dataset}:`, error);
      throw new Error(`Archived CDC data fetch failed: ${error.message}`);
    }
  }
  
  /**
   * Fetch data from The 19th Archive
   */
  async fetch19thArchiveData<T = any>(datasetId: string): Promise<DataResponse<T>> {
    // Initialize client if needed
    if (!this.the19thClient) {
      await this.initThe19thClient();
    }
    
    try {
      // We know this.the19thClient is not null at this point
      const response = await this.the19thClient!.get<T>(`/datasets/${datasetId}`);
      
      return {
        data: response.data,
        metadata: {
          source: 'The 19th Archive',
          endpoint: `/datasets/${datasetId}`,
          timestamp: new Date().toISOString(),
          reliability: 0.85,
          cached: false,
          datasetId,
          dataType: 'archived'
        }
      };
    } catch (error: any) {
      console.error(`Error fetching The 19th data ${datasetId}:`, error);
      throw new Error(`The 19th data fetch failed: ${error.message}`);
    }
  }
}
