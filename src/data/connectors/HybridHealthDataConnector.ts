import axios from 'axios';
import { DataResponse } from '@/utils/types';
import { API_KEYS, AUTH_ENDPOINTS, getApiKey, getOAuthConfig } from '@/config/apiAuth';
import { COMPROMISED_CATEGORIES, GOVERNMENT_SOURCES, ALTERNATIVE_SOURCES } from '@/config/dataSourceConfig';

// Types for source status tracking
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

interface AuthToken {
  token: string;
  expiry: number;
}

interface AuthTokenMap {
  [key: string]: AuthToken;
}

interface CachedDataItem {
  data: any;
  timestamp: number;
  source: string;
  integrityVerified: boolean;
}

interface CachedDataMap {
  [key: string]: CachedDataItem;
}

interface ProvenanceEntry {
  source: string;
  timestamp: number;
  integrityVerified: boolean;
}

interface DataProvenance {
  [endpoint: string]: ProvenanceEntry[];
}

interface ComparisonResult {
  discrepancies: any[];
}

interface SourceConfig {
  baseUrl: string;
  endpoints: Record<string, string>;
  priority: number;
  requiresAuth?: boolean;
  authType?: 'apiKey' | 'oauth';
  reliability: number;
  categories: string[];
  lastVerifiedDate?: string;
  dataDate?: string;
}

interface AttemptedSource {
  source: string;
  endpoint: string;
  status: 'success' | 'error';
  type: 'government' | 'alternative';
  reliability?: number;
  error?: string;
}

interface SourceInfo {
  source: string;
  priority: number;
  reliability: number;
  type: 'government' | 'alternative';
}

interface CombinedData {
  primaryData: DataResponseWithSource;
  additionalSources: DataResponseWithSource[];
}

interface DataResponseWithSource extends DataResponse {
  source: string;
}

/**
 * Main data connector class that intelligently selects between sources
 * based on reliability, integrity checks, and data category
 */
export class HybridHealthDataConnector {
  private authTokens: AuthTokenMap;
  private cachedData: CachedDataMap;
  private dataSourceStatus: DataSourceStatusMap;
  private dataProvenance: DataProvenance;

  constructor() {
    this.authTokens = {};
    this.cachedData = {};
    this.dataSourceStatus = {};
    this.dataProvenance = {};
    this.initializeSourceStatus();
  }

