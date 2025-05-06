
import { BaseDataConnector } from '../../utils/BaseDataConnector';
import { ALTERNATIVE_SOURCES } from '../../config/dataSourceConfig';
import { DataResponse } from '../../utils/types';

export class InternetArchiveConnector extends BaseDataConnector {
  constructor() {
    super('INTERNET_ARCHIVE_CDC', {
      ...ALTERNATIVE_SOURCES.INTERNET_ARCHIVE_CDC,
      authType: 'apiKey' // Added explicit type for TypeScript
    });
  }
  
  /**
   * Fetches archived CDC data from the Internet Archive
   */
  async fetchArchivedData<T = any>(datasetName: string, params: Record<string, any> = {}): Promise<DataResponse<T>> {
    // Get the appropriate endpoint
    const endpoint = this.getEndpointForDataset(datasetName);
    
    if (!endpoint) {
      throw new Error(`Unknown dataset: ${datasetName}`);
    }
    
    try {
      // Make the request
      const result = await this.makeRequest<T>(endpoint, params);
      
      // Add specific metadata
      result.metadata = {
        ...result.metadata,
        datasetName,
        archiveDate: ALTERNATIVE_SOURCES.INTERNET_ARCHIVE_CDC.dataDate,
        dataType: 'archived'
      };
      
      return result;
    } catch (error) {
      console.error(`Error fetching archived data for ${datasetName}:`, error);
      throw error;
    }
  }
  
  /**
   * Maps dataset names to endpoints
   */
  getEndpointForDataset(datasetName: string): string | undefined {
    const mapping: Record<string, string | undefined> = {
      'lgbtq-health': ALTERNATIVE_SOURCES.INTERNET_ARCHIVE_CDC.endpoints.lgbtqHealth,
      'youth-risk': ALTERNATIVE_SOURCES.INTERNET_ARCHIVE_CDC.endpoints.youthRisk,
      'minority-health': ALTERNATIVE_SOURCES.INTERNET_ARCHIVE_CDC.endpoints.minorityHealth,
      // Add more mappings as needed
    };
    
    return mapping[datasetName];
  }
  
  /**
   * Fetches LGBTQ health data from archive
   */
  async fetchLgbtqHealthData<T = any>(params: Record<string, any> = {}): Promise<DataResponse<T>> {
    return this.fetchArchivedData<T>('lgbtq-health', params);
  }
  
  /**
   * Fetches minority health data from archive
   */
  async fetchMinorityHealthData<T = any>(params: Record<string, any> = {}): Promise<DataResponse<T>> {
    return this.fetchArchivedData<T>('minority-health', params);
  }
}
