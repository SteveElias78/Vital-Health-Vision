
import { BaseDataConnector } from './BaseDataConnector';
import { ConnectorConfig } from './types';

/**
 * WHO Data Connector for accessing World Health Organization Global Health Observatory data
 */
export class WHOConnector extends BaseDataConnector {
  constructor(config: ConnectorConfig = {}) {
    super({
      name: 'WHO Global Health Observatory',
      sourceType: 'global',
      tier: '1A',
      baseUrl: 'https://www.who.int/data/gho',
      ...config
    });
  }

  /**
   * Fetch data from WHO API
   * @param params - Parameters to customize the request
   * @returns Promise with the fetched data
   */
  async fetchData(params: Record<string, any> = {}): Promise<any> {
    const { indicator = 'WHOSIS_000001', country = null, year = 2023 } = params;
    const cacheKey = this.generateCacheKey({ indicator, country, year });
    
    if (this.hasCachedData(cacheKey)) {
      return this.getCachedData(cacheKey);
    }
    
    try {
      // In a real implementation, this would make an actual API call
      console.log(`Fetching WHO data: indicator=${indicator}, country=${country || 'all'}, year=${year}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock data based on the requested parameters
      const data = this.generateMockWHOData(indicator, country, year);
      
      // Update lastFetched timestamp
      this.lastFetched = new Date().toISOString();
      
      // Cache the result
      this.cacheData(cacheKey, data);
      
      return data;
    } catch (error) {
      console.error('Error fetching WHO data:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to fetch WHO data: ${error.message}`);
      }
      throw new Error('Failed to fetch WHO data: Unknown error');
    }
  }

  /**
   * Generate mock WHO data for demonstration
   * @private
   */
  private generateMockWHOData(indicator: string, country: string | null, year: number): any {
    // This would be replaced with actual API calls in production
    const countries = country ? [country] : ['USA', 'GBR', 'CAN', 'DEU', 'FRA', 'JPN', 'AUS', 'BRA', 'IND', 'ZAF'];
    
    let indicatorName = '';
    let baseValue = 0;
    let unit = '';
    
    // Set values based on the requested indicator
    switch (indicator) {
      case 'WHOSIS_000001': // Life expectancy
        indicatorName = 'Life expectancy at birth';
        baseValue = 72;
        unit = 'years';
        break;
      case 'MDG_0000000001': // Maternal mortality
        indicatorName = 'Maternal mortality ratio';
        baseValue = 211;
        unit = 'per 100,000 live births';
        break;
      case 'NCD_BMI_30A': // Obesity
        indicatorName = 'Prevalence of obesity among adults';
        baseValue = 22;
        unit = '%';
        break;
      default:
        indicatorName = 'Health indicator';
        baseValue = 50;
        unit = '';
    }
    
    // Generate mock data for each country
    return {
      indicator,
      indicatorName,
      year,
      unit,
      data: countries.map(countryCode => {
        // Add some variation based on country
        const countryIndex = countries.indexOf(countryCode);
        const value = baseValue + (countryIndex * 2) + (Math.random() * 5 - 2.5);
        
        return {
          country: countryCode,
          value,
          confidenceInterval: [value - 2, value + 2]
        };
      }),
      metadata: {
        source: 'WHO Global Health Observatory',
        lastUpdated: new Date().toISOString(),
        description: `World Health Organization data for ${indicatorName}`,
        url: `https://www.who.int/data/gho/data/indicators/${indicator}`
      }
    };
  }
}
