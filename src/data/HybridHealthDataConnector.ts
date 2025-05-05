import { COMPROMISED_CATEGORIES } from '../config/dataSourceConfig';
import { DataResponse } from '../utils/types';
import { BRFSSConnector } from './connectors/BRFSSConnector';
import { NHANESConnector } from './connectors/NHANESConnector';
import { WHOConnector } from './connectors/WHOConnector';
import { InternetArchiveConnector } from './connectors/InternetArchiveConnector';
import { FenwayInstituteConnector } from './connectors/FenwayInstituteConnector';
import { SourceManager, SourcesInfo } from './utils/SourceManager';
import { DataValidationUtils, ValidationResults } from './utils/DataValidationUtils';
import { DataResultUtils } from './utils/DataResultUtils';
import { DataMappingUtils, SourceMapping } from './utils/DataMappingUtils';

// Types
interface GetHealthDataOptions {
  singleSource?: boolean;
  deepValidation?: boolean;
  [key: string]: any;
}

export class HybridHealthDataConnector {
  private brfssConnector: BRFSSConnector;
  private nhanesConnector: NHANESConnector;
  private whoConnector: WHOConnector;
  private archiveConnector: InternetArchiveConnector;
  private fenwayConnector: FenwayInstituteConnector;
  private sourceManager: SourceManager;
  private validationCache: Map<string, any>;
  
  constructor() {
    // Initialize connectors
    this.brfssConnector = new BRFSSConnector();
    this.nhanesConnector = new NHANESConnector();
    this.whoConnector = new WHOConnector();
    this.archiveConnector = new InternetArchiveConnector();
    this.fenwayConnector = new FenwayInstituteConnector();
    
    // Initialize source manager
    this.sourceManager = new SourceManager();
    
    // Cache for data validation results
    this.validationCache = new Map();
  }
  
  /**
   * Get the appropriate connector for a source
   */
  private getConnectorForSource(source: string): any {
    switch (source) {
      case 'nhanes':
        return this.nhanesConnector;
      case 'brfss':
        return this.brfssConnector;
      case 'who':
        return this.whoConnector;
      case 'archive':
        return this.archiveConnector;
      case 'fenway':
        return this.fenwayConnector;
      default:
        throw new Error(`Unknown source: ${source}`);
    }
  }
  
