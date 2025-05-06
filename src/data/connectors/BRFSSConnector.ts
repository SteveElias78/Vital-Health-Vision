import { BaseDataConnector } from '../../utils/BaseDataConnector';
import { GOVERNMENT_SOURCES } from '../../config/dataSourceConfig';
import { DataResponse, DataCategory, DataCategories } from '../../utils/types';
import { BRFSSSoqlOptions, BRFSSFetchOptions, BRFSSStateData } from './interfaces/BRFSSTypes';
import { BRFSSUtils } from './utils/BRFSSUtils';
import { BRFSSDataValidator } from './validators/BRFSSDataValidator';
import { API_KEYS } from '../../config/apiAuth';

export class BRFSSConnector extends BaseDataConnector {
  protected datasetId: string;
  protected availableYears: number[];
  protected dataCategories: DataCategories;
  
  constructor() {
    super('CDC_DATA_GOV', GOVERNMENT_SOURCES.CDC_DATA_GOV);
    
    this.datasetId = GOVERNMENT_SOURCES.CDC_DATA_GOV.datasetIds?.BRFSS || 'bi63-dtpu';
    
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
   * Builds a SOQL query for BRFSS data - simplified to match JS implementation
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
      const result = await this.makeRequest<T>(`/${this.datasetId}/rows.${format}`, {
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
      
      // Normalize field names
      result.data = this.normalizeFieldNames<T>(result.data);
      
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
   * For API compatibility with the original implementation
   */
  async fetchData<T extends any[]>(options: BRFSSFetchOptions = {}): Promise<DataResponse<T>> {
    return this.fetchPrevalenceData<T>(options);
  }
  
  /**
   * Verifies data integrity for BRFSS data
   */
  override async verifyDataIntegrity(data: any): Promise<boolean> {
    return BRFSSDataValidator.verifyDataIntegrity(data);
  }
  
  /**
   * Normalizes field names for consistent usage
   */
  override normalizeFieldNames<T>(data: any): T {
    return BRFSSUtils.normalizeFieldNames<T>(data);
  }
}
