import axios from 'axios';
import Papa from 'papaparse';
import { BaseDataConnector } from '../../utils/BaseDataConnector';
import { GOVERNMENT_SOURCES } from '../../config/dataSourceConfig';
import { DataResponse } from '../../utils/types';
import { BRFSSSoqlOptions, BRFSSStateData } from './interfaces/BRFSSTypes';

interface BRFSSFetchOptions {
  year?: number;
  topic?: string;
  question?: string;
  location?: string | null;
  breakoutBy?: string | null;
  limit?: number;
  format?: string;
  [key: string]: any;
}

export class BRFSSConnectorImpl extends BaseDataConnector {
  protected datasetId: string;
  protected availableYears: number[];
  protected dataCategories: Record<string, { description: string }>;
  
  constructor() {
    super('CDC_DATA_GOV', GOVERNMENT_SOURCES.CDC_DATA_GOV);
    
    this.datasetId = GOVERNMENT_SOURCES.CDC_DATA_GOV.datasetIds?.BRFSS || 'dttw-5yxu';
    
    // Available years
    this.availableYears = [
      2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 
      2017, 2016, 2015, 2014, 2013, 2012, 2011
    ];
    
    // Data categories
    this.dataCategories = {
      alcohol: { description: 'Alcohol consumption, binge drinking' },
      chronic: { description: 'Chronic health conditions including asthma, COPD' },
      demographics: { description: 'Age, gender, race, income, education' },
      diabetesCare: { description: 'Diabetes management, testing, education' },
      disability: { description: 'Physical, cognitive, and activity limitations' },
      healthcareAccess: { description: 'Insurance coverage, medical costs' },
      mentalHealth: { description: 'Depression, anxiety, mental health treatment' },
      oralHealth: { description: 'Dental visits, tooth loss, dental care' },
      overweight: { description: 'BMI categories, obesity, weight control' },
      physicalActivity: { description: 'Exercise frequency, intensity' },
      tobacco: { description: 'Smoking status, cessation attempts, e-cigarettes' },
      lgbtq: { description: 'SOGI questions where available' }
    };
  }
  
  getAvailableYears(): number[] {
    return this.availableYears;
  }
  
  getDataCategories(): Record<string, { description: string }> {
    return this.dataCategories;
  }
  
  /**
   * General method to fetch health data with various parameters
   */
  async fetchHealthData<T = any>(params?: Record<string, any>): Promise<DataResponse<T>> {
    try {
      const options: BRFSSFetchOptions = {
        year: params?.year || 2023,
        topic: params?.topic || 'overweight',
        ...params
      };
      
      return this.fetchPrevalenceData<T>(options);
    } catch (error) {
      console.error('Error fetching BRFSS health data:', error);
      throw error;
    }
  }
  
  /**
   * Builds a SOQL query for BRFSS data
   */
  private buildSoqlQuery(options: BRFSSFetchOptions): string {
    const {
      year,
      topic,
      question,
      location = null,
      breakoutBy = null,
      limit = 1000
    } = options;
    
    // Start building the query
    let query = 'SELECT * WHERE 1=1';
    
    if (year) {
      query += ` AND year = ${year}`;
    }
    
    if (topic) {
      query += ` AND topic = '${topic}'`;
    }
    
    if (question) {
      query += ` AND question = '${question}'`;
    }
    
    if (location) {
      query += ` AND locationdesc = '${location}'`;
    }
    
    if (breakoutBy) {
      query += ` AND break_out_category = '${breakoutBy}'`;
    }
    
    // Add limit
    query += ` LIMIT ${limit}`;
    
    return query;
  }

  /**
   * Fetches BRFSS prevalence data using the SODA API
   */
  async fetchPrevalenceData<T = any[]>(options: BRFSSFetchOptions = {}): Promise<DataResponse<T>> {
    const {
      format = 'json',
      ...otherOptions
    } = options;
    
    try {
      // Build the SOQL query
      const soqlQuery = this.buildSoqlQuery(otherOptions);
      
      // Make the request
      const endpoint = `/${this.datasetId}/rows.${format}`;
      const result = await this.makeRequest<T>(endpoint, {
        $query: soqlQuery
      });
      
      // Add more specific metadata
      result.metadata = {
        ...result.metadata,
        source: 'BRFSS',
        queryParams: options,
        fetchTime: new Date().toISOString(),
        rowCount: Array.isArray(result.data) ? result.data.length : 0,
        dataType: 'self-reported'
      };
      
      return result;
    } catch (error: any) {
      console.error('Error fetching BRFSS data:', error);
      throw new Error(`BRFSS data fetch failed: ${error.message}`);
    }
  }
  
