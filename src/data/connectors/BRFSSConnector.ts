
import { BaseDataConnector } from '../../utils/BaseDataConnector';
import { GOVERNMENT_SOURCES } from '../../config/dataSourceConfig';
import { DataResponse, DataCategory, DataCategories } from '../../utils/types';
import { BRFSSSoqlOptions, BRFSSFetchOptions, BRFSSStateData } from './interfaces/BRFSSTypes';
import { BRFSSUtils } from './utils/BRFSSUtils';
import { BRFSSDataValidator } from './validators/BRFSSDataValidator';

export class BRFSSConnector extends BaseDataConnector {
  protected datasetId: string;
  protected availableYears: number[];
  protected dataCategories: DataCategories;
  
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
   * Fetches BRFSS data using the SODA API
   */
  async fetchData<T extends any[]>(options: BRFSSFetchOptions = {}): Promise<DataResponse<T>> {
    const {
      year,
      category,
      location = 'All States',
      format = 'json',
      ...otherOptions
    } = options;
    
    try {
      // Build the SOQL query
      const soqlQuery = BRFSSUtils.buildSoqlQuery({
        year,
        category,
        location,
        ...otherOptions
      });
      
      // Make the request
      const result = await this.makeRequest<T>(`/${this.datasetId}/rows.${format}`, {
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
      result.data = BRFSSUtils.normalizeFieldNames<T>(result.data);
      
      return result;
    } catch (error) {
      console.error('Error fetching BRFSS data:', error);
      throw error;
    }
  }
  
  /**
   * Fetches state-level comparison data for a health measure
   */
  async fetchStateComparison(year: number, measure: string): Promise<DataResponse<BRFSSStateData[]>> {
    try {
      const result = await this.fetchData<any[]>({
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
