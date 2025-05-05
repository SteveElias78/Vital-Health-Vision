import { GOVERNMENT_SOURCES, ALTERNATIVE_SOURCES, COMPROMISED_CATEGORIES } from '../config/dataSourceConfig';
import { DataResponse } from '../utils/types';
import { BRFSSConnector } from './connectors/BRFSSConnector';
import { NHANESConnector } from './connectors/NHANESConnector';
import { WHOConnector } from './connectors/WHOConnector';
import { InternetArchiveConnector } from './connectors/InternetArchiveConnector';
import { FenwayInstituteConnector } from './connectors/FenwayInstituteConnector';

// Types
interface SourceMapping {
  source: string;
  method: string;
  params: Record<string, any>;
}

interface CategoryMapping {
  primary: SourceMapping[];
  secondary: SourceMapping[];
}

interface SourceStatus {
  available: boolean;
  lastChecked: Date | null;
  lastSuccessful: Date | null;
  failureCount: number;
  integrityVerified?: boolean;
}

interface DataSourceStatusMap {
  [key: string]: SourceStatus;
}

interface ValidationResultDiscrepancy {
  type: string;
  field?: string;
  source1: { source: string; value?: any; count?: number };
  source2: { source: string; value?: any; count?: number };
  percentDiff: number;
}

interface ComparisonResult {
  source1: string;
  source2: string;
  discrepancies: ValidationResultDiscrepancy[];
}

interface ValidationResults {
  discrepancies: ComparisonResult[];
  sourcesCompared: number;
  compromisedSources: string[];
  sourceSwitch?: {
    from: string;
    to: string;
    reason: string;
  };
}

interface GetHealthDataOptions {
  singleSource?: boolean;
  [key: string]: any;
}

interface SourceInfo {
  id: string;
  name: string;
  reliability: number;
  categories: string[];
  status: SourceStatus;
}

interface SourcesInfo {
  government: SourceInfo[];
  alternative: SourceInfo[];
  compromisedCategories: string[];
}

export class HybridHealthDataConnector {
  private brfssConnector: BRFSSConnector;
  private nhanesConnector: NHANESConnector;
  private whoConnector: WHOConnector;
  private archiveConnector: InternetArchiveConnector;
  private fenwayConnector: FenwayInstituteConnector;
  private dataSourceStatus: DataSourceStatusMap;
  private validationCache: Map<string, any>;
  private dataSourceMapping: Record<string, CategoryMapping>;
  
  constructor() {
    // Initialize connectors
    this.brfssConnector = new BRFSSConnector();
    this.nhanesConnector = new NHANESConnector();
    this.whoConnector = new WHOConnector();
    this.archiveConnector = new InternetArchiveConnector();
    this.fenwayConnector = new FenwayInstituteConnector();
    
    // Data source status tracking
    this.dataSourceStatus = {};
    this.initializeSourceStatus();
    
    // Cache for data validation results
    this.validationCache = new Map();
    
    // Data source mapping for different categories
    this.dataSourceMapping = {
      'obesity': {
        primary: [
          { source: 'nhanes', method: 'fetchBodyMeasures', params: { cycle: '2017-2018' } },
          { source: 'brfss', method: 'fetchData', params: { category: 'overweight' } }
        ],
        secondary: [
          { source: 'archive', method: 'fetchArchivedData', params: { datasetName: 'obesity' } }
        ]
      },
      'mental-health': {
        primary: [
          { source: 'nhanes', method: 'fetchMentalHealth', params: { cycle: '2017-2018' } },
          { source: 'brfss', method: 'fetchData', params: { category: 'mentalHealth' } }
        ],
        secondary: [
          { source: 'archive', method: 'fetchArchivedData', params: { datasetName: 'mental-health' } }
        ]
      },
      'lgbtq-health': {
        primary: [
          { source: 'nhanes', method: 'fetchSexualOrientationData', params: { cycle: '2017-2018' } },
          { source: 'brfss', method: 'fetchData', params: { category: 'lgbtq' } }
        ],
        secondary: [
          { source: 'fenway', method: 'fetchLgbtqHealthDisparities', params: {} },
          { source: 'archive', method: 'fetchLgbtqHealthData', params: {} }
        ]
      },
      'minority-health': {
        primary: [
          { source: 'nhanes', method: 'fetchDemographics', params: { cycle: '2017-2018' } },
          { source: 'brfss', method: 'fetchData', params: { breakoutBy: 'Race/Ethnicity' } }
        ],
        secondary: [
          { source: 'archive', method: 'fetchMinorityHealthData', params: {} }
        ]
      },
      'global-health': {
        primary: [
          { source: 'who', method: 'fetchIndicatorData', params: {} }
        ],
        secondary: []
      }
      // Add more mappings as needed
    };
  }
  