  /**
   * Fetches state-level comparison data for a health measure
   */
  async fetchStateComparison(year: number, measure: string): Promise<DataResponse<BRFSSStateData[]>> {
    try {
      const result = await this.fetchPrevalenceData<any[]>({
        year,
        question: measure,
        limit: 60 // All states + territories
      });
      
      // Process data for geographical visualization
      const stateData: Record<string, BRFSSStateData> = {};
      
      result.data.forEach((row: any) => {
        const state = row.locationdesc || row.location;
        if (!stateData[state]) {
          stateData[state] = {
            state,
            value: parseFloat(row.data_value || row.value) || 0,
            ci_low: parseFloat(row.confidence_limit_low || row.confidenceLow) || 0,
            ci_high: parseFloat(row.confidence_limit_high || row.confidenceHigh) || 0
          };
        }
      });
      
      return {
        data: Object.values(stateData),
        metadata: {
          ...result.metadata,
          measure
        }
      };
    } catch (error) {
      console.error('Error fetching state comparison:', error);
      throw error;
    }
  }
  
  /**
   * Fetches mental health data for a specific year and location
   */
  async fetchMentalHealthData<T = any[]>(year: number, location: string = 'All States', options: Record<string, any> = {}): Promise<DataResponse<T>> {
    return this.fetchPrevalenceData<T>({
      year,
      topic: 'mentalHealth',
      location,
      ...options
    });
  }
  
  /**
   * Fetches risk behavior data (alcohol, tobacco, etc.) for a specific year and location
   */
  async fetchRiskBehaviorsData<T = any>(year: number, location: string = 'All States', behaviors: string[] = ['alcohol', 'tobacco'], options: Record<string, any> = {}): Promise<DataResponse<T>> {
    try {
      // Fetch each behavior category
      const promises = behaviors.map(behavior => 
        this.fetchPrevalenceData({
          year,
          topic: behavior,
          location,
          ...options
        })
      );
      
      const results = await Promise.all(promises);
      
      // Combine into a single result
      const combinedData: Record<string, any> = {};
      
      results.forEach((result, index) => {
        const behavior = behaviors[index];
        combinedData[behavior] = result.data;
      });
      
      // Create a combined result with metadata
      return {
        data: combinedData as T,
        metadata: {
          source: 'BRFSS',
          endpoint: `/risk-behaviors/${year}/${location}`,
          timestamp: new Date().toISOString(),
          reliability: 0.9,
          cached: false,
          year,
          location,
          behaviors,
          dataType: 'riskBehaviors'
        }
      };
    } catch (error) {
      console.error(`Error fetching risk behaviors data:`, error);
      throw error;
    }
  }
  
  /**
   * Processes BRFSS data for geographic visualization
   */
  processDataForGeographic(data: any[], measureField: string = 'data_value'): any {
    // This function transforms BRFSS data into a format suitable for geographic visualizations
    const geoData = {
      type: 'FeatureCollection',
      features: []
    };
    
    // Group data by state/location
    const locationMap = new Map<string, any[]>();
    
    data.forEach(record => {
      const location = record.locationdesc;
      
      if (!locationMap.has(location)) {
        locationMap.set(location, []);
      }
      
      locationMap.get(location)?.push(record);
    });
    
    // Create features for each location
    locationMap.forEach((records, location) => {
      // Skip national aggregates for state maps
      if (location === 'All States' || location === 'National') {
        return;
      }
      
      // Calculate average value for the location
      let totalValue = 0;
      let validRecordCount = 0;
      
      records.forEach(record => {
        const value = parseFloat(record[measureField]);
        if (!isNaN(value)) {
          totalValue += value;
          validRecordCount++;
        }
      });
      
      const averageValue = validRecordCount > 0 ? totalValue / validRecordCount : null;
      
      // Create a feature for this location
      geoData.features.push({
        type: 'Feature',
        properties: {
          name: location,
          value: averageValue,
          recordCount: records.length,
          records: records,
        },
        geometry: {
          type: 'Polygon',
          coordinates: []
        }
      });
    });
    
    return geoData;
  }
}
