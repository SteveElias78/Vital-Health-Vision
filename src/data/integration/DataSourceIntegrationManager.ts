
import { HybridHealthDataConnector } from '@/data/HybridHealthDataConnector';
import { DataResponse } from '@/utils/types';
import { SourceHealthChecker } from './health-check/SourceHealthChecker';
import { ResilientDataFetcher } from './resilience/ResilientDataFetcher';
import { SourceSwitcher } from './switching/SourceSwitcher';
import { SourceHealthCheck, SourceHealthResults } from './types';

/**
 * Manages integration with multiple data sources and handles
 * source switching, data reconciliation, and error recovery
 */
export class DataSourceIntegrationManager {
  private hybridConnector: HybridHealthDataConnector;
  private sourceHealthChecker: SourceHealthChecker;
  private resilientFetcher: ResilientDataFetcher;
  private sourceSwitcher: SourceSwitcher;
  
  constructor(hybridConnector: HybridHealthDataConnector) {
    this.hybridConnector = hybridConnector;
    this.sourceHealthChecker = new SourceHealthChecker();
    this.resilientFetcher = new ResilientDataFetcher(hybridConnector);
    this.sourceSwitcher = new SourceSwitcher(hybridConnector, this.resilientFetcher);
  }
  
  /**
   * Check health of all data sources
   */
  async checkAllSourcesHealth(): Promise<SourceHealthResults> {
    const sources = this.hybridConnector.getSourcesInfo();
    return this.sourceHealthChecker.checkAllSourcesHealth(sources);
  }
  
  /**
   * Check health of a specific source
   */
  async checkSourceHealth(sourceId: string): Promise<SourceHealthCheck> {
    return this.sourceHealthChecker.checkSourceHealth(sourceId);
  }
  
  /**
   * Get health data with resilience
   * This adds offline fallback capability to the regular connector
   */
  async getHealthDataResilient<T = any>(
    category: string, 
    options: Record<string, any> = {}
  ): Promise<DataResponse<T>> {
    return this.resilientFetcher.getHealthDataResilient<T>(category, options);
  }
  
  /**
   * Auto-switch to best available source based on data integrity
   */
  async getHealthDataWithAutoSwitch<T = any>(
    category: string, 
    options: Record<string, any> = {}
  ): Promise<DataResponse<T>> {
    return this.sourceSwitcher.getHealthDataWithAutoSwitch<T>(category, options);
  }
}
