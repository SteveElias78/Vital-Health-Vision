
import axios from 'axios';
import { ALTERNATIVE_SOURCES, COMPROMISED_CATEGORIES } from '../../config/dataSourceConfig';
import { AUTH_CONFIG } from '../../config/dataSourceConfig';
import { getApiKey, getOAuthConfig } from '../../config/apiAuth';
import { BaseDataConnector } from '../../utils/BaseDataConnector';
import { DataResponse } from '../../utils/types';

interface AuthToken {
  token: string;
  expiry: number;
}

interface SourceStatus {
  available: boolean;
  lastChecked: Date | null;
  lastSuccessful: Date | null;
  failureCount: number;
}

interface CachedData {
  data: any;
  timestamp: number;
  source: string;
}

interface SourceMapping {
  source: string;
  endpoint: string;
}

interface DiscrepancyInfo {
  type: string;
  field?: string;
  index?: number;
  primary: any;
  comparison: any;
}

interface ValidationResult {
  sourcesCompared: number;
  discrepancies: Array<{
    source: string;
    discrepancies: DiscrepancyInfo[];
  }>;
  confidenceScore: number;
}

export class MultiSourceDataConnector extends BaseDataConnector {
  private authTokens: Record<string, AuthToken>;
  private cachedData: Record<string, CachedData>;
  private dataSourceStatus: Record<string, SourceStatus>;
  
  constructor() {
    super('MULTI_SOURCE', {
      baseUrl: '',
      reliability: 0.85,
      categories: COMPROMISED_CATEGORIES,
      cacheEnabled: true
    });
    
    this.authTokens = {};
    this.cachedData = {};
    this.dataSourceStatus = {};
    this.initializeSourceStatus();
  }

