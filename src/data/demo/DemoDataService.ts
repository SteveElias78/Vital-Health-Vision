
/**
 * Demo Data Service
 * This service provides synthetic health data for demonstration purposes,
 * mimicking CDC and WHO data formats and patterns.
 */

// Define the health data categories that the demo service can provide
export type HealthDataCategory = 'obesity' | 'mental-health' | 'lgbtq-health' | 'chronic-disease' | string;

// Health data point interface
export interface HealthDataPoint {
  id: string;
  year: number;
  value: number;
  category: HealthDataCategory;
  locationdesc?: string;
  locationabbr?: string;
  stratification1?: string;
  stratification2?: string;
  dataSource?: string;
}

// Health data metadata interface
export interface HealthDataMetadata {
  source: string;
  updated: string;
  description?: string;
  reliability?: number;
  methods?: string[];
  sampleSize?: number;
  geographicCoverage?: string[];
}

// Data source interface
export interface DataSource {
  id: string;
  name: string;
  organization: string;
  description: string;
  lastUpdated: string;
  reliability: number;
  coverage: string[];
  url?: string;
}

// Interface for filter options
export interface HealthDataFilters {
  timeRange?: string;
  ageGroup?: string;
  gender?: string;
  region?: string;
  state?: string;
  race?: string;
  education?: string;
  income?: string;
  dateRange?: [Date, Date];
}

// Response interface for the getHealthData method
export interface HealthDataResponse {
  data: {
    nhanes: HealthDataPoint[];
    brfss: HealthDataPoint[];
    regional: HealthDataPoint[];
    demographic: HealthDataPoint[];
    [key: string]: HealthDataPoint[];
  };
  metadata: HealthDataMetadata;
}

class DemoDataService {
  // Main method to get health data by category with optional filters
  async getHealthData(
    category: HealthDataCategory,
    filters: HealthDataFilters = {}
  ): Promise<HealthDataResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate synthetic data based on the category
    const data = this.generateSyntheticData(category, filters);
    
    // Create metadata for the dataset
    const metadata = this.generateMetadata(category);
    
