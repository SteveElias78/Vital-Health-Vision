import { HybridHealthDataConnector } from '@/data/HybridHealthDataConnector';
import { DataResponse } from '@/utils/types';
import { SourceHealthChecker } from './health-check/SourceHealthChecker';
import { ResilientDataFetcher } from './resilience/ResilientDataFetcher';
import { SourceSwitcher } from './switching/SourceSwitcher';
import { SourceHealthCheck, SourceHealthResults } from './types';
import { MultiSourceDataConnector } from '../connectors/MultiSourceDataConnector';
import { DataValidationUtils, ValidationResults } from '../utils/DataValidationUtils';
import { COMPROMISED_CATEGORIES } from '../../config/dataSourceConfig';

/**
 * Manages integration with multiple data sources and handles
 * source switching, data reconciliation, and error recovery
 */
export class DataSourceIntegrationManager {
  private dataConnector: HybridHealthDataConnector;
  private healthChecker: SourceHealthChecker;
  private sourceSwitcher: SourceSwitcher;
  private multiSourceConnector: MultiSourceDataConnector;
  
  constructor(dataConnector: HybridHealthDataConnector) {
    this.dataConnector = dataConnector;
    this.healthChecker = new SourceHealthChecker(dataConnector);
    this.sourceSwitcher = new SourceSwitcher(dataConnector);
    this.multiSourceConnector = new MultiSourceDataConnector();
  }
  
  /**
   * Check health of all data sources
   */
  async checkAllSourcesHealth(): Promise<SourceHealthResults> {
    const sources = this.dataConnector.getSourcesInfo();
    return this.healthChecker.checkAllSourcesHealth(sources);
  }
  
  /**
   * Check health of a specific source
   */
  async checkSourceHealth(sourceId: string): Promise<SourceHealthCheck> {
    return this.healthChecker.checkSourceHealth(sourceId);
  }
  
  /**
   * Get health data with resilience
   * This adds offline fallback capability to the regular connector
   */
  async getHealthDataResilient<T = any>(
    category: string, 
    options: Record<string, any> = {}
  ): Promise<DataResponse<T>> {
    return this.dataConnector.getHealthDataResilient<T>(category, options);
  }
  
  /**
   * Get health data with auto-switching if needed
   */
  public async getHealthDataWithAutoSwitch(category: string, params?: Record<string, any>): Promise<DataResponse> {
    // Check if this is a potentially compromised category
    const isCompromisedCategory = COMPROMISED_CATEGORIES.some(
      compromisedCategory => category.includes(compromisedCategory)
    );
    
    try {
      // For compromised categories, try the alternative multi-source connector first
      if (isCompromisedCategory) {
        try {
          console.log(`Using alternative sources for compromised category: ${category}`);
          const result = await this.multiSourceConnector.getHealthData(category, params || {});
          
          // Add validation information
          const validationResults: ValidationResults = {
            discrepancies: result.metadata.validation?.discrepancies || [],
            sourcesCompared: result.metadata.validation?.sourcesCompared || 0,
            compromisedSources: COMPROMISED_CATEGORIES,
          };
          
          return {
            data: result.data,
            metadata: {
              ...result.metadata,
              validation: validationResults,
              integrityVerified: true
            }
          };
        } catch (err) {
          console.warn(`Failed to get data from alternative sources for ${category}, falling back to primary sources`);
          // Fall back to normal connector
        }
      }
      
      // Try to get data from primary source
      const result = await this.dataConnector.getHealthData(category, params);
      
      // Validate the data
      const validationResult = await DataValidationUtils.deepValidateData(category, result.data);
      
      // If data passes validation
      if (validationResult && validationResult.valid) {
        return {
          ...result,
          metadata: {
            ...result.metadata,
            validation: {
              discrepancies: [],
              sourcesCompared: 1,
              compromisedSources: COMPROMISED_CATEGORIES,
              deepValidation: validationResult
            },
            integrityVerified: true
          }
        };
      }
      
      // If validation fails, try to switch source
      console.warn(`Data validation failed for ${category}, attempting source switch`);
      const switchResult = await this.sourceSwitcher.switchToAlternativeSource(category, params);
      
      return {
        ...switchResult,
        metadata: {
          ...switchResult.metadata,
          validation: {
            discrepancies: [],
            sourcesCompared: 2,
            compromisedSources: COMPROMISED_CATEGORIES,
            sourceSwitch: {
              from: result.metadata.source,
              to: switchResult.metadata.source,
              reason: 'data_validation_failed'
            }
          }
        }
      };
    } catch (error) {
      // If all else fails, try the multi-source connector as a last resort
      if (!isCompromisedCategory) {
        try {
          console.log(`Trying multi-source connector as last resort for ${category}`);
          const lastResortResult = await this.multiSourceConnector.getHealthData(category, params || {});
          
          return {
            ...lastResortResult,
            metadata: {
              ...lastResortResult.metadata,
              validation: {
                discrepancies: lastResortResult.metadata.validation?.discrepancies || [],
                sourcesCompared: lastResortResult.metadata.validation?.sourcesCompared || 0,
                compromisedSources: COMPROMISED_CATEGORIES,
                sourceSwitch: {
                  from: 'primary_sources',
                  to: 'alternative_sources',
                  reason: 'primary_source_failure'
                }
              }
            }
          };
        } catch (multiSourceError) {
          console.error('All data source options exhausted:', multiSourceError);
        }
      }
      
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
    return this.sourceSwitcher.getHealthDataWithAutoSwitch<T>(category, options);
  }
}
