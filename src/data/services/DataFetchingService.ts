
import { ConnectorFactory } from '../ConnectorFactory';
import { DataResponse } from '../../utils/types';
import { SourceManager } from '../utils/SourceManager';

/**
 * Service for fetching data from various sources
 */
export class DataFetchingService {
  private sourceManager: SourceManager;
  private connectorFactory: ConnectorFactory;
  
  constructor(sourceManager: SourceManager) {
    this.sourceManager = sourceManager;
    this.connectorFactory = ConnectorFactory.getInstance();
  }
  
  /**
   * Fetch data from a specific source
   */
  public async fetchFromSource<T = any>(
    source: string, 
    method: string, 
    params: Record<string, any>
  ): Promise<DataResponse<T>> {
    try {
      const connector = this.connectorFactory.getConnector(source);
      
      if (!(method in connector)) {
        throw new Error(`Method ${method} not found on ${source} connector`);
      }
      
      // Need to use type assertion here because TypeScript can't infer method types dynamically
      const result = await (connector as any)[method](params) as DataResponse<T>;
      
      // Update source status
      this.sourceManager.updateSourceStatus(source, true, result.metadata?.integrityVerified);
      
      return result;
    } catch (error) {
      // Update source status
      this.sourceManager.updateSourceStatus(source, false);
      
      console.error(`Error fetching from ${source}.${method}:`, error);
      throw error;
    }
  }
}
