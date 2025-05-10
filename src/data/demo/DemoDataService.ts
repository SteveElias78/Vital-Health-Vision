import { faker } from '@faker-js/faker';

export type HealthDataCategory = 'obesity' | 'mental-health' | 'lgbtq-health' | 'chronic-disease';
export type DataSource = 'CDC' | 'WHO' | 'NHANES' | 'BRFSS' | 'census' | 'state-health-dept';
export type DemographicGroup = 'age' | 'gender' | 'race' | 'income' | 'education' | 'location';
export type TimeRange = '1y' | '3y' | '5y' | '10y';

export interface HealthDataPoint {
  id: string;
  date: string;
  value: number;
  locationdesc?: string;
  state?: string;
  category?: string;
  demographic?: string;
  source?: DataSource;
}

export interface HealthMetadata {
  source: DataSource;
  updated: string;
  reliability: number; // 0-1 score
  category: HealthDataCategory;
  description: string;
  metrics?: string[];
  methodology?: string;
}

export interface DataSourceInfo {
  id: string;
  name: string;
  description: string;
  url: string;
  reliability: number; // 0-1 score
  lastUpdated: string;
  logo?: string;
}

/**
 * Demo data service that provides synthetic health data for the application
 */
export class DemoDataService {
  // Cache generated data to keep it consistent across requests
  private static dataCache: Record<string, any> = {};

  /**
   * Get health data for a specific category
   */
  async getHealthData(
    category: HealthDataCategory,
    options: { timeRange?: TimeRange; demographic?: DemographicGroup; region?: string } = {}
  ): Promise<{ data: Record<string, any>; metadata: HealthMetadata }> {
    const cacheKey = `${category}-${JSON.stringify(options)}`;
    
    if (DemoDataService.dataCache[cacheKey]) {
      return DemoDataService.dataCache[cacheKey];
    }

    let data: Record<string, any> = {};
    let metadata: HealthMetadata;
    
    switch (category) {
      case 'obesity':
        data = this.generateObesityData(options.timeRange || '3y', options.demographic || 'age');
        metadata = {
          source: 'CDC',
          updated: '2025-04-15',
          reliability: 0.92,
          category: 'obesity',
          description: 'Obesity prevalence data across different demographics and regions',
          metrics: ['BMI > 30', 'BMI 25-29.9', 'Childhood obesity'],
          methodology: 'Survey-based collection supplemented with clinical measurements'
        };
        break;
        
      case 'mental-health':
        data = this.generateMentalHealthData(options.timeRange || '3y', options.demographic || 'age');
        metadata = {
          source: 'BRFSS',
          updated: '2025-03-22',
          reliability: 0.85,
          category: 'mental-health',
          description: 'Mental health indicators including depression, anxiety, and access to care',
          metrics: ['Depression prevalence', 'Anxiety disorders', 'Access to mental health services'],
          methodology: 'Self-reported survey data with demographic stratification'
        };
        break;
        
      case 'lgbtq-health':
        data = this.generateLGBTQHealthData(options.timeRange || '3y', options.demographic || 'age');
        metadata = {
          source: 'NHANES',
          updated: '2025-01-10',
          reliability: 0.78,
          category: 'lgbtq-health',
          description: 'Health disparities and outcomes in LGBTQ+ populations',
          metrics: ['Healthcare access', 'Mental health outcomes', 'Preventive care utilization'],
          methodology: 'Combined survey data with targeted sampling'
        };
        break;
        
      case 'chronic-disease':
        data = this.generateChronicDiseaseData(options.timeRange || '3y', options.demographic || 'age');
        metadata = {
          source: 'WHO',
          updated: '2024-12-05',
          reliability: 0.9,
          category: 'chronic-disease',
          description: 'Prevalence and trends of major chronic diseases',
          metrics: ['Diabetes', 'Heart disease', 'COPD', 'Hypertension'],
          methodology: 'Clinical data with standardized diagnostic criteria'
        };
        break;
        
      default:
        throw new Error(`Category ${category} not supported`);
    }
    
    const result = { data, metadata };
    DemoDataService.dataCache[cacheKey] = result;
    
    return result;
  }
  
