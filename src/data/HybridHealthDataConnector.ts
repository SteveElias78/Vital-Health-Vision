import { COMPROMISED_CATEGORIES } from '../config/dataSourceConfig';
import { DataResponse } from '../utils/types';
import { SourceManager, SourcesInfo } from './utils/SourceManager';
import { DataValidationUtils } from './utils/DataValidationUtils';
import { DataResultUtils } from './utils/DataResultUtils';
import { DataMappingUtils } from './utils/DataMappingUtils';
import { DataFetchingService } from './services/DataFetchingService';
import { ValidationService } from './services/ValidationService';

// Types
interface GetHealthDataOptions {
  singleSource?: boolean;
  deepValidation?: boolean;
  preferAlternativeSources?: boolean;
  [key: string]: any;
}

export class HybridHealthDataConnector {
  private sourceManager: SourceManager;
  private dataFetchingService: DataFetchingService;
  private validationService: ValidationService;
  private validationCache: Map<string, any>;
  
  constructor() {
    // Initialize services
    this.sourceManager = new SourceManager();
    this.dataFetchingService = new DataFetchingService(this.sourceManager);
    this.validationService = new ValidationService(this.sourceManager);
    
    // Cache for data validation results
    this.validationCache = new Map();
  }
  
  /**
   * Get health data for a specific category
   */
  async getHealthData<T = any>(
    category: string, 
    options: GetHealthDataOptions = {}
  ): Promise<DataResponse<T>> {
    // Check if this is a potentially compromised category
    const isCompromisedCategory = this.isCategoryPotentiallyCompromised(category);
    
    // Get sources for this category
    const { primarySources, secondarySources } = DataMappingUtils.getSourcesForCategory(
      category,
      isCompromisedCategory || options.preferAlternativeSources
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
          
          const result = await this.dataFetchingService.fetchFromSource(
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
            
            const result = await this.dataFetchingService.fetchFromSource(
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
      return await this.validationService.validateAndReconcileResults(
        results, 
        category, 
        options
      ) as DataResponse<T>;
    }
    
    // Otherwise, combine the results
    return DataResultUtils.combineResults(results, category, this.sourceManager) as DataResponse<T>;
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
  
  /**
   * Check if a category is potentially compromised
   */
  isCategoryPotentiallyCompromised(category: string): boolean {
    return DataValidationUtils.isCategoryCompromised(category);
  }
}
