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
  ): Promise<{ data: Record<string, HealthDataPoint[]>; metadata: HealthMetadata }> {
    const cacheKey = `${category}-${JSON.stringify(options)}`;
    
    if (DemoDataService.dataCache[cacheKey]) {
      return DemoDataService.dataCache[cacheKey];
    }

    let data: Record<string, HealthDataPoint[]> = {};
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
        description: 'Federal agency responsible for protecting public health through control and prevention of disease.',
        url: 'https://www.cdc.gov/datastatistics/',
        reliability: 0.95,
        lastUpdated: '2025-04-15',
      },
      {
        id: 'who',
        name: 'World Health Organization',
        description: 'Specialized agency of the United Nations responsible for international public health.',
        url: 'https://www.who.int/data',
        reliability: 0.93,
        lastUpdated: '2024-12-05',
      },
      {
        id: 'nhanes',
        name: 'National Health and Nutrition Examination Survey',
        description: 'Program designed to assess the health and nutritional status of adults and children in the United States.',
        url: 'https://www.cdc.gov/nchs/nhanes/',
        reliability: 0.91,
        lastUpdated: '2025-01-10',
      },
      {
        id: 'brfss',
        name: 'Behavioral Risk Factor Surveillance System',
        description: 'Nation\'s premier system of health-related telephone surveys that collect state data about U.S. residents.',
        url: 'https://www.cdc.gov/brfss/',
        reliability: 0.87,
        lastUpdated: '2025-03-22',
      },
      {
        id: 'census',
        name: 'U.S. Census Bureau',
        description: 'Principal agency of the U.S. Federal Statistical System responsible for producing demographic data.',
        url: 'https://www.census.gov/data.html',
        reliability: 0.96,
        lastUpdated: '2024-10-18',
      },
    ];
    
    DemoDataService.dataCache['sources'] = sources;
    return sources;
  }
  
  // Helper methods to generate synthetic data
  
  private generateTimeSeriesData(
    years: number, 
    startValue: number, 
    trend: 'increasing' | 'decreasing' | 'stable' = 'increasing',
    volatility: number = 0.1
  ): HealthDataPoint[] {
    const points: HealthDataPoint[] = [];
    const monthsTotal = years * 12;
    let currentValue = startValue;
    
    // Define trend factor
    const trendFactor = trend === 'increasing' 
      ? 0.005 
      : trend === 'decreasing' 
        ? -0.005 
        : 0;
    
    for (let i = 0; i < monthsTotal; i++) {
      // Calculate date
      const date = new Date();
      date.setMonth(date.getMonth() - (monthsTotal - i));
      
      // Apply trend and randomness
      currentValue = currentValue * (1 + trendFactor);
      const randomFactor = 1 + ((Math.random() - 0.5) * volatility);
      const value = Math.max(0, currentValue * randomFactor);
      
      points.push({
        id: faker.string.uuid(),
        date: date.toISOString().split('T')[0],
        value: parseFloat(value.toFixed(2)),
      });
    }
    
    return points;
  }
  
  private generateRegionalData(
    metric: string,
    baseValue: number,
    spread: number = 0.2
  ): HealthDataPoint[] {
    const states = [
      'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
      'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
      'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
      'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
      'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri',
      'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
      'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
      'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
      'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
      'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
    ];
    
    const regions = [
      'Northeast', 'Midwest', 'South', 'West'
    ];
    
    const stateToRegion: Record<string, string> = {
      'Connecticut': 'Northeast', 'Maine': 'Northeast', 'Massachusetts': 'Northeast',
      'New Hampshire': 'Northeast', 'Rhode Island': 'Northeast', 'Vermont': 'Northeast',
      'New Jersey': 'Northeast', 'New York': 'Northeast', 'Pennsylvania': 'Northeast',
      
      'Illinois': 'Midwest', 'Indiana': 'Midwest', 'Michigan': 'Midwest',
      'Ohio': 'Midwest', 'Wisconsin': 'Midwest', 'Iowa': 'Midwest',
      'Kansas': 'Midwest', 'Minnesota': 'Midwest', 'Missouri': 'Midwest',
      'Nebraska': 'Midwest', 'North Dakota': 'Midwest', 'South Dakota': 'Midwest',
      
      'Delaware': 'South', 'Florida': 'South', 'Georgia': 'South',
      'Maryland': 'South', 'North Carolina': 'South', 'South Carolina': 'South',
      'Virginia': 'South', 'West Virginia': 'South', 'Alabama': 'South',
      'Kentucky': 'South', 'Mississippi': 'South', 'Tennessee': 'South',
      'Arkansas': 'South', 'Louisiana': 'South', 'Oklahoma': 'South', 'Texas': 'South',
      
      'Arizona': 'West', 'Colorado': 'West', 'Idaho': 'West', 'Montana': 'West',
      'Nevada': 'West', 'New Mexico': 'West', 'Utah': 'West', 'Wyoming': 'West',
      'Alaska': 'West', 'California': 'West', 'Hawaii': 'West', 'Oregon': 'West',
      'Washington': 'West'
    };
    
    // Generate state-level data
    const stateData = states.map(state => {
      // Regions have different base rates
      const region = stateToRegion[state];
      let regionModifier = 0;
      
      switch(region) {
        case 'South': 
          regionModifier = 0.15;
          break;
        case 'West':
          regionModifier = -0.1;
          break;
        case 'Midwest': 
          regionModifier = 0.05;
          break;
        case 'Northeast':
          regionModifier = -0.05;
          break;
      }
      
      // Add some random variation
      const randomFactor = ((Math.random() - 0.5) * spread);
      const value = baseValue * (1 + regionModifier + randomFactor);
      
      return {
        id: faker.string.uuid(),
        date: new Date().toISOString().split('T')[0],
        value: parseFloat(value.toFixed(2)),
        locationdesc: state,
        state: state,
        category: metric
      };
    });
    
    return stateData;
  }
  
  private generateDemographicData(
    metric: string,
    demographic: DemographicGroup,
    baseValue: number
  ): HealthDataPoint[] {
    let categories: string[] = [];
    let values: number[] = [];
    
    switch(demographic) {
      case 'age':
        categories = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'];
        values = [
          baseValue * 0.7,  // 18-24
          baseValue * 0.8,  // 25-34
          baseValue * 0.95, // 35-44
          baseValue * 1.1,  // 45-54
          baseValue * 1.2,  // 55-64
          baseValue * 1.25  // 65+
        ];
        break;
        
      case 'gender':
        categories = ['Male', 'Female', 'Non-binary/Other'];
        values = [
          baseValue * 1.1,  // Male
          baseValue * 0.9,  // Female
          baseValue * 1.0   // Non-binary/Other
        ];
        break;
        
      case 'race':
        categories = ['White', 'Black', 'Hispanic', 'Asian', 'Indigenous', 'Other/Multiple'];
        values = [
          baseValue * 0.95, // White
          baseValue * 1.2,  // Black
          baseValue * 1.15, // Hispanic
          baseValue * 0.8,  // Asian
          baseValue * 1.3,  // Indigenous
          baseValue * 1.0   // Other/Multiple
        ];
        break;
        
      case 'income':
        categories = ['<$25K', '$25K-$50K', '$50K-$75K', '$75K-$100K', '$100K+'];
        values = [
          baseValue * 1.4,  // <$25K
          baseValue * 1.2,  // $25K-$50K
          baseValue * 1.0,  // $50K-$75K
          baseValue * 0.85, // $75K-$100K
          baseValue * 0.7   // $100K+
        ];
        break;
        
      case 'education':
        categories = ['Less than HS', 'High School', 'Some College', 'Bachelor\'s', 'Graduate'];
        values = [
          baseValue * 1.4,  // Less than HS
          baseValue * 1.2,  // High School
          baseValue * 1.0,  // Some College
          baseValue * 0.8,  // Bachelor's
          baseValue * 0.7   // Graduate
        ];
        break;
        
      case 'location':
        categories = ['Urban', 'Suburban', 'Rural'];
        values = [
          baseValue * 0.9,  // Urban
          baseValue * 1.0,  // Suburban
          baseValue * 1.2   // Rural
        ];
        break;
    }
    
    // Create data points for each category
    return categories.map((category, index) => ({
      id: faker.string.uuid(),
      date: new Date().toISOString().split('T')[0],
      value: parseFloat(values[index].toFixed(2)),
      demographic: category,
      category: metric
    }));
  }
  
  // Specific data generators for each health category
  
  private generateObesityData(
    timeRange: TimeRange,
    demographic: DemographicGroup
  ): Record<string, HealthDataPoint[]> {
    const years = this.timeRangeToYears(timeRange);
    const baseValue = 32.5; // national average obesity rate in %
    
    return {
      timeSeries: this.generateTimeSeriesData(years, baseValue, 'increasing', 0.05),
      regional: this.generateRegionalData('Obesity Rate', baseValue, 0.3),
      demographic: this.generateDemographicData('Obesity Rate', demographic, baseValue),
      bySource: {
        nhanes: this.generateRegionalData('Obesity Rate (NHANES)', baseValue, 0.25),
        brfss: this.generateRegionalData('Obesity Rate (BRFSS)', baseValue * 0.95, 0.3)
      }
    };
  }
  
  private generateMentalHealthData(
    timeRange: TimeRange,
    demographic: DemographicGroup
  ): Record<string, HealthDataPoint[]> {
    const years = this.timeRangeToYears(timeRange);
    const baseDepressionRate = 18.5; // % reporting depression symptoms
    const baseAnxietyRate = 21.4;    // % reporting anxiety symptoms
    
    return {
      depressionTimeSeries: this.generateTimeSeriesData(years, baseDepressionRate, 'increasing', 0.08),
      anxietyTimeSeries: this.generateTimeSeriesData(years, baseAnxietyRate, 'increasing', 0.1),
      regional: this.generateRegionalData('Mental Health Condition Rate', (baseDepressionRate + baseAnxietyRate) / 2, 0.4),
      demographic: this.generateDemographicData('Mental Health Condition Rate', demographic, (baseDepressionRate + baseAnxietyRate) / 2),
      accessToServices: this.generateRegionalData('Access to Mental Health Services', 65.5, 0.5) 
    };
  }
  
  private generateLGBTQHealthData(
    timeRange: TimeRange,
    demographic: DemographicGroup
  ): Record<string, HealthDataPoint[]> {
    const years = this.timeRangeToYears(timeRange);
    const baseDisparityRate = 23.8; // % health disparity compared to general population
    const baseAccessRate = 72.5;    // % reporting adequate healthcare access
    
    return {
      disparityTimeSeries: this.generateTimeSeriesData(years, baseDisparityRate, 'decreasing', 0.12),
      accessTimeSeries: this.generateTimeSeriesData(years, baseAccessRate, 'increasing', 0.08),
      mentalHealth: this.generateDemographicData('Mental Health Outcomes', demographic, 28.5),
      preventiveCare: this.generateDemographicData('Preventive Care Utilization', demographic, 68.2),
      regional: this.generateRegionalData('Healthcare Equity Index', 76.3, 0.6)
    };
  }
  
  private generateChronicDiseaseData(
    timeRange: TimeRange,
    demographic: DemographicGroup
  ): Record<string, HealthDataPoint[]> {
    const years = this.timeRangeToYears(timeRange);
    const baseDiabetesRate = 10.8;      // % with diabetes
    const baseHeartDiseaseRate = 8.6;   // % with heart disease
    const baseHypertensionRate = 29.3;  // % with hypertension
    
    return {
      diabetesTimeSeries: this.generateTimeSeriesData(years, baseDiabetesRate, 'increasing', 0.05),
      heartDiseaseTimeSeries: this.generateTimeSeriesData(years, baseHeartDiseaseRate, 'stable', 0.04),
      hypertensionTimeSeries: this.generateTimeSeriesData(years, baseHypertensionRate, 'increasing', 0.06),
      regional: {
        diabetes: this.generateRegionalData('Diabetes Rate', baseDiabetesRate, 0.3),
        heartDisease: this.generateRegionalData('Heart Disease Rate', baseHeartDiseaseRate, 0.25),
        hypertension: this.generateRegionalData('Hypertension Rate', baseHypertensionRate, 0.2)
      },
      demographic: this.generateDemographicData('Chronic Disease Prevalence', demographic, 
        (baseDiabetesRate + baseHeartDiseaseRate + baseHypertensionRate) / 3)
    };
  }
  
  private timeRangeToYears(range: TimeRange): number {
    switch(range) {
      case '1y': return 1;
      case '3y': return 3;
      case '5y': return 5;
      case '10y': return 10;
      default: return 3;
    }
  }
}

export const demoDataService = new DemoDataService();