  /**
   * Get information about data sources
   */
  async getDataSources(): Promise<DataSourceInfo[]> {
    if (DemoDataService.dataCache['sources']) {
      return DemoDataService.dataCache['sources'];
    }
    
    const sources: DataSourceInfo[] = [
      {
        id: 'cdc',
        name: 'Centers for Disease Control and Prevention (CDC)',
        description: 'The leading public health agency of the United States',
        url: 'https://www.cdc.gov',
        reliability: 0.95,
        lastUpdated: '2025-04-10'
      },
      {
        id: 'who',
        name: 'World Health Organization',
        description: 'The United Nations agency responsible for global public health',
        url: 'https://www.who.int',
        reliability: 0.93,
        lastUpdated: '2025-03-15'
      },
      {
        id: 'nhanes',
        name: 'National Health and Nutrition Examination Survey',
        description: 'Program of studies designed to assess the health and nutritional status of adults and children',
        url: 'https://www.cdc.gov/nchs/nhanes',
        reliability: 0.91,
        lastUpdated: '2025-02-28'
      },
      {
        id: 'brfss',
        name: 'Behavioral Risk Factor Surveillance System',
        description: 'The largest continuously conducted health survey system in the world',
        url: 'https://www.cdc.gov/brfss',
        reliability: 0.89,
        lastUpdated: '2025-02-01'
      },
      {
        id: 'census',
        name: 'U.S. Census Bureau',
        description: 'The principal agency of the U.S. Federal Statistical System',
        url: 'https://www.census.gov',
        reliability: 0.94,
        lastUpdated: '2025-01-15'
      }
    ];
    
    DemoDataService.dataCache['sources'] = sources;
    return sources;
  }
  
  /**
   * Generate obesity data matching CDC format
   */
  private generateObesityData(timeRange: TimeRange, demographicGroup: DemographicGroup): Record<string, any> {
    // Use different data sources for more realistic demo
    const nhanesData = this.generateDataPoints(50, {
      baseValue: 35,
      variance: 8,
      category: 'obesity',
      source: 'NHANES',
      demographic: demographicGroup
    });
    
    const brfssData = this.generateDataPoints(50, {
      baseValue: 36.5, // Slightly higher as self-reported
      variance: 9,
      category: 'obesity',
      source: 'BRFSS',
      demographic: demographicGroup
    });
    
    // Generate time series data for trends
    const years = timeRange === '1y' ? 1 : timeRange === '3y' ? 3 : timeRange === '5y' ? 5 : 10;
    const trends = this.generateTimeSeries('obesity', years, 32.5, 0.6);
    
    // Generate demographic breakdowns
    const demographicData = {
      age: [
        { group: '18-24', value: 26.3 },
        { group: '25-34', value: 33.5 },
        { group: '35-44', value: 38.1 },
        { group: '45-54', value: 40.2 },
        { group: '55-64', value: 42.5 },
        { group: '65+', value: 36.5 }
      ],
      gender: [
        { group: 'Male', value: 35.8 },
        { group: 'Female', value: 33.7 },
        { group: 'Non-binary', value: 29.5 }
      ],
      race: [
        { group: 'White', value: 34.2 },
        { group: 'Black', value: 40.7 },
        { group: 'Hispanic', value: 39.5 },
        { group: 'Asian', value: 21.3 },
        { group: 'Native American', value: 43.4 },
        { group: 'Pacific Islander', value: 38.3 },
        { group: 'Multiple/Other', value: 34.8 }
      ],
      income: [
        { group: 'Less than $25,000', value: 43.2 },
        { group: '$25,000-$49,999', value: 38.5 },
        { group: '$50,000-$74,999', value: 35.7 },
        { group: '$75,000-$99,999', value: 31.5 },
        { group: '$100,000+', value: 28.3 }
      ]
    };
    
    return {
      nhanes: nhanesData,
      brfss: brfssData,
      trends,
      demographics: demographicData
    };
  }
  