  /**
   * Initialize source status tracking
   */
  private initializeSourceStatus(): void {
    // Initialize government sources
    Object.keys(GOVERNMENT_SOURCES).forEach(source => {
      this.dataSourceStatus[source] = {
        available: true,
        lastChecked: null,
        lastSuccessful: null,
        failureCount: 0,
        integrityVerified: false
      };
    });
    
    // Initialize alternative sources
    Object.keys(ALTERNATIVE_SOURCES).forEach(source => {
      this.dataSourceStatus[source] = {
        available: true,
        lastChecked: null,
        lastSuccessful: null,
        failureCount: 0,
      };
    });
  }
  
  /**
   * Get the appropriate connector for a source
   */
  private getConnectorForSource(source: string): BaseDataConnector {
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
      this.updateSourceStatus(source, true, result.metadata?.integrityVerified);
      
      return result;
    } catch (error) {
      // Update source status
      this.updateSourceStatus(source, false);
      
      console.error(`Error fetching from ${source}.${method}:`, error);
      throw error;
    }
  }
  
  /**
   * Update the status of a data source
   */
  private updateSourceStatus(source: string, success: boolean, integrityVerified: boolean = false): void {
    const now = new Date();
    
    if (!this.dataSourceStatus[source]) {
      this.dataSourceStatus[source] = {
        available: true,
        lastChecked: now,
        lastSuccessful: null,
        failureCount: 0,
        integrityVerified: false
      };
    }
    
    this.dataSourceStatus[source].lastChecked = now;
    
    if (success) {
      this.dataSourceStatus[source].lastSuccessful = now;
      this.dataSourceStatus[source].failureCount = 0;
      this.dataSourceStatus[source].available = true;
      
      if (integrityVerified) {
        this.dataSourceStatus[source].integrityVerified = true;
      }
    } else {
      this.dataSourceStatus[source].failureCount += 1;
      
      // Mark source as unavailable after 3 consecutive failures
      if (this.dataSourceStatus[source].failureCount >= 3) {
        this.dataSourceStatus[source].available = false;
      }
    }
  }
  
  /**
   * Get health data for a specific category
   */
  async getHealthData<T = any>(
    category: string, 
    options: GetHealthDataOptions = {}
  ): Promise<DataResponse<T>> {
    // Find source mapping for this category
    const mapping = this.dataSourceMapping[category];
    
    if (!mapping) {
      throw new Error(`No data source mapping for category: ${category}`);
    }
    
    // Check if this is a potentially compromised category
    const isCompromisedCategory = COMPROMISED_CATEGORIES.some(
      compromisedCategory => category.includes(compromisedCategory)
    );
    
    // For compromised categories, prioritize alternative sources
    const primarySources = isCompromisedCategory 
      ? [...mapping.secondary, ...mapping.primary] 
      : mapping.primary;
    
    const secondarySources = isCompromisedCategory
      ? []
      : mapping.secondary;
    
    const results: Record<string, DataResponse<any>> = {};
    const errors: Array<{ source: string; error: string }> = [];
    
    // Try primary sources first
    for (const source of primarySources) {
      if (this.dataSourceStatus[source.source]?.available !== false) {
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
        if (this.dataSourceStatus[source.source]?.available !== false) {
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
      return await this.validateAndReconcileResults(results, category) as DataResponse<T>;
    }
    
    // Otherwise, combine the results
    return this.combineResults(results, category) as DataResponse<T>;
  }
  
  /**
   * Validate and reconcile data from multiple sources
   */
  private async validateAndReconcileResults(
    results: Record<string, DataResponse<any>>, 
    category: string
  ): Promise<DataResponse<any>> {
    const sources = Object.keys(results);
    
    // Only proceed if we have multiple sources
    if (sources.length <= 1) {
      return this.combineResults(results, category);
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
        
        const comparisonResult = this.compareDataSets(
          results[source1].data,
          results[source2].data,
          source1,
          source2
        );
        
        if (comparisonResult.discrepancies.length > 0) {
          validationResults.discrepancies.push(comparisonResult);
          
          // Check for government vs alternative source discrepancies
          const isSource1Gov = this.isGovernmentSource(source1);
          const isSource2Gov = this.isGovernmentSource(source2);
          
          if (isSource1Gov && !isSource2Gov) {
            validationResults.compromisedSources.push(source1);
          } else if (!isSource1Gov && isSource2Gov) {
            validationResults.compromisedSources.push(source2);
          }
        }
      }
    }
    
    // If there are government sources with discrepancies, prefer alternative sources
    if (validationResults.compromisedSources.length > 0) {
      // Find the most reliable alternative source
      let bestAlternativeSource = null;
      let highestReliability = 0;
      
      for (const source of sources) {
        if (!validationResults.compromisedSources.includes(source)) {
          const reliability = this.getSourceReliability(source);
          if (reliability > highestReliability) {
            highestReliability = reliability;
            bestAlternativeSource = source;
          }
        }
      }
      
      if (bestAlternativeSource) {
        console.log(`Using alternative source ${bestAlternativeSource} due to discrepancies in government data`);
        
        // Return the alternative source result with validation metadata
        const result = results[bestAlternativeSource];
        result.metadata.validation = validationResults;
        result.metadata.validation.sourceSwitch = {
          from: validationResults.compromisedSources.join(', '),
          to: bestAlternativeSource,
          reason: 'data_integrity_concerns'
        };
        
        return result;
      }
    }
    
    // If no integrity concerns or no good alternative, combine results
    const combinedResults = this.combineResults(results, category);
    
    // Add validation metadata
    combinedResults.metadata.validation = validationResults;
    
    return combinedResults;
  }
  
  /**
   * Determine if a source is a government source
   */
  private isGovernmentSource(source: string): boolean {
    return ['nhanes', 'brfss', 'who', 'nih', 'cdc'].includes(source);
  }
  
  /**
   * Get reliability score for a source
   */
  private getSourceReliability(source: string): number {
    if (source === 'nhanes') return 0.95;
    if (source === 'brfss') return 0.9;
    if (source === 'who') return 0.95;
    if (source === 'archive') return 0.9;
    if (source === 'fenway') return 0.9;
    return 0.8; // Default
  }
  
  /**
   * Compare two datasets and identify discrepancies
   */
  private compareDataSets(
    data1: any, 
    data2: any, 
    source1: string, 
    source2: string
  ): ComparisonResult {
    const discrepancies: ValidationResultDiscrepancy[] = [];
    
    // This is a simplified implementation - in practice, you would
    // implement more sophisticated comparison logic based on your data structure
    
    // For example, if both are arrays of objects:
    if (Array.isArray(data1) && Array.isArray(data2)) {
      // Compare length
      if (data1.length !== data2.length) {
        discrepancies.push({
          type: 'record_count',
          source1: { source: source1, count: data1.length },
          source2: { source: source2, count: data2.length },
          percentDiff: Math.abs((data1.length - data2.length) / data1.length) * 100
        });
      }
      
      // Get a sample to compare (first 5 items)
      const sampleSize = Math.min(5, data1.length, data2.length);
      
      for (let i = 0; i < sampleSize; i++) {
        const item1 = data1[i];
        const item2 = data2[i];
        
        // Compare common fields
        const commonKeys = Object.keys(item1).filter(key => key in item2);
        
        for (const key of commonKeys) {
          if (typeof item1[key] === 'number' && typeof item2[key] === 'number') {
            const percentDiff = Math.abs((item1[key] - item2[key]) / item1[key]) * 100;
            
            // If difference is more than 10%, flag as discrepancy
            if (percentDiff > 10) {
              discrepancies.push({
                type: 'value',
                field: key,
                source1: { source: source1, value: item1[key] },
                source2: { source: source2, value: item2[key] },
                percentDiff
              });
            }
          }
        }
      }
    }
    
    return {
      source1,
      source2,
      discrepancies
    };
  }
  
  /**
   * Combine results from multiple sources
   */
  private combineResults(
    results: Record<string, DataResponse<any>>, 
    category: string
  ): DataResponse<any> {
    // Create a combined result object
    const combined: DataResponse<any> = {
      data: {},
      metadata: {
        sources: Object.keys(results),
        category,
        fetchedAt: new Date().toISOString(),
        combinedResult: true
      }
    };
    
    // Add data from each source
    Object.entries(results).forEach(([source, result]) => {
      combined.data[source] = result.data;
      
      // Copy source-specific metadata
      combined.metadata[source] = result.metadata;
    });
    
    // Calculate overall reliability as the average of source reliabilities
    const reliabilities = Object.entries(results)
      .map(([source]) => this.getSourceReliability(source));
    
    combined.metadata.reliability = reliabilities.reduce((sum, r) => sum + r, 0) / reliabilities.length;
    
    return combined;
  }
  
  /**
   * Get information about data sources
   */
  getSourcesInfo(): SourcesInfo {
    return {
      government: Object.entries(GOVERNMENT_SOURCES).map(([id, config]) => ({
        id,
        name: id.replace(/_/g, ' '),
        reliability: config.reliability || 0,
        categories: config.categories || [],
        status: this.dataSourceStatus[id] || { available: false, lastChecked: null, lastSuccessful: null, failureCount: 0 }
      })),
      alternative: Object.entries(ALTERNATIVE_SOURCES).map(([id, config]) => ({
        id,
        name: id.replace(/_/g, ' '),
        reliability: config.reliability || 0,
        categories: config.categories || [],
        status: this.dataSourceStatus[id] || { available: false, lastChecked: null, lastSuccessful: null, failureCount: 0 }
      })),
      compromisedCategories: COMPROMISED_CATEGORIES
    };
  }
  
  /**
   * Get available data categories
   */
  getAvailableCategories(): string[] {
    return Object.keys(this.dataSourceMapping);
  }
}
