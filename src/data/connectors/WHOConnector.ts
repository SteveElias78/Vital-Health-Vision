
import { BaseDataConnector } from '../../utils/BaseDataConnector';
import { GOVERNMENT_SOURCES } from '../../config/dataSourceConfig';
import { DataResponse } from '../../utils/types';

interface IndicatorOptions {
  dimension?: string | null;
  filter?: string | null;
  year?: number | null;
}

interface WHOResponse {
  value: any[];
  [key: string]: any;
}

export class WHOConnector extends BaseDataConnector {
  constructor() {
    super('WHO_GHO', GOVERNMENT_SOURCES.WHO_GHO);
  }
  
  /**
   * Fetches available health indicators
   */
  async fetchIndicators<T = any>(): Promise<DataResponse<T>> {
    try {
      const result = await this.makeRequest<WHOResponse>('/Indicator');
      
      return {
        data: result.data.value as unknown as T,
        metadata: {
          ...result.metadata,
          dataType: 'aggregated'
        }
      };
    } catch (error) {
      console.error('Error fetching WHO indicators:', error);
      throw error;
    }
  }
  
  /**
   * Fetches data for a specific indicator
   */
  async fetchIndicatorData<T = any>(
    indicatorCode: string, 
    options: IndicatorOptions = {}
  ): Promise<DataResponse<T>> {
    const {
      dimension = null,
      filter = null,
      year = null
    } = options;
    
    try {
      const endpoint = `/Indicator/${indicatorCode}/Data`;
      const params: Record<string, any> = {};
      
      if (dimension) {
        params.$dimension = dimension;
      }
      
      if (filter) {
        params.$filter = filter;
      }
      
      if (year) {
        // Add year filter
        const yearFilter = `TimeDim eq ${year}`;
        params.$filter = params.$filter 
          ? `${params.$filter} and ${yearFilter}` 
          : yearFilter;
      }
      
      const result = await this.makeRequest<WHOResponse>(endpoint, params);
      
      return {
        data: result.data.value as unknown as T,
        metadata: {
          ...result.metadata,
          indicator: indicatorCode,
          dataType: 'aggregated',
          queryParams: options
        }
      };
    } catch (error) {
      console.error(`Error fetching WHO indicator ${indicatorCode}:`, error);
      throw error;
    }
  }
  
  /**
   * Fetches country list
   */
  async fetchCountries<T = any>(): Promise<DataResponse<T>> {
    try {
      const result = await this.makeRequest<WHOResponse>('/CountryList');
      
      return {
        data: result.data.value as unknown as T,
        metadata: {
          ...result.metadata
        }
      };
    } catch (error) {
      console.error('Error fetching WHO countries:', error);
      throw error;
    }
  }
  
  /**
   * Normalizes field names for consistent usage
   */
  normalizeFieldNames<T = any>(data: any): T {
    if (!Array.isArray(data)) {
      return data as T;
    }
    
    // Field mapping for WHO data
    const fieldMapping: Record<string, string> = {
      'IndicatorCode': 'indicatorCode',
      'Indicator': 'indicatorName',
      'Value': 'value',
      'NumericValue': 'numericValue',
      'Low': 'valueLow',
      'High': 'valueHigh',
      'SpatialDimType': 'regionType',
      'SpatialDim': 'regionCode',
      'TimeDimType': 'timeType',
      'TimeDim': 'year',
      'Dim1Type': 'dimension1Type',
      'Dim1': 'dimension1',
      'Dim2Type': 'dimension2Type',
      'Dim2': 'dimension2',
      'Dim3Type': 'dimension3Type',
      'Dim3': 'dimension3',
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