  /**
   * Generate mental health data
   */
  private generateMentalHealthData(timeRange: TimeRange, demographicGroup: DemographicGroup): Record<string, any> {
    // Mental health data - depression prevalence
    const nhanesData = this.generateDataPoints(50, {
      baseValue: 18.5,
      variance: 7,
      category: 'mental-health',
      source: 'NHANES',
      demographic: demographicGroup
    });
    
    const brfssData = this.generateDataPoints(50, {
      baseValue: 19.2,
      variance: 8,
      category: 'mental-health',
      source: 'BRFSS',
      demographic: demographicGroup
    });
    
    // Generate time series data for trends
    const years = timeRange === '1y' ? 1 : timeRange === '3y' ? 3 : timeRange === '5y' ? 5 : 10;
    const trends = this.generateTimeSeries('mental-health', years, 16.8, 1.2);
    
    // Generate demographic breakdowns
    const demographicData = {
      age: [
        { group: '18-24', value: 23.8 },
        { group: '25-34', value: 21.5 },
        { group: '35-44', value: 19.2 },
        { group: '45-54', value: 18.3 },
        { group: '55-64', value: 17.5 },
        { group: '65+', value: 15.2 }
      ],
      gender: [
        { group: 'Male', value: 14.3 },
        { group: 'Female', value: 21.8 },
        { group: 'Non-binary', value: 24.5 }
      ],
      race: [
        { group: 'White', value: 19.1 },
        { group: 'Black', value: 17.8 },
        { group: 'Hispanic', value: 16.5 },
        { group: 'Asian', value: 14.3 },
        { group: 'Native American', value: 22.5 },
        { group: 'Pacific Islander', value: 18.2 },
        { group: 'Multiple/Other', value: 20.7 }
      ],
      income: [
        { group: 'Less than $25,000', value: 24.3 },
        { group: '$25,000-$49,999', value: 19.8 },
        { group: '$50,000-$74,999', value: 17.2 },
        { group: '$75,000-$99,999', value: 15.4 },
        { group: '$100,000+', value: 13.1 }
      ]
    };
    
    return {
      nhanes: nhanesData,
      brfss: brfssData,
      trends,
      demographics: demographicData
    };
  }
  
  /**
   * Generate LGBTQ+ health data
   */
  private generateLGBTQHealthData(timeRange: TimeRange, demographicGroup: DemographicGroup): Record<string, any> {
    // LGBTQ+ health data - healthcare access scores
    const nhanesData = this.generateDataPoints(35, {
      baseValue: 76.3,
      variance: 12,
      category: 'lgbtq-health',
      source: 'NHANES',
      demographic: demographicGroup
    });
    
    // Use a specialized data source for more accurate LGBTQ+ health data
    const fenwayData = this.generateDataPoints(35, {
      baseValue: 74.8,
      variance: 14,
      category: 'lgbtq-health',
      source: 'BRFSS', // Using BRFSS as proxy for Fenway here
      demographic: demographicGroup
    });
    
    // Generate time series data for trends - shows improvement
    const years = timeRange === '1y' ? 1 : timeRange === '3y' ? 3 : timeRange === '5y' ? 5 : 10;
    const trends = this.generateTimeSeries('lgbtq-health', years, 71.5, 0.8);
    
    // Generate demographic breakdowns
    const demographicData = {
      age: [
        { group: '18-24', value: 72.5 },
        { group: '25-34', value: 75.3 },
        { group: '35-44', value: 77.8 },
        { group: '45-54', value: 76.2 },
        { group: '55-64', value: 73.5 },
        { group: '65+', value: 70.1 }
      ],
      identity: [
        { group: 'Lesbian', value: 78.3 },
        { group: 'Gay', value: 79.5 },
        { group: 'Bisexual', value: 74.2 },
        { group: 'Transgender', value: 67.8 },
        { group: 'Non-binary', value: 69.3 },
        { group: 'Queer', value: 73.5 }
      ],
      race: [
        { group: 'White', value: 79.2 },
        { group: 'Black', value: 73.5 },
        { group: 'Hispanic', value: 72.1 },
        { group: 'Asian', value: 74.8 },
        { group: 'Native American', value: 68.3 },
        { group: 'Multiple/Other', value: 71.5 }
      ],
      income: [
        { group: 'Less than $25,000', value: 68.7 },
        { group: '$25,000-$49,999', value: 73.2 },
        { group: '$50,000-$74,999', value: 77.5 },
        { group: '$75,000-$99,999', value: 81.3 },
        { group: '$100,000+', value: 84.5 }
      ]
    };
    
    return {
      nhanes: nhanesData,
      fenway: fenwayData,
      trends,
      demographics: demographicData
    };
  }
  