  /**
   * Initialize the status tracking for all alternative data sources
   */
  private initializeSourceStatus() {
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
   * Get authentication token for sources that require it
   */
  private async getAuthToken(source: string): Promise<string | null> {
    const sourceConfig = ALTERNATIVE_SOURCES[source];
    
    // Return existing token if available
    if (this.authTokens[source] && this.authTokens[source].expiry > Date.now()) {
      return this.authTokens[source].token;
    }
    
    if (!sourceConfig || !sourceConfig.requiresAuth) {
      return null;
    }
    
    try {
      // Handle different auth types
      if (sourceConfig.authType === 'apiKey') {
        const apiKey = getApiKey(source) || AUTH_CONFIG[source]?.apiKey;
        if (!apiKey) {
          console.warn(`No API key found for ${source}`);
          return null;
        }
        
        this.authTokens[source] = {
          token: apiKey,
          expiry: Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
        };
        return apiKey;
      } else if (sourceConfig.authType === 'oauth') {
        const authConfig = AUTH_CONFIG[source];
        const oauthConfig = getOAuthConfig(source);
        
        if (!authConfig && !oauthConfig) {
          console.warn(`No OAuth config found for ${source}`);
          return null;
        }
        
        const tokenUrl = oauthConfig?.tokenUrl || authConfig.tokenUrl as string;
        const clientId = oauthConfig?.clientId || authConfig.clientId;
        const clientSecret = oauthConfig?.clientSecret || authConfig.clientSecret;
        
        const response = await axios.post(tokenUrl, {
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: 'client_credentials',
        });
        
        this.authTokens[source] = {
          token: response.data.access_token,
          expiry: Date.now() + (response.data.expires_in * 1000),
        };
        
        return response.data.access_token;
      }
    } catch (error) {
      console.error(`Failed to get auth token for ${source}:`, error);
    }
    
    return null;
  }

  /**
   * Update the status of a data source
   */
  private updateSourceStatus(source: string, success: boolean) {
    const now = new Date();
    this.dataSourceStatus[source].lastChecked = now;
    
    if (success) {
      this.dataSourceStatus[source].lastSuccessful = now;
      this.dataSourceStatus[source].failureCount = 0;
      this.dataSourceStatus[source].available = true;
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
  private async getDataFromSource(source: string, endpoint: string, params: Record<string, any> = {}): Promise<DataResponse> {
    const sourceConfig = ALTERNATIVE_SOURCES[source];
    
    if (!sourceConfig) {
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
        timeout: 10000, // 10 second timeout
      });
      
      // Update source status
      this.updateSourceStatus(source, true);
      
      // Cache the data
      const cacheKey = this.getCacheKey(url, params);
      this.cachedData[cacheKey] = {
        data: response.data,
        timestamp: Date.now(),
        source,
      };
      
      return {
        data: response.data,
        metadata: {
          source,
          endpoint,
          timestamp: new Date().toISOString(),
          reliability: sourceConfig.reliability || 0.7,
          cached: false
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
   * Get data with resilient fallback to multiple sources
   */
  public async getData(dataCategory: string, params: Record<string, any> = {}): Promise<DataResponse> {
    // Map of data categories to source/endpoint pairs in priority order
    const dataSourceMapping: Record<string, SourceMapping[]> = {
      'lgbtq-health': [
        { source: 'FENWAY_INSTITUTE', endpoint: 'lgbtqHealthDisparities' },
        { source: 'THE_19TH_ARCHIVE', endpoint: 'lgbtqYouthData' },
      ],
      'maternal-health': [
        { source: 'THE_19TH_ARCHIVE', endpoint: 'maternalMortality' },
      ],
      // Map to other categories as needed
      'obesity': [
        { source: 'FENWAY_INSTITUTE', endpoint: 'minorityHealthMetrics' },
      ],
      'mental-health': [
        { source: 'FENWAY_INSTITUTE', endpoint: 'lgbtqHealthDisparities' },
      ]
    };
    
    const sourcesToTry = dataSourceMapping[dataCategory];
    
    if (!sourcesToTry || sourcesToTry.length === 0) {
      throw new Error(`No data sources defined for category: ${dataCategory}`);
    }
    
    // Try sources in priority order
    let lastError: Error | null = null;
    let combinedData: any = null;
    const attemptedSources: Array<{
      source: string;
      endpoint: string;
      status: string;
      error?: string;
    }> = [];
    
    for (const { source, endpoint } of sourcesToTry) {
      // Skip sources marked as unavailable
      if (!this.dataSourceStatus[source]?.available) {
        continue;
      }
      
      try {
        const result = await this.getDataFromSource(source, endpoint, params);
        
        // If this is our first successful source
        if (!combinedData) {
          combinedData = {
            data: result.data,
            metadata: {
              primarySource: source,
              timestamp: new Date().toISOString(),
              reliability: ALTERNATIVE_SOURCES[source]?.reliability || 0.7,
              sources: [{ source, endpoint, status: 'success' }],
            }
          };
        } else {
          // Add additional data for comparison/validation
          combinedData.metadata.sources.push({ source, endpoint, status: 'success' });
          combinedData.additionalSources = combinedData.additionalSources || [];
          combinedData.additionalSources.push({
            source,
            data: result.data,
          });
        }
        
        attemptedSources.push({ source, endpoint, status: 'success' });
      } catch (error: any) {
        lastError = error;
        attemptedSources.push({ 
          source, 
          endpoint, 
          status: 'error', 
          error: error.message 
        });
      }
    }
    
    // If we couldn't get data from any source
    if (!combinedData) {
      const error = new Error(`Failed to fetch data for ${dataCategory} from all available sources`);
      (error as any).attemptedSources = attemptedSources;
      throw error;
    }
    
    // If we got data from multiple sources, normalize and validate it
    if (combinedData.additionalSources && combinedData.additionalSources.length > 0) {
      combinedData = this.normalizeAndValidateData(combinedData);
    }
    
    return combinedData;
  }

  /**
   * Normalize and validate data from multiple sources
   */
  private normalizeAndValidateData(combinedData: any): DataResponse {
    // Get primary data
    const primaryData = combinedData.data;
    const additionalSources = combinedData.additionalSources || [];
    
    // Add validation metadata
    combinedData.metadata.validation = {
      sourcesCompared: additionalSources.length + 1,
      discrepancies: [],
      confidenceScore: 1.0,
    };
    
    // For each additional source, compare with primary
    additionalSources.forEach((sourceData: any) => {
      const discrepancies = this.compareDatasets(primaryData, sourceData.data);
      
      if (discrepancies.length > 0) {
        combinedData.metadata.validation.discrepancies.push({
          source: sourceData.source,
          discrepancies,
        });
        
        // Reduce confidence score based on discrepancies
        const discrepancyImpact = discrepancies.length / 100;
        combinedData.metadata.validation.confidenceScore -= discrepancyImpact;
      }
    });
    
    // Ensure confidence score is within bounds
    combinedData.metadata.validation.confidenceScore = Math.max(
      0, 
      Math.min(1, combinedData.metadata.validation.confidenceScore)
    );
    
    return combinedData;
  }

  /**
   * Compare two datasets and identify discrepancies
   */
  private compareDatasets(primaryData: any, comparisonData: any): DiscrepancyInfo[] {
    const discrepancies: DiscrepancyInfo[] = [];
    
    // If comparing arrays of data points
    if (Array.isArray(primaryData) && Array.isArray(comparisonData)) {
      // Check if arrays have different lengths
      if (primaryData.length !== comparisonData.length) {
        discrepancies.push({
          type: 'length',
          primary: primaryData.length,
          comparison: comparisonData.length,
        });
      }
      
      // For simplicity, just check the first 10 items
      const checkLimit = Math.min(10, primaryData.length, comparisonData.length);
      
      for (let i = 0; i < checkLimit; i++) {
        const primaryItem = primaryData[i];
        const comparisonItem = comparisonData[i];
        
        // Compare simple objects
        if (typeof primaryItem === 'object' && typeof comparisonItem === 'object') {
          Object.keys(primaryItem).forEach(key => {
            if (comparisonItem[key] !== undefined && 
                primaryItem[key] !== comparisonItem[key]) {
              discrepancies.push({
                type: 'value',
                field: key,
                index: i,
                primary: primaryItem[key],
                comparison: comparisonItem[key],
              });
            }
          });
        }
      }
    } else if (typeof primaryData === 'object' && typeof comparisonData === 'object') {
      // Compare objects
      Object.keys(primaryData).forEach(key => {
        if (comparisonData[key] !== undefined && 
            primaryData[key] !== comparisonData[key]) {
          discrepancies.push({
            type: 'value',
            field: key,
            primary: primaryData[key],
            comparison: comparisonData[key],
          });
        }
      });
    }
    
    return discrepancies;
  }

  /**
   * Get health data with normalizing field names to standardize values
   */
  public async getHealthData(dataCategory: string, params: Record<string, any> = {}): Promise<DataResponse> {
    const rawData = await this.getData(dataCategory, params);
    
    // Normalize the data fields to a standard format
    const normalizedData = this.normalizeHealthData(rawData, dataCategory);
    
    return {
      ...normalizedData,
      metadata: {
        ...rawData.metadata,
        normalized: true,
        originalFieldCount: this.countFields(rawData.data),
        normalizedFieldCount: this.countFields(normalizedData.data),
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
   * Normalize health data field names and formats
   */
  private normalizeHealthData(rawData: DataResponse, dataCategory: string): DataResponse {
    const data = rawData.data;
    
    // Field mapping for different data categories
    const fieldMappings: Record<string, Record<string, string>> = {
      'lgbtq-health': {
        'sexual_orientation': 'sexualOrientation',
        'sexual_identity': 'sexualOrientation',
        'sex_orientation': 'sexualOrientation',
        'gender_identity': 'genderIdentity',
        'gender': 'genderIdentity',
        'ethnicity': 'race',
        'race_ethnicity': 'race',
        'depression_rate': 'depressionRate',
        'depression_pct': 'depressionRate',
        'anxiety_rate': 'anxietyRate',
        'anxiety_pct': 'anxietyRate',
        'suicide_attempt': 'suicideAttemptRate',
        'suicide_attempt_rate': 'suicideAttemptRate',
        'health_insurance': 'healthInsuranceRate',
        'insurance_rate': 'healthInsuranceRate',
      },
      'youth-risk-behavior': {
        'bullied_at_school': 'bulliedAtSchool',
        'school_bullying': 'bulliedAtSchool',
        'electronic_bullying': 'bulliedElectronically',
        'cyber_bullying': 'bulliedElectronically',
        'felt_sad_hopeless': 'feltSadOrHopeless',
        'depression': 'feltSadOrHopeless',
        'considered_suicide': 'consideredSuicide',
        'suicidal_ideation': 'consideredSuicide',
      },
      'mental-health': {
        'depression_rate': 'depressionRate',
        'anxiety_rate': 'anxietyRate',
        'suicide_attempt': 'suicideAttemptRate',
        'felt_sad_hopeless': 'feltSadOrHopeless',
      },
      'obesity': {
        'bmi': 'bodyMassIndex',
        'overweight': 'overweightRate',
        'obesity': 'obesityRate',
      },
    };
    
    // Get the mapping for this category
    const mapping = fieldMappings[dataCategory] || {};
    
    // Create normalized data structure
    let normalizedData;
    
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
        (normalizedData as Record<string, any>)[normalizedKey] = data[key];
      });
    } else {
      // If not an object or array, return as is
      normalizedData = data;
    }
    
    return {
      data: normalizedData,
      metadata: rawData.metadata,
    };
  }
  
  /**
   * Get source status information
   */
  public getSourceStatus(): Record<string, SourceStatus> {
    return this.dataSourceStatus;
  }
  
  /**
   * Get available data categories
   */
  public getAvailableDataCategories(): string[] {
    return [
      'lgbtq-health',
      'youth-risk-behavior',
      'maternal-health',
      'mental-health',
      'obesity'
    ];
  }
}
