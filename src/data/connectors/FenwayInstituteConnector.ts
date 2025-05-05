
import { BaseDataConnector } from '../../utils/BaseDataConnector';
import { ALTERNATIVE_SOURCES } from '../../config/dataSourceConfig';
import { DataResponse } from '../../utils/types';

export class FenwayInstituteConnector extends BaseDataConnector {
  constructor() {
    super('FENWAY_INSTITUTE', ALTERNATIVE_SOURCES.FENWAY_INSTITUTE);
  }
  
  /**
   * Fetches LGBTQ health disparities data
   */
  async fetchLgbtqHealthDisparities<T = any>(params: Record<string, any> = {}): Promise<DataResponse<T>> {
    try {
      const endpoint = ALTERNATIVE_SOURCES.FENWAY_INSTITUTE.endpoints.lgbtqHealthDisparities;
      
      const result = await this.makeRequest<T>(endpoint, params);
      
      // Add specific metadata
      result.metadata = {
        ...result.metadata,
        dataType: 'research',
        category: 'lgbtq-health-disparities'
      };
      
      return result;
    } catch (error) {
      console.error('Error fetching LGBTQ health disparities data:', error);
      throw error;
    }
  }
  
  /**
   * Fetches SOGI best practices data
   */
  async fetchSogiBestPractices<T = any>(params: Record<string, any> = {}): Promise<DataResponse<T>> {
    try {
      const endpoint = ALTERNATIVE_SOURCES.FENWAY_INSTITUTE.endpoints.sogiBestPractices;
      
      const result = await this.makeRequest<T>(endpoint, params);
      
      // Add specific metadata
      result.metadata = {
        ...result.metadata,
        dataType: 'research',
        category: 'sogi-best-practices'
      };
      
      return result;
    } catch (error) {
      console.error('Error fetching SOGI best practices data:', error);
      throw error;
    }
  }
  
  /**
   * Normalizes Fenway Institute field names to match our schema
   */
  normalizeFieldNames<T = any>(data: any): T {
    if (!Array.isArray(data)) {
      return data as T;
    }
    
    // Field mapping
    const fieldMapping: Record<string, string> = {
      'sexual_orientation': 'sexualOrientation',
      'gender_identity': 'genderIdentity',
      'depression_rate': 'depressionRate',
      'anxiety_rate': 'anxietyRate',
      'access_to_care': 'healthcareAccess',
      'race_ethnicity': 'raceEthnicity',
      'age_group': 'ageGroup'
    };
    
    return data.map((item: Record<string, any>) => {
      const normalized: Record<string, any> = {};
      
      Object.entries(item).forEach(([key, value]) => {
        const normalizedKey = fieldMapping[key] || key;
        normalized[normalizedKey] = value;
      });
      
      return normalized;
    }) as T;
  }
}
