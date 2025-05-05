
import { BaseDataConnector } from '../../utils/BaseDataConnector';
import { GOVERNMENT_SOURCES } from '../../config/dataSourceConfig';

// Define interfaces for the connector
interface BRFSSDataCategory {
  description: string;
}

interface BRFSSDataCategories {
  [key: string]: BRFSSDataCategory;
}

interface BRFSSSoqlOptions {
  year?: number;
  category?: string;
  question?: string;
  location?: string | null;
  breakoutBy?: string | null;
  measure?: string | null;
  limit?: number;
}

interface BRFSSFetchOptions extends BRFSSSoqlOptions {
  location?: string;
  format?: string;
  [key: string]: any;
}

interface BRFSSStateData {
  state: string;
  value: number;
  ci_low: number;
  ci_high: number;
  [key: string]: any;
}

interface BRFSSNormalizedData {
  location?: string;
  value?: string | number;
  confidenceLow?: string | number;
  confidenceHigh?: string | number;
  breakoutCategory?: string;
  breakoutValue?: string;
  questionId?: string;
  locationCode?: string;
  [key: string]: any;
}

export class BRFSSConnector extends BaseDataConnector {
  protected datasetId: string;
  protected availableYears: number[];
  protected dataCategories: BRFSSDataCategories;
  
  constructor() {
    super('CDC_DATA_GOV', GOVERNMENT_SOURCES.CDC_DATA_GOV);
    
    this.datasetId = GOVERNMENT_SOURCES.CDC_DATA_GOV.datasetIds.BRFSS;
    
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
   * Builds a SOQL query for BRFSS data
   */
  buildSoqlQuery(options: BRFSSSoqlOptions): string {
    const {
      year,
      category,
      question,
      location = null,
      breakoutBy = null,
      measure = null,
      limit = 1000
    } = options;
    
    // Start building the query
    let query = 'SELECT * ';
    
    // Add filters
    const whereConditions: string[] = [];
    
    if (year) {
      whereConditions.push(`year = ${year}`);
    }
    
    if (category) {
      whereConditions.push(`category = '${category}'`);
    }
    
    if (question) {
      whereConditions.push(`question = '${question}'`);
    }
    
    if (location) {
      whereConditions.push(`locationdesc = '${location}'`);
    }
    
    if (breakoutBy) {
      whereConditions.push(`break_out_category = '${breakoutBy}'`);
    }
    
    if (measure) {
      whereConditions.push(`measureid = '${measure}'`);
    }
    
    // Add the WHERE clause if we have conditions
    if (whereConditions.length > 0) {
      query += `WHERE ${whereConditions.join(' AND ')} `;
    }
    
    // Add limit
    query += `LIMIT ${limit}`;
    
    return query;
  }
  
  /**
   * Fetches BRFSS data using the SODA API
   */
  async fetchData<T = any>(options: BRFSSFetchOptions = {}) {
    const {
      year,
      category,
      location = 'All States',
      format = 'json',
      ...otherOptions
    } = options;
    
    try {
      // Build the SOQL query
      const soqlQuery = this.buildSoqlQuery({
        year,
        category,
        location,
        ...otherOptions
      });
      
      // Make the request
      const result = await this.makeRequest<T[]>(`/${this.datasetId}/rows.${format}`, {
        $query: soqlQuery
      });
      
      // Add more specific metadata
      result.metadata = {
        ...result.metadata,
        year,
        category,
        location,
        format,
        dataType: 'self-reported'
      };
      
      // Normalize field names
      result.data = this.normalizeFieldNames(result.data);
      
      return result;
    } catch (error) {
      console.error('Error fetching BRFSS data:', error);
      throw error;
    }
  }
  
  /**
   * Fetches state-level comparison data for a health measure
   */
  async fetchStateComparison(year: number, measure: string) {
    try {
      const result = await this.fetchData({
        year,
        measure,
        limit: 60 // All states + territories
      });
      
      // Process data for geographical visualization
      const stateData: Record<string, BRFSSStateData> = {};
      
      result.data.forEach((row: any) => {
        const state = row.locationdesc;
        if (!stateData[state]) {
          stateData[state] = {
            state,
            value: parseFloat(row.data_value) || 0,
            ci_low: parseFloat(row.confidence_limit_low) || 0,
            ci_high: parseFloat(row.confidence_limit_high) || 0
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
   * Normalizes field names for consistent usage
   */
  override normalizeFieldNames<T = BRFSSNormalizedData[]>(data: any): T {
    if (!Array.isArray(data)) {
      return data as T;
    }
    
    // Field mapping for BRFSS
    const fieldMapping: Record<string, string> = {
      'locationdesc': 'location',
      'data_value': 'value',
      'confidence_limit_low': 'confidenceLow',
      'confidence_limit_high': 'confidenceHigh',
      'break_out_category': 'breakoutCategory',
      'break_out': 'breakoutValue',
      'questionid': 'questionId',
      'locationabbr': 'locationCode'
    };
    
    return data.map(item => {
      const normalized: Record<string, any> = {};
      
      Object.entries(item).forEach(([key, value]) => {
        const normalizedKey = fieldMapping[key] || key;
        normalized[normalizedKey] = value;
      });
      
      return normalized;
    }) as T;
  }
  
  /**
   * Verifies data integrity for BRFSS data
   */
  override async verifyDataIntegrity(data: any): Promise<boolean> {
    // Check if the data looks valid
    if (!Array.isArray(data) || data.length === 0) {
      return false;
    }
    
    // For LGBTQ data, perform extra validation
    const isLgbtqData = data.some((item: any) => 
      (item.break_out_category || item.breakoutCategory) === 'Sexual Orientation' ||
      (item.category || '').toLowerCase().includes('lgbtq') ||
      (item.question || '').toLowerCase().includes('sexual orientation') ||
      (item.question || '').toLowerCase().includes('gender identity')
    );
    
    if (isLgbtqData) {
      // For LGBTQ data, check against alternative sources or archived data
      // This is a simplified placeholder - in a real implementation,
      // you would compare against verified baseline data
      return this.verifyLgbtqDataIntegrity(data);
    }
    
    return true;
  }
  
  /**
   * Special verification for LGBTQ data integrity
   */
  async verifyLgbtqDataIntegrity(data: any[]): Promise<boolean> {
    // Simplified implementation - in reality would compare against
    // archived or alternative sources
    
    // For now, just flag 2025 data as potentially compromised
    // without additional verification
    const has2025Data = data.some((item: any) => 
      item.year === 2025 || item.year === '2025'
    );
    
    if (has2025Data) {
      console.warn('LGBTQ data from 2025 might be compromised, requiring verification');
      return false;
    }
    
    return true;
  }
}