  /**
   * Initialize the status tracking for all data sources
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
        failureCount: 0
      };
    });
  }

  /**
   * Get authentication token for sources that require it
   */
  private async getAuthToken(source: string): Promise<string | null> {
    let sourceConfig: any;
    
    if (GOVERNMENT_SOURCES[source]) {
      sourceConfig = GOVERNMENT_SOURCES[source];
    } else if (ALTERNATIVE_SOURCES[source]) {
      sourceConfig = ALTERNATIVE_SOURCES[source];
    } else {
      throw new Error(`Unknown data source: ${source}`);
    }
    
    // Return existing token if available and not expired
    if (this.authTokens[source] && this.authTokens[source].expiry > Date.now()) {
      return this.authTokens[source].token;
    }
    
    if (!sourceConfig.requiresAuth) {
      return null;
    }
    
    try {
      // Handle different auth types
      if (sourceConfig.authType === 'apiKey') {
        const apiKey = getApiKey(source);
        if (!apiKey) {
          throw new Error(`API key not configured for source: ${source}`);
        }
        
        this.authTokens[source] = {
          token: apiKey,
          expiry: Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
        };
        return apiKey;
      } else if (sourceConfig.authType === 'oauth') {
        const authConfig = getOAuthConfig(source);
        if (!authConfig || !authConfig.tokenUrl) {
          throw new Error(`OAuth config not available for source: ${source}`);
        }
        
        const response = await axios.post(authConfig.tokenUrl as string, {
          client_id: authConfig.clientId,
          client_secret: authConfig.clientSecret,
          grant_type: 'client_credentials',
        });
        
        this.authTokens[source] = {
          token: response.data.access_token,
          expiry: Date.now() + (response.data.expires_in * 1000),
        };
        
        return response.data.access_token;
      }
      
      return null;
    } catch (error) {
      console.error(`Failed to get auth token for ${source}:`, error);
      throw new Error(`Authentication failed for ${source}`);
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
        failureCount: 0
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
   * Get data from a specific source
   */
  private async getDataFromSource(source: string, endpoint: string, params: Record<string, any> = {}): Promise<DataResponseWithSource> {
    let sourceConfig: any;
    
    // Determine whether this is a government or alternative source
    if (GOVERNMENT_SOURCES[source]) {
      sourceConfig = GOVERNMENT_SOURCES[source];
    } else if (ALTERNATIVE_SOURCES[source]) {
      sourceConfig = ALTERNATIVE_SOURCES[source];
    } else {
      throw new Error(`Unknown data source: ${source}`);
    }
    
    if (!sourceConfig.endpoints || !sourceConfig.endpoints[endpoint]) {
      throw new Error(`Unknown endpoint '${endpoint}' for source ${source}`);
    }
    
    try {
      // Get auth token if required
      let headers: Record<string, string> = {};
      if (sourceConfig.requiresAuth) {
        const token = await this.getAuthToken(source);
        
        if (token) {
          if (sourceConfig.authType === 'apiKey') {
            headers['X-API-Key'] = token;
          } else if (sourceConfig.authType === 'oauth') {
            headers['Authorization'] = `Bearer ${token}`;
          }
        }
      }
      
      // Construct request URL
      const url = `${sourceConfig.baseUrl}${sourceConfig.endpoints[endpoint]}`;
      
      // Make the request
      const response = await axios.get(url, {
        headers,
        params,
        timeout: 15000, // 15 second timeout
      });
      
      // For government sources, verify data integrity
      let integrityVerified = false;
      if (GOVERNMENT_SOURCES[source]) {
        integrityVerified = await this.verifyDataIntegrity(source, endpoint, response.data);
      }
      
      // Update source status
      this.updateSourceStatus(source, true, integrityVerified);
      
      // Cache the data
      const cacheKey = this.getCacheKey(source, endpoint, params);
      this.cachedData[cacheKey] = {
        data: response.data,
        timestamp: Date.now(),
        source,
        integrityVerified,
      };
      
      // Track data provenance
      if (!this.dataProvenance[endpoint]) {
        this.dataProvenance[endpoint] = [];
      }
      this.dataProvenance[endpoint].push({
        source,
        timestamp: Date.now(),
        integrityVerified,
      });
      
      return {
        data: response.data,
        source,
        metadata: {
          source,
          endpoint,
          timestamp: new Date().toISOString(),
          reliability: sourceConfig.reliability || 0.8,
          cached: false,
          fetchedAt: new Date().toISOString(),
          sourceType: GOVERNMENT_SOURCES[source] ? 'government' : 'alternative',
          integrityVerified,
        }
      };
    } catch (error) {
      // Update source status
      this.updateSourceStatus(source, false);
      
      console.error(`Error fetching from ${source}/${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Verify the integrity of government data
   */
  private async verifyDataIntegrity(source: string, endpoint: string, data: any): Promise<boolean> {
    try {
      // Check if this category is known to be compromised
      const sourceConfig = GOVERNMENT_SOURCES[source];
      const dataCategories = sourceConfig?.categories || [];
      
      // If any data category is in the compromised list, consider it suspect
      const isCompromisedCategory = dataCategories.some(category => 
        COMPROMISED_CATEGORIES.includes(category));
      
      if (isCompromisedCategory) {
        console.warn(`Data from ${source}/${endpoint} is in a potentially compromised category`);
        return false;
      }
      
      // For data from CDC sources, check if it was verified after January 29th, 2025
      if (source.startsWith('CDC_') && sourceConfig?.lastVerifiedDate) {
        const verifiedDate = new Date(sourceConfig.lastVerifiedDate);
        const compromiseDate = new Date('2025-01-29');
        
        if (verifiedDate < compromiseDate) {
          console.warn(`Data from ${source} was last verified before recent changes`);
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error(`Error verifying data integrity for ${source}/${endpoint}:`, error);
      return false;
    }
  }

  /**
   * Generate a cache key for a request
   */
  private getCacheKey(source: string, endpoint: string, params: Record<string, any>): string {
    return `${source}:${endpoint}:${JSON.stringify(params)}`;
  }

  /**
   * Get the best sources for a specific data category
   */
  private getSourcesForCategory(dataCategory: string): SourceInfo[] {
    const result: SourceInfo[] = [];
    
    // Is this a potentially compromised category?
    const isCompromisedCategory = COMPROMISED_CATEGORIES.some(category => 
      dataCategory.toLowerCase().includes(category.toLowerCase()));
    
    // If compromised, prioritize alternative sources
    if (isCompromisedCategory) {
      // First add alternative sources
      Object.entries(ALTERNATIVE_SOURCES).forEach(([source, config]) => {
        if (config.categories.some(category => dataCategory.toLowerCase().includes(category.toLowerCase()))) {
          result.push({
            source,
            priority: config.priority,
            reliability: config.reliability,
            type: 'alternative'
          });
        }
      });
      
      // Then add government sources as fallbacks
      Object.entries(GOVERNMENT_SOURCES).forEach(([source, config]) => {
        if (config.categories.some(category => dataCategory.toLowerCase().includes(category.toLowerCase()))) {
          result.push({
            source,
            priority: config.priority + 10, // Lower priority for government sources in compromised categories
            reliability: config.reliability * 0.7, // Lower reliability for government sources in compromised categories
            type: 'government'
          });
        }
      });
    } else {
      // For non-compromised categories, prioritize government sources
      // First add government sources
      Object.entries(GOVERNMENT_SOURCES).forEach(([source, config]) => {
        if (config.categories.some(category => dataCategory.toLowerCase().includes(category.toLowerCase()))) {
          result.push({
            source,
            priority: config.priority,
            reliability: config.reliability,
            type: 'government'
          });
        }
      });
      
      // Then add alternative sources as backups
      Object.entries(ALTERNATIVE_SOURCES).forEach(([source, config]) => {
        if (config.categories.some(category => dataCategory.toLowerCase().includes(category.toLowerCase()))) {
          result.push({
            source,
            priority: config.priority,
            reliability: config.reliability,
            type: 'alternative'
          });
        }
      });
    }
    
    // Sort by priority (lower number = higher priority)
    return result.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Map between data categories and source-specific endpoints
   */
  private getEndpointForCategoryAndSource(dataCategory: string, source: string): string | null {
    // This mapping would be expanded for all categories and sources
    const mappings: Record<string, Record<string, string>> = {
      'lgbtq-health': {
        'FENWAY_INSTITUTE': 'lgbtqHealthDisparities',
        'WILLIAMS_INSTITUTE': 'healthDisparities',
        'THE_19TH_ARCHIVE': 'lgbtqYouthData',
        'INTERNET_ARCHIVE_CDC': 'lgbtqHealth',
        'WHO_INEQUALITY_REPOSITORY': 'indicators', // With params
      },
      'youth-health': {
        'INTERNET_ARCHIVE_CDC': 'youthRisk',
        'THE_19TH_ARCHIVE': 'lgbtqYouthData',
        'WHO_GLOBAL_HEALTH_OBSERVATORY': 'indicators', // With params
        'OUR_WORLD_DATA': 'childMortality',
      },
      'maternal-health': {
        'THE_19TH_ARCHIVE': 'maternalMortality',
        'WHO_GLOBAL_HEALTH_OBSERVATORY': 'indicators', // With params
        'GHDX_IHME': 'indicators', // With params
      },
      'mortality': {
        'CDC_WONDER': 'mortality',
        'WHO_GLOBAL_HEALTH_OBSERVATORY': 'indicators', // With params
        'OUR_WORLD_DATA': 'lifeExpectancy',
        'GHDX_IHME': 'globalBurdenDisease',
      },
      'health-disparities': {
        'FENWAY_INSTITUTE': 'minorityHealthMetrics',
        'WILLIAMS_INSTITUTE': 'healthDisparities',
        'WHO_INEQUALITY_REPOSITORY': 'indicators', // With params
        'INTERNET_ARCHIVE_CDC': 'minorityHealth',
      },
    };
    
    // If no specific mapping exists, use a default endpoint
    if (!mappings[dataCategory] || !mappings[dataCategory][source]) {
      if (source.includes('WHO')) {
        return 'indicators'; // Default WHO endpoint
      }
      
      // Try to find an endpoint that matches the category name
      const sourceConfig = GOVERNMENT_SOURCES[source] || ALTERNATIVE_SOURCES[source];
      if (!sourceConfig || !sourceConfig.endpoints) {
        return null;
      }
      
      // Look for an endpoint that might match the category
      for (const [endpointName] of Object.entries(sourceConfig.endpoints)) {
        if (endpointName.toLowerCase().includes(dataCategory.toLowerCase())) {
          return endpointName;
        }
      }
      
      // Default to first available endpoint
      return Object.keys(sourceConfig.endpoints)[0];
    }
    
    return mappings[dataCategory][source];
  }

  /**
   * Get parameters for specific source and category
   */
  private getParamsForSourceAndCategory(dataCategory: string, source: string, baseParams: Record<string, any> = {}): Record<string, any> {
    // Transform generic parameters into source-specific parameters
    const params = { ...baseParams };
    
    // WHO-specific parameter transformations
    if (source === 'WHO_GLOBAL_HEALTH_OBSERVATORY') {
      // Add specific indicator codes based on category
      if (dataCategory === 'maternal-health') {
        params.indicator = 'WHS7_48,WHS7_103,WHS7_105,WHS7_106,WHS7_108';
      } else if (dataCategory === 'lgbtq-health') {
        params.dimension = 'GHO;COUNTRY;YEAR;SEX';
      } else if (dataCategory === 'youth-health') {
        params.indicator = 'WHS7_120,WHS7_121,WHS7_124';
      }
    }
    
    // CDC WONDER specific parameters
    else if (source === 'CDC_WONDER') {
      if (dataCategory === 'mortality') {
        params.request = 'true';
        params.accept_datause_restrictions = 'true';
      }
    }
    
    // IHME specific parameters
    else if (source === 'GHDX_IHME') {
      if (dataCategory === 'health-disparities') {
        params.measure_id = '4,5,6';
        params.metric_id = '1';
      }
    }
    
    return params;
  }

  /**
   * Compare two datasets and identify discrepancies
   */
  private compareDataSets(primaryData: any, comparisonData: any, primarySource: string, comparisonSource: string): ComparisonResult {
    const discrepancies: any[] = [];
    
    // Handle different data structures
    // This is a simplified implementation - would need to be expanded
    
    // If both are arrays
    if (Array.isArray(primaryData) && Array.isArray(comparisonData)) {
      // Compare array lengths
      if (primaryData.length !== comparisonData.length) {
        discrepancies.push({
          type: 'length',
          primary: primaryData.length,
          comparison: comparisonData.length,
          primarySource,
          comparisonSource,
        });
      }
      
      // Compare a sample of items
      const itemsToCompare = Math.min(10, primaryData.length, comparisonData.length);
      
      for (let i = 0; i < itemsToCompare; i++) {
        const primaryItem = primaryData[i];
        const comparisonItem = comparisonData[i];
        
        // Compare objects
        if (typeof primaryItem === 'object' && typeof comparisonItem === 'object') {
          for (const key of Object.keys(primaryItem)) {
            if (comparisonItem[key] !== undefined && 
                !this.areValuesEqual(primaryItem[key], comparisonItem[key])) {
              
              // Calculate percentage difference for numeric values
              let percentDiff = null;
              if (typeof primaryItem[key] === 'number' && typeof comparisonItem[key] === 'number') {
                percentDiff = Math.abs((primaryItem[key] - comparisonItem[key]) / primaryItem[key]) * 100;
              }
              
              discrepancies.push({
                type: 'value',
                field: key,
                index: i,
                primary: primaryItem[key],
                comparison: comparisonItem[key],
                percentDiff,
                primarySource,
                comparisonSource,
              });
            }
          }
        }
      }
    }
    // If both are objects but not arrays
    else if (typeof primaryData === 'object' && typeof comparisonData === 'object' &&
             !Array.isArray(primaryData) && !Array.isArray(comparisonData)) {
      
      // Compare keys
      for (const key of Object.keys(primaryData)) {
        if (comparisonData[key] !== undefined && 
            !this.areValuesEqual(primaryData[key], comparisonData[key])) {
          
          // Calculate percentage difference for numeric values
          let percentDiff = null;
          if (typeof primaryData[key] === 'number' && typeof comparisonData[key] === 'number') {
            percentDiff = Math.abs((primaryData[key] - comparisonData[key]) / primaryData[key]) * 100;
          }
          
          discrepancies.push({
            type: 'value',
            field: key,
            primary: primaryData[key],
            comparison: comparisonData[key],
            percentDiff,
            primarySource,
            comparisonSource,
          });
        }
      }
    }
    
    return { discrepancies };
  }
  
  /**
   * Helper to compare values with tolerance for numbers
   */
  private areValuesEqual(val1: any, val2: any): boolean {
    // If types don't match, they're not equal
    if (typeof val1 !== typeof val2) {
      return false;
    }
    
    // For numbers, allow small differences
    if (typeof val1 === 'number' && typeof val2 === 'number') {
      const tolerance = Math.max(Math.abs(val1), Math.abs(val2)) * 0.01; // 1% tolerance
      return Math.abs(val1 - val2) <= tolerance;
    }
    
    // For other types, do direct comparison
    return val1 === val2;
  }
  
  /**
   * Normalize health data for consistent field names and formats
   */
  private normalizeHealthData(rawData: DataResponseWithSource, dataCategory: string): DataResponse {
    const data = rawData.data;
    const source = rawData.source;
    
    // Field mapping for different data categories and sources
    const fieldMappings: Record<string, Record<string, Record<string, string>>> = {
      'lgbtq-health': {
        'FENWAY_INSTITUTE': {
          'sexual_orientation': 'sexualOrientation',
          'gender_identity': 'genderIdentity',
          'depression_rate': 'depressionRate',
          'anxiety_rate': 'anxietyRate',
          'access_to_care': 'healthcareAccess',
        },
        'WILLIAMS_INSTITUTE': {
          'sexual_id': 'sexualOrientation',
          'gender_id': 'genderIdentity',
          'depression_pct': 'depressionRate',
          'anxiety_pct': 'anxietyRate',
        },
        'THE_19TH_ARCHIVE': {
          'so': 'sexualOrientation',
          'gi': 'genderIdentity',
          'depression': 'depressionRate',
          'anxiety': 'anxietyRate',
        },
      },
      'youth-health': {
        'INTERNET_ARCHIVE_CDC': {
          'bullied_at_school': 'bulliedAtSchool',
          'electronic_bullying': 'bulliedElectronically',
          'felt_sad_hopeless': 'feltSadOrHopeless',
          'considered_suicide': 'consideredSuicide',
        },
        'THE_19TH_ARCHIVE': {
          'bullying_school': 'bulliedAtSchool',
          'cyber_bullying': 'bulliedElectronically',
          'depression': 'feltSadOrHopeless',
          'suicidal_ideation': 'consideredSuicide',
        },
      },
      // Add mappings for other categories
    };
    
    // Get mapping for this category and source
    const mapping = fieldMappings[dataCategory]?.[source] || {};
    
    // Create normalized data structure
    let normalizedData: any;
    
    if (Array.isArray(data)) {
      // Normalize array of items
      normalizedData = data.map(item => {
        const normalized: Record<string, any> = {};
        
        Object.keys(item).forEach(key => {
          // Use mapped field name if available, otherwise use original
          const normalizedKey = mapping[key] || key;
          normalized[normalizedKey] = item[key];
        });
        
        return normalized;
      });
    } else if (typeof data === 'object' && data !== null) {
      // Normalize object
      normalizedData = {};
      
      Object.keys(data).forEach(key => {
        const normalizedKey = mapping[key] || key;
        normalizedData[normalizedKey] = data[key];
      });
    } else {
      // If not an object or array, return as is
      normalizedData = data;
    }
    
    // Create result with normalized data and original metadata
    return {
      data: normalizedData,
      metadata: {
        ...rawData.metadata,
        originalFieldCount: this.countFields(data),
        normalizedFieldCount: this.countFields(normalizedData),
        normalizationApplied: Object.keys(mapping).length > 0,
        dataCategory,
      }
    };
  }
  
  /**
   * Count fields in an object or array of objects
   */
  private countFields(data: any): number {
    if (Array.isArray(data)) {
      return data.length > 0 ? Object.keys(data[0]).length : 0;
    } else if (typeof data === 'object' && data !== null) {
      return Object.keys(data).length;
    }
    return 0;
  }
  
  /**
   * Validate and reconcile data from multiple sources
   */
  private validateAndReconcileData(combinedData: CombinedData, dataCategory: string): DataResponse {
    const primaryData = combinedData.primaryData;
    const additionalSources = combinedData.additionalSources || [];
    
    // Create validation metadata
    const validationMetadata = {
      sourcesCompared: additionalSources.length + 1,
      primarySource: primaryData.source,
      primarySourceType: primaryData.metadata.sourceType,
      additionalSources: additionalSources.map(source => ({
        source: source.source,
        sourceType: source.metadata.sourceType,
      })),
      discrepancies: [] as any[],
      confidenceScore: primaryData.metadata.reliability || 0.8,
    };
    
    // Compare each additional source with the primary source
    for (const sourceData of additionalSources) {
      const comparison = this.compareDataSets(
        primaryData.data, 
        sourceData.data,
        primaryData.source,
        sourceData.source
      );
      
      // If discrepancies were found
      if (comparison.discrepancies.length > 0) {
        validationMetadata.discrepancies.push({
          primarySource: primaryData.source,
          comparisonSource: sourceData.source,
          discrepancies: comparison.discrepancies,
        });
        
        // Adjust confidence score based on discrepancies
        const discrepancyImpact = Math.min(0.3, comparison.discrepancies.length * 0.02);
        validationMetadata.confidenceScore -= discrepancyImpact;
      }
      
      // If no discrepancies, increase confidence slightly
      else {
        validationMetadata.confidenceScore += 0.05;
      }
    }
    
    // If government data conflicts with multiple alternative sources, prefer alternative
    const governmentSourceConflicts = validationMetadata.discrepancies.filter(
      d => d.primarySource.includes('CDC_') || d.primarySource.includes('NIH_')
    );
    
    // Determine if we should use alternative source due to conflicts
    const useAlternativeSource = 
      primaryData.metadata.sourceType === 'government' &&
      COMPROMISED_CATEGORIES.some(cat => dataCategory.includes(cat)) &&
      governmentSourceConflicts.length >= 2;
    
    // If needed, switch to the most reliable alternative source
    if (useAlternativeSource && additionalSources.length > 0) {
      // Find the most reliable alternative source
      const mostReliableAlt = additionalSources.reduce((best, current) => {
        return (current.metadata.reliability > best.metadata.reliability) ? current : best;
      }, additionalSources[0]);
      
      console.log(`Switching to alternative source ${mostReliableAlt.source} due to discrepancies with government data`);
      
      // Normalize the alternative source data
      const normalizedData = this.normalizeHealthData(mostReliableAlt, dataCategory);
      
      // Add validation metadata
      normalizedData.metadata.validation = validationMetadata;
      normalizedData.metadata.validation.sourceSwitch = {
        from: primaryData.source,
        to: mostReliableAlt.source,
        reason: 'government_data_conflicts',
      };
      
      return normalizedData;
    }
    
    // Otherwise, normalize and add validation metadata to the primary source
    const normalizedData = this.normalizeHealthData(primaryData, dataCategory);
    normalizedData.metadata.validation = validationMetadata;
    
    return normalizedData;
  }

  /**
   * Get health data using hybrid source selection
   */
  public async getHealthData<T = any>(dataCategory: string, params: Record<string, any> = {}, options: Record<string, any> = {}): Promise<DataResponse<T>> {
    // Get prioritized sources for this category
    const prioritizedSources = this.getSourcesForCategory(dataCategory);
    
    if (!prioritizedSources || prioritizedSources.length === 0) {
      throw new Error(`No data sources available for category: ${dataCategory}`);
    }
    
    let result = null;
    const attemptedSources: AttemptedSource[] = [];
    let combinedData: CombinedData | null = null;
    
    // Try sources in priority order
    for (const sourceInfo of prioritizedSources) {
      // Skip sources marked as unavailable
      if (this.dataSourceStatus[sourceInfo.source] && 
          !this.dataSourceStatus[sourceInfo.source].available) {
        continue;
      }
      
      const source = sourceInfo.source;
      const endpoint = this.getEndpointForCategoryAndSource(dataCategory, source);
      
      if (!endpoint) {
        continue;
      }
      
      // Get source-specific parameters
      const sourceParams = this.getParamsForSourceAndCategory(dataCategory, source, params);
      
      try {
        const data = await this.getDataFromSource(source, endpoint, sourceParams);
        
        // If this is our first successful source
        if (!result) {
          result = data;
          
          // If we got data from a reliable source and don't need to verify, we can stop here
          if (options.stopOnFirstSuccess && 
              ((sourceInfo.type === 'government' && data.metadata.integrityVerified) || 
               sourceInfo.type === 'alternative')) {
            break;
          }
        } else {
          // For additional sources, store for comparison/validation
          if (!combinedData) {
            combinedData = {
              primaryData: result,
              additionalSources: []
            };
          }
          
          combinedData.additionalSources.push(data);
        }
        
        attemptedSources.push({
          source,
          endpoint,
          status: 'success',
          type: sourceInfo.type,
          reliability: sourceInfo.reliability
        });
      } catch (error: any) {
        attemptedSources.push({
          source,
          endpoint,
          status: 'error',
          error: error.message,
          type: sourceInfo.type
        });
      }
    }
    
    // If we couldn't get data from any source
    if (!result) {
      const error = new Error(`Failed to fetch data for ${dataCategory} from all available sources`);
      throw error;
    }
    
    // If we got data from multiple sources, validate and reconcile
    if (combinedData && combinedData.additionalSources && combinedData.additionalSources.length > 0) {
      return this.validateAndReconcileData(combinedData, dataCategory) as DataResponse<T>;
    }
    
    // Otherwise normalize just the single source
    return this.normalizeHealthData(result, dataCategory) as DataResponse<T>;
  }

  /**
   * Store a snapshot of the data
   */
  private async preserveDataSnapshot(dataCategory: string, data: DataResponseWithSource): Promise<any> {
    // In a real implementation, this would save to a database or file system
    // This is a simplified implementation
    
    const snapshotInfo = {
      timestamp: new Date(),
      dataCategory,
      source: data.source,
      metadata: data.metadata,
      snapshotId: `${dataCategory}-${Date.now()}`,
    };
    
    console.log(`Preserving snapshot of ${dataCategory} data:`, snapshotInfo);
    
    return snapshotInfo;
  }
  
  /**
   * Check if a specific health data category might be compromised in government sources
   */
  public isCategoryPotentiallyCompromised(dataCategory: string): boolean {
    return COMPROMISED_CATEGORIES.some(category => 
      dataCategory.toLowerCase().includes(category.toLowerCase()));
  }
  
  /**
   * Get information about all available data sources
   */
  public getSourcesInfo(): {
    government: Array<{ id: string; name: string; type: string; reliability: number; categories: string[]; status: SourceStatus }>;
    alternative: Array<{ id: string; name: string; type: string; reliability: number; categories: string[]; status: SourceStatus }>;
    compromisedCategories: string[];
  } {
    const governmentSources = Object.entries(GOVERNMENT_SOURCES).map(([id, config]) => ({
      id,
      name: id.replace(/_/g, ' '),
      type: 'government',
      reliability: config.reliability,
      categories: config.categories,
      status: this.dataSourceStatus[id] || { available: false, lastChecked: null, lastSuccessful: null, failureCount: 0 },
    }));
    
    const alternativeSources = Object.entries(ALTERNATIVE_SOURCES).map(([id, config]) => ({
      id,
      name: id.replace(/_/g, ' '),
      type: 'alternative',
      reliability: config.reliability,
      categories: config.categories,
      status: this.dataSourceStatus[id] || { available: false, lastChecked: null, lastSuccessful: null, failureCount: 0 },
    }));
    
    return {
      government: governmentSources,
      alternative: alternativeSources,
      compromisedCategories: COMPROMISED_CATEGORIES,
    };
  }
  
  /**
   * Gets available data categories across all sources
   */
  public getAvailableDataCategories(): string[] {
    const categories = new Set<string>();
    
    // Add categories from government sources
    Object.values(GOVERNMENT_SOURCES).forEach(source => {
      source.categories.forEach(category => categories.add(category));
    });
    
    // Add categories from alternative sources
    Object.values(ALTERNATIVE_SOURCES).forEach(source => {
      source.categories.forEach(category => categories.add(category));
    });
    
    return Array.from(categories);
  }

  /**
   * Get health data with resilience (wrapper for integration with DataSourceIntegrationManager)
   */
  public async getHealthDataResilient<T = any>(
    category: string, 
    options: Record<string, any> = {}
  ): Promise<DataResponse<T>> {
    // This is just a passthrough method to maintain compatibility
    return this.getHealthData<T>(category, options);
  }
}