  /**
   * Generate chronic disease data
   */
  private generateChronicDiseaseData(timeRange: TimeRange, demographicGroup: DemographicGroup): Record<string, any> {
    // Chronic disease data - diabetes prevalence
    const nhanesData = this.generateDataPoints(50, {
      baseValue: 10.8,
      variance: 5,
      category: 'chronic-disease',
      source: 'NHANES',
      demographic: demographicGroup
    });
    
    const cdcData = this.generateDataPoints(50, {
      baseValue: 11.3,
      variance: 5.5,
      category: 'chronic-disease',
      source: 'CDC',
      demographic: demographicGroup
    });
    
    // Generate time series data for trends
    const years = timeRange === '1y' ? 1 : timeRange === '3y' ? 3 : timeRange === '5y' ? 5 : 10;
    const trends = this.generateTimeSeries('chronic-disease', years, 9.8, 0.3);
    
    // Generate demographic breakdowns
    const demographicData = {
      age: [
        { group: '18-24', value: 1.2 },
        { group: '25-34', value: 3.5 },
        { group: '35-44', value: 7.8 },
        { group: '45-54', value: 12.3 },
        { group: '55-64', value: 18.5 },
        { group: '65+', value: 27.2 }
      ],
      gender: [
        { group: 'Male', value: 11.2 },
        { group: 'Female', value: 10.3 }
      ],
      race: [
        { group: 'White', value: 9.3 },
        { group: 'Black', value: 14.2 },
        { group: 'Hispanic', value: 12.5 },
        { group: 'Asian', value: 10.8 },
        { group: 'Native American', value: 18.7 },
        { group: 'Multiple/Other', value: 11.5 }
      ],
      income: [
        { group: 'Less than $25,000', value: 16.3 },
        { group: '$25,000-$49,999', value: 12.8 },
        { group: '$50,000-$74,999', value: 10.5 },
        { group: '$75,000-$99,999', value: 8.7 },
        { group: '$100,000+', value: 7.2 }
      ]
    };
    
    // Add data for other chronic conditions
    const conditions = {
      diabetes: {
        prevalence: 10.8,
        growthRate: 0.3,
        byAge: [1.2, 3.5, 7.8, 12.3, 18.5, 27.2]
      },
      heartDisease: {
        prevalence: 8.6,
        growthRate: 0.1,
        byAge: [0.8, 1.5, 3.2, 8.5, 16.3, 21.8]
      },
      hypertension: {
        prevalence: 29.3,
        growthRate: 0.5,
        byAge: [3.5, 12.3, 21.8, 34.5, 48.2, 63.5]
      },
      copd: {
        prevalence: 6.2,
        growthRate: 0.2,
        byAge: [0.5, 1.2, 3.8, 7.5, 10.2, 15.3]
      }
    };
    
    return {
      nhanes: nhanesData,
      cdc: cdcData,
      trends,
      demographics: demographicData,
      conditions
    };
  }
  
  /**
   * Generate data points matching the format of health surveys
   */
  private generateDataPoints(
    count: number, 
    options: {
      baseValue: number;
      variance: number;
      category: string;
      source: string;
      demographic: string;
    }
  ): HealthDataPoint[] {
    const { baseValue, variance, category, source, demographic } = options;
    const points: HealthDataPoint[] = [];
    
    // US States
    const states = [
      "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", 
      "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", 
      "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", 
      "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", 
      "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", 
      "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
      "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", 
      "Wisconsin", "Wyoming", "District of Columbia"
    ];
    
    // Create synthetic data points
    for (let i = 0; i < Math.min(count, states.length); i++) {
      // Generate a value with normal-like distribution around baseValue
      const value = baseValue + (Math.random() * variance * 2 - variance);
      
      points.push({
        id: faker.string.uuid(),
        date: faker.date.between({ from: '2022-01-01', to: '2025-04-30' }).toISOString(),
        value: +value.toFixed(1),
        locationdesc: states[i],
        state: states[i].slice(0, 2).toUpperCase(),
        category,
        demographic,
        source: source as DataSource
      });
    }
    
    return points;
  }
  
  /**
   * Generate time series data for historical trends
   */
  private generateTimeSeries(category: string, years: number, startValue: number, annualChange: number): any[] {
    const data: any[] = [];
    const startDate = new Date(2025 - years, 0, 1); // Start from beginning of appropriate year
    const endDate = new Date(2025, 3, 30); // End at April 2025
    
    // For realistic quarterly data
    let currentDate = new Date(startDate);
    let currentValue = startValue;
    
    while (currentDate <= endDate) {
      const monthsElapsed = (currentDate.getFullYear() - startDate.getFullYear()) * 12 + 
                           (currentDate.getMonth() - startDate.getMonth());
      const yearsElapsed = monthsElapsed / 12;
      
      // Add some random variation to the trend
      const randomFactor = (Math.random() * 0.4 - 0.2) * annualChange;
      const value = startValue + (annualChange * yearsElapsed) + randomFactor;
      
      data.push({
        date: new Date(currentDate).toISOString(),
        value: +value.toFixed(1),
        category
      });
      
      // Advance by 3 months
      currentDate = new Date(currentDate);
      currentDate.setMonth(currentDate.getMonth() + 3);
      currentValue += (annualChange / 4); // Quarter of annual change
    }
    
    return data;
  }
}

// Export a singleton instance
export const demoDataService = new DemoDataService();