    return { data, metadata };
  }
  
  // Get available data sources
  async getDataSources(): Promise<DataSource[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [
      {
        id: 'nhanes',
        name: 'National Health and Nutrition Examination Survey',
        organization: 'CDC',
        description: 'Nationally representative survey of health status',
        lastUpdated: '2025-01-15',
        reliability: 0.92,
        coverage: ['United States']
      },
      {
        id: 'brfss',
        name: 'Behavioral Risk Factor Surveillance System',
        organization: 'CDC',
        description: 'State-level health behavior survey',
        lastUpdated: '2025-03-10',
        reliability: 0.87,
        coverage: ['United States', 'States', 'Counties']
      },
      {
        id: 'yrbss',
        name: 'Youth Risk Behavior Surveillance System',
        organization: 'CDC',
        description: 'Adolescent health behavior survey',
        lastUpdated: '2024-11-22',
        reliability: 0.85,
        coverage: ['United States', 'States']
      },
      {
        id: 'who',
        name: 'World Health Organization Global Health Observatory',
        organization: 'WHO',
        description: 'Global health data repository',
        lastUpdated: '2025-02-28',
        reliability: 0.90,
        coverage: ['Global', 'Countries', 'Regions']
      }
    ];
  }
  
  // Private method to generate metadata for a dataset
  private generateMetadata(category: HealthDataCategory): HealthDataMetadata {
    const baseMetadata: Record<string, HealthDataMetadata> = {
      'obesity': {
        source: 'CDC NHANES and BRFSS',
        updated: '2025-04-01',
        description: 'Adult obesity prevalence data (BMI ≥ 30) from multiple sources',
        reliability: 0.89,
        methods: ['Self-reported survey', 'Clinical measurement'],
        sampleSize: 52750,
        geographicCoverage: ['United States', 'States', 'Selected counties']
      },
      'mental-health': {
        source: 'CDC BRFSS and SAMHSA',
        updated: '2025-03-15',
        description: 'Prevalence data for depression, anxiety, and psychological distress',
        reliability: 0.83,
        methods: ['Self-reported survey', 'Provider reporting'],
        sampleSize: 48320,
        geographicCoverage: ['United States', 'States', 'Selected metropolitan areas']
      },
      'lgbtq-health': {
        source: 'CDC BRFSS and HEI',
        updated: '2025-02-20',
        description: 'Healthcare access quality measures for LGBTQ+ populations',
        reliability: 0.81,
        methods: ['Self-reported survey', 'Provider assessment', 'Policy evaluation'],
        sampleSize: 37850,
        geographicCoverage: ['United States', 'States', 'Selected urban centers']
      },
      'chronic-disease': {
        source: 'CDC NHANES and BRFSS',
        updated: '2025-04-10',
        description: 'Prevalence data for diabetes, heart disease, and hypertension',
        reliability: 0.91,
        methods: ['Clinical reporting', 'Self-reported survey', 'Medical records analysis'],
        sampleSize: 63240,
        geographicCoverage: ['United States', 'States', 'Counties']
      }
    };
    
    // Return category-specific metadata or generic if category not found
    return baseMetadata[category] || {
      source: 'Demo Data Service',
      updated: new Date().toISOString(),
      description: 'Synthetic health data for demonstration purposes',
      reliability: 0.85
    };
  }
  
  // Private method to generate synthetic data based on category
  private generateSyntheticData(category: HealthDataCategory, filters: HealthDataFilters): any {
    // Create different types of data for different visualization needs
    const nhanes = this.generateTimeSeriesData(category, 'nhanes', filters);
    const brfss = this.generateTimeSeriesData(category, 'brfss', filters);
    const regional = this.generateRegionalData(category, filters);
    const demographic = this.generateDemographicData(category, filters);
    
    return {
      nhanes,
      brfss,
      regional,
      demographic
    };
  }
  
  // Generate time series data
  private generateTimeSeriesData(
    category: HealthDataCategory,
    source: string,
    filters: HealthDataFilters
  ): HealthDataPoint[] {
    const data: HealthDataPoint[] = [];
    const startYear = 2015;
    const endYear = 2025;
    
    // Base values and trends for different categories
    const baseValues: Record<string, number> = {
      'obesity': 30.5,
      'mental-health': 17.8,
      'lgbtq-health': 65.3,
      'chronic-disease': 27.2
    };
    
    const annualChange: Record<string, number> = {
      'obesity': 0.4,
      'mental-health': 0.8,
      'lgbtq-health': 1.1,
      'chronic-disease': 0.3
    };
    
    // Generate data for each year
    for (let year = startYear; year <= endYear; year++) {
      const yearsSince = year - startYear;
      const baseValue = baseValues[category] || 25.0;
      const annualTrend = annualChange[category] || 0.5;
      
      // Add some randomness to make data more realistic
      const randomFactor = Math.random() * 0.4 - 0.2; // -0.2 to +0.2
      
      data.push({
        id: `${source}-${category}-${year}`,
        year,
        value: baseValue + (annualTrend * yearsSince) + randomFactor,
        category,
        dataSource: source
      });
    }
    
    return data;
  }
  
  // Generate regional data (by state or region)
  private generateRegionalData(
    category: HealthDataCategory,
    filters: HealthDataFilters
  ): HealthDataPoint[] {
    const data: HealthDataPoint[] = [];
    const regions = [
      { abbr: 'AL', desc: 'Alabama' },
      { abbr: 'AK', desc: 'Alaska' },
      { abbr: 'AZ', desc: 'Arizona' },
      { abbr: 'AR', desc: 'Arkansas' },
      { abbr: 'CA', desc: 'California' },
      { abbr: 'CO', desc: 'Colorado' },
      { abbr: 'CT', desc: 'Connecticut' },
      { abbr: 'DE', desc: 'Delaware' },
      { abbr: 'FL', desc: 'Florida' },
      { abbr: 'GA', desc: 'Georgia' },
      { abbr: 'HI', desc: 'Hawaii' },
      { abbr: 'ID', desc: 'Idaho' },
      { abbr: 'IL', desc: 'Illinois' },
      { abbr: 'IN', desc: 'Indiana' },
      { abbr: 'IA', desc: 'Iowa' },
      { abbr: 'KS', desc: 'Kansas' },
      { abbr: 'KY', desc: 'Kentucky' },
      { abbr: 'LA', desc: 'Louisiana' },
      { abbr: 'ME', desc: 'Maine' },
      { abbr: 'MD', desc: 'Maryland' },
      { abbr: 'MA', desc: 'Massachusetts' },
      { abbr: 'MI', desc: 'Michigan' },
      { abbr: 'MN', desc: 'Minnesota' },
      { abbr: 'MS', desc: 'Mississippi' },
      { abbr: 'MO', desc: 'Missouri' },
      { abbr: 'MT', desc: 'Montana' },
      { abbr: 'NE', desc: 'Nebraska' },
      { abbr: 'NV', desc: 'Nevada' },
      { abbr: 'NH', desc: 'New Hampshire' },
      { abbr: 'NJ', desc: 'New Jersey' },
      { abbr: 'NM', desc: 'New Mexico' },
      { abbr: 'NY', desc: 'New York' },
      { abbr: 'NC', desc: 'North Carolina' },
      { abbr: 'ND', desc: 'North Dakota' },
      { abbr: 'OH', desc: 'Ohio' },
      { abbr: 'OK', desc: 'Oklahoma' },
      { abbr: 'OR', desc: 'Oregon' },
      { abbr: 'PA', desc: 'Pennsylvania' },
      { abbr: 'RI', desc: 'Rhode Island' },
      { abbr: 'SC', desc: 'South Carolina' },
      { abbr: 'SD', desc: 'South Dakota' },
      { abbr: 'TN', desc: 'Tennessee' },
      { abbr: 'TX', desc: 'Texas' },
      { abbr: 'UT', desc: 'Utah' },
      { abbr: 'VT', desc: 'Vermont' },
      { abbr: 'VA', desc: 'Virginia' },
      { abbr: 'WA', desc: 'Washington' },
      { abbr: 'WV', desc: 'West Virginia' },
      { abbr: 'WI', desc: 'Wisconsin' },
      { abbr: 'WY', desc: 'Wyoming' },
    ];
    
    // Base values for different categories by region type
    const baseValuesByRegion: Record<string, Record<string, number>> = {
      'obesity': {
        'South': 36.0,
        'Midwest': 33.5,
        'Northeast': 29.0,
        'West': 27.0
      },
      'mental-health': {
        'South': 19.5,
        'Midwest': 18.0,
        'Northeast': 18.5,
        'West': 20.0
      },
      'lgbtq-health': {
        'South': 68.0,
        'Midwest': 72.0,
        'Northeast': 80.0,
        'West': 81.0
      },
      'chronic-disease': {
        'South': 30.0,
        'Midwest': 28.5,
        'Northeast': 26.0,
        'West': 25.0
      }
    };
    
    // Helper to determine region
    const getRegion = (state: string): string => {
      const northeast = ['CT', 'ME', 'MA', 'NH', 'RI', 'VT', 'NJ', 'NY', 'PA'];
      const midwest = ['IL', 'IN', 'MI', 'OH', 'WI', 'IA', 'KS', 'MN', 'MO', 'NE', 'ND', 'SD'];
      const south = ['DE', 'FL', 'GA', 'MD', 'NC', 'SC', 'VA', 'WV', 'AL', 'KY', 'MS', 'TN', 'AR', 'LA', 'OK', 'TX'];
      
      if (northeast.includes(state)) return 'Northeast';
      if (midwest.includes(state)) return 'Midwest';
      if (south.includes(state)) return 'South';
      return 'West';
    };
    
    // Generate data for each state
    regions.forEach(region => {
      const regionType = getRegion(region.abbr);
      const baseValues = baseValuesByRegion[category] || { 'South': 30, 'Midwest': 28, 'Northeast': 26, 'West': 25 };
      const baseValue = baseValues[regionType] || 27;
      
      // Add randomness to make data more realistic
      const randomFactor = Math.random() * 6 - 3; // -3 to +3
      
      data.push({
        id: `regional-${category}-${region.abbr}`,
        year: 2025,
        value: baseValue + randomFactor,
        category,
        locationabbr: region.abbr,
        locationdesc: region.desc
      });
    });
    
    return data;
  }
  
  // Generate demographic breakdown data
  private generateDemographicData(
    category: HealthDataCategory,
    filters: HealthDataFilters
  ): HealthDataPoint[] {
    const data: HealthDataPoint[] = [];
    
    // Define demographic categories
    const demographics = {
      'age': ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
      'gender': ['Male', 'Female', 'Non-binary/Other'],
      'race': ['White', 'Black', 'Hispanic', 'Asian', 'Other/Multiple'],
      'education': ['Less than HS', 'High School', 'Some College', 'Bachelor\'s', 'Advanced Degree'],
      'income': ['<$25K', '$25K-$50K', '$50K-$75K', '$75K-$100K', '>$100K']
    };
    
    // Base values for different categories by demographic
    const categoryValues: Record<string, Record<string, Record<string, number>>> = {
      'obesity': {
        'age': { '18-24': 26.0, '25-34': 30.0, '35-44': 34.0, '45-54': 36.5, '55-64': 38.0, '65+': 33.0 },
        'gender': { 'Male': 32.5, 'Female': 36.0, 'Non-binary/Other': 33.5 },
        'race': { 'White': 33.0, 'Black': 39.0, 'Hispanic': 35.5, 'Asian': 17.0, 'Other/Multiple': 30.0 },
        'education': { 'Less than HS': 38.0, 'High School': 36.0, 'Some College': 34.0, 'Bachelor\'s': 27.5, 'Advanced Degree': 23.0 },
        'income': { '<$25K': 38.5, '$25K-$50K': 36.0, '$50K-$75K': 33.0, '$75K-$100K': 29.0, '>$100K': 25.0 }
      },
      'mental-health': {
        'age': { '18-24': 25.0, '25-34': 23.0, '35-44': 19.0, '45-54': 17.0, '55-64': 14.0, '65+': 11.0 },
        'gender': { 'Male': 15.0, 'Female': 22.0, 'Non-binary/Other': 29.0 },
        'race': { 'White': 18.0, 'Black': 17.0, 'Hispanic': 18.5, 'Asian': 14.0, 'Other/Multiple': 21.0 },
        'education': { 'Less than HS': 22.0, 'High School': 20.0, 'Some College': 19.0, 'Bachelor\'s': 15.0, 'Advanced Degree': 12.0 },
        'income': { '<$25K': 24.0, '$25K-$50K': 20.0, '$50K-$75K': 17.0, '$75K-$100K': 14.0, '>$100K': 12.0 }
      },
      'lgbtq-health': {
        'age': { '18-24': 72.0, '25-34': 75.0, '35-44': 77.0, '45-54': 74.0, '55-64': 71.0, '65+': 67.0 },
        'gender': { 'Male': 76.0, 'Female': 74.0, 'Non-binary/Other': 68.0 },
        'race': { 'White': 77.0, 'Black': 71.0, 'Hispanic': 72.0, 'Asian': 74.0, 'Other/Multiple': 70.0 },
        'education': { 'Less than HS': 66.0, 'High School': 70.0, 'Some College': 74.0, 'Bachelor\'s': 79.0, 'Advanced Degree': 82.0 },
        'income': { '<$25K': 67.0, '$25K-$50K': 71.0, '$50K-$75K': 75.0, '$75K-$100K': 79.0, '>$100K': 83.0 }
      },
      'chronic-disease': {
        'age': { '18-24': 12.0, '25-34': 15.0, '35-44': 21.0, '45-54': 28.0, '55-64': 37.0, '65+': 48.0 },
        'gender': { 'Male': 28.0, 'Female': 26.0, 'Non-binary/Other': 27.0 },
        'race': { 'White': 26.0, 'Black': 31.0, 'Hispanic': 28.0, 'Asian': 22.0, 'Other/Multiple': 27.0 },
        'education': { 'Less than HS': 34.0, 'High School': 30.0, 'Some College': 27.0, 'Bachelor\'s': 22.0, 'Advanced Degree': 18.0 },
        'income': { '<$25K': 33.0, '$25K-$50K': 29.0, '$50K-$75K': 26.0, '$75K-$100K': 22.0, '>$100K': 19.0 }
      }
    };
    
    // Generate data for each demographic category
    Object.entries(demographics).forEach(([demoType, demoValues]) => {
      const categoryDefaults = categoryValues[category] || {
        'age': { '18-24': 20.0, '25-34': 22.0, '35-44': 24.0, '45-54': 26.0, '55-64': 28.0, '65+': 30.0 },
        'gender': { 'Male': 25.0, 'Female': 25.0, 'Non-binary/Other': 25.0 },
        'race': { 'White': 25.0, 'Black': 25.0, 'Hispanic': 25.0, 'Asian': 25.0, 'Other/Multiple': 25.0 },
        'education': { 'Less than HS': 30.0, 'High School': 28.0, 'Some College': 26.0, 'Bachelor\'s': 24.0, 'Advanced Degree': 22.0 },
        'income': { '<$25K': 30.0, '$25K-$50K': 28.0, '$50K-$75K': 26.0, '$75K-$100K': 24.0, '>$100K': 22.0 }
      };
      
      const demoDefaults = categoryDefaults[demoType] || {};
      
      demoValues.forEach(value => {
        const baseValue = demoDefaults[value] || 25.0;
        
        // Add randomness to make data more realistic
        const randomFactor = Math.random() * 2 - 1; // -1 to +1
        
        data.push({
          id: `demographic-${category}-${demoType}-${value}`.replace(/\s+/g, '-'),
          year: 2025,
          value: baseValue + randomFactor,
          category,
          stratification1: demoType,
          stratification2: value
        });
      });
    });
    
    return data;
  }
}

// Export a singleton instance of the service
export const demoDataService = new DemoDataService();
export default demoDataService;
