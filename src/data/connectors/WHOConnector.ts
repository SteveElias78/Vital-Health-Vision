
import { API_KEYS } from '../../config/apiAuth';
import { createApiClient } from '../../utils/apiClientFactory';
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

export class WHOConnector {
  private client: ReturnType<typeof createApiClient>;
  
  constructor() {
    this.client = createApiClient('https://ghoapi.azureedge.net/api', {
      headers: {
        'X-API-Key': API_KEYS.WHO_GHO
      },
      cacheDuration: 7 * 24 * 60 * 60 * 1000 // 7 day cache
    });
  }
  
  /**
   * Fetches available health indicators
   */
  async fetchIndicators<T = any>(): Promise<DataResponse<T>> {
    try {
      const response = await this.client.get<WHOResponse>('/Indicator');
      
      return {
        data: response.data.value as unknown as T,
        metadata: {
          source: 'WHO GHO',
          endpoint: '/Indicator',
          timestamp: new Date().toISOString(),
          reliability: 0.95,
          cached: false,
          dataType: 'aggregated'
        }
      };
    } catch (error: any) {
      console.error('Error fetching WHO indicators:', error);
      throw new Error(`WHO indicators fetch failed: ${error.message}`);
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
      
      const response = await this.client.get<WHOResponse>(endpoint, { params });
      
      return {
        data: response.data.value as unknown as T,
        metadata: {
          source: 'WHO GHO',
          endpoint,
          timestamp: new Date().toISOString(),
          reliability: 0.95,
          cached: false,
          indicator: indicatorCode,
          dataType: 'aggregated',
          queryParams: options
        }
      };
    } catch (error: any) {
      console.error(`Error fetching WHO indicator ${indicatorCode}:`, error);
      throw new Error(`WHO indicator data fetch failed: ${error.message}`);
    }
  }
  
  /**
   * Fetches country list
   */
  async fetchCountries<T = any>(): Promise<DataResponse<T>> {
    try {
      const response = await this.client.get<WHOResponse>('/CountryList');
      
      return {
        data: response.data.value as unknown as T,
        metadata: {
          source: 'WHO GHO',
          endpoint: '/CountryList',
          timestamp: new Date().toISOString(),
          reliability: 0.95,
          cached: false
        }
      };
    } catch (error: any) {
      console.error('Error fetching WHO countries:', error);
      throw new Error(`WHO countries fetch failed: ${error.message}`);
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