  /**
   * Fetch data from a specific source
   */
  private async fetchFromSource<T = any>(
    source: string, 
    method: string, 
    params: Record<string, any>
  ): Promise<DataResponse<T>> {
    const connector = this.getConnectorForSource(source);
    
    if (!(method in connector)) {
      throw new Error(`Method ${method} not found on ${source} connector`);
    }
    
    try {
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
  
  /**
   * Get health data for a specific category
   */
  async getHealthData<T = any>(
    category: string, 
    options: GetHealthDataOptions = {}
  ): Promise<DataResponse<T>> {
    // Check if this is a potentially compromised category
    const isCompromisedCategory = DataValidationUtils.isCategoryCompromised(category);
    
    // Get sources for this category
    const { primarySources, secondarySources } = DataMappingUtils.getSourcesForCategory(
      category,
      isCompromisedCategory
    );
    
    const results: Record<string, DataResponse<any>> = {};
    const errors: Array<{ source: string; error: string }> = [];
    
    // Try primary sources first
    for (const source of primarySources) {
      if (this.sourceManager.isSourceAvailable(source.source)) {
        try {
          const sourceParams = {
            ...source.params,
            ...options
          };
          
          const result = await this.fetchFromSource(
            source.source,
            source.method,
            sourceParams
          );
          
          results[source.source] = result;
          
          // If we only need one source and have it, we can stop
          if (options.singleSource && Object.keys(results).length > 0) {
            break;
          }
        } catch (error: any) {
          console.error(`Error fetching from ${source.source}:`, error);
          errors.push({ source: source.source, error: error.message });
        }
      }
    }
    
    // If no primary sources worked, try secondary sources
    if (Object.keys(results).length === 0 && secondarySources && secondarySources.length > 0) {
      for (const source of secondarySources) {
        if (this.sourceManager.isSourceAvailable(source.source)) {
          try {
            const sourceParams = {
              ...source.params,
              ...options
            };
            
            const result = await this.fetchFromSource(
              source.source,
              source.method,
              sourceParams
            );
            
            results[source.source] = result;
            
            // If we got a secondary source, that's enough
            break;
          } catch (error: any) {
            console.error(`Error fetching from secondary ${source.source}:`, error);
            errors.push({ source: source.source, error: error.message });
          }
        }
      }
    }
    
    // If we still have no results, throw an error
    if (Object.keys(results).length === 0) {
      const error: Error & { sourceErrors?: Array<{ source: string; error: string }> } = 
        new Error(`Failed to fetch data for category: ${category}`);
      error.sourceErrors = errors;
      throw error;
    }
    
    // If we only want one source, return the first result
    if (options.singleSource) {
      const firstSource = Object.keys(results)[0];
      return results[firstSource] as DataResponse<T>;
    }
    
    // For potentially compromised categories, check data integrity
    if (isCompromisedCategory && Object.keys(results).length > 1) {
      return await this.validateAndReconcileResults(results, category, options) as DataResponse<T>;
    }
    
    // Otherwise, combine the results
    return DataResultUtils.combineResults(results, category, this.sourceManager) as DataResponse<T>;
  }
  
  /**
   * Validate and reconcile data from multiple sources
   */
  private async validateAndReconcileResults(
    results: Record<string, DataResponse<any>>, 
    category: string,
    options: GetHealthDataOptions = {}
  ): Promise<DataResponse<any>> {
    const sources = Object.keys(results);
    
    // Only proceed if we have multiple sources
    if (sources.length <= 1) {
      return DataResultUtils.combineResults(results, category, this.sourceManager);
    }
    
    const validationResults: ValidationResults = {
      discrepancies: [],
      sourcesCompared: sources.length,
      compromisedSources: []
    };
    
    // Compare each pair of sources
    for (let i = 0; i < sources.length; i++) {
      for (let j = i + 1; j < sources.length; j++) {
        const source1 = sources[i];
        const source2 = sources[j];
        
        const comparisonResult = DataValidationUtils.compareDataSets(
          results[source1].data,
          results[source2].data,
          source1,
          source2
        );
        
        if (comparisonResult.discrepancies.length > 0) {
          validationResults.discrepancies.push(comparisonResult);
          
          // Check for government vs alternative source discrepancies
          const isSource1Gov = this.sourceManager.isGovernmentSource(source1);
          const isSource2Gov = this.sourceManager.isGovernmentSource(source2);
          
          if (isSource1Gov && !isSource2Gov) {
            validationResults.compromisedSources.push(source1);
          } else if (!isSource1Gov && isSource2Gov) {
            validationResults.compromisedSources.push(source2);
          }
        }
      }
    }
    
    // Perform deep validation if requested
    if (options.deepValidation) {
      // Choose the most reliable source for deep validation
      let mostReliableSource = sources[0];
      let highestReliability = this.sourceManager.getSourceReliability(mostReliableSource);
      
      for (let i = 1; i < sources.length; i++) {
        const reliability = this.sourceManager.getSourceReliability(sources[i]);
        if (reliability > highestReliability) {
          highestReliability = reliability;
          mostReliableSource = sources[i];
        }
      }
      
      const deepValidationResult = await DataValidationUtils.deepValidateData(
        category, 
        results[mostReliableSource].data
      );
      
      validationResults.deepValidation = {
        valid: deepValidationResult.valid,
        issues: deepValidationResult.issues
      };
      
      // If deep validation finds high-severity issues, mark the source as compromised
      if (!deepValidationResult.valid) {
        validationResults.compromisedSources.push(mostReliableSource);
      }
    }
    
    return DataResultUtils.processValidationResults(
      results, 
      validationResults, 
      category, 
      this.sourceManager
    );
  }
  
  /**
   * Get information about data sources
   */
  getSourcesInfo(): SourcesInfo {
    return this.sourceManager.getSourcesInfo(COMPROMISED_CATEGORIES);
  }
  
  /**
   * Get available data categories
   */
  getAvailableCategories(): string[] {
    return DataMappingUtils.getAvailableCategories();
  }
}
