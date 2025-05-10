
// This is a demo service that provides synthetic health data for the application

export type HealthDataCategory = 'obesity' | 'mental-health' | 'lgbtq-health' | 'chronic-disease';

export interface HealthDataPoint {
  date: string;
  value: number;
  category: HealthDataCategory;
  ageGroup?: string;
  gender?: string;
  region?: string;
  state?: string;
  race?: string;
  confidence?: number;
}

export interface HealthDataMetadata {
  source: string;
  lastUpdated: string;
  reliability: number;
  methodology: string;
  notes?: string;
  citation?: string;
}

export interface DataSource {
  id: string;
  name: string;
  description: string;
  reliability: number;
  lastUpdated: string;
  organization: string;
  url?: string;
}

// Export the DemoDataService class and create an instance
export class DemoDataService {
  async getHealthData(category: HealthDataCategory, filters?: any): Promise<{data: HealthDataPoint[], metadata: HealthDataMetadata}> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate the appropriate data based on the category
    let data: HealthDataPoint[];
    let metadata: HealthDataMetadata;
    
    switch (category) {
      case 'obesity':
        data = this.generateObesityData();
        metadata = {
          source: 'cdc-demo',
          lastUpdated: '2025-03-15',
          reliability: 0.95,
          methodology: 'Random sampling with demographic weighting',
          notes: 'Synthetic data based on CDC BRFSS patterns',
          citation: 'Virtual CDC Behavioral Risk Factor Surveillance System, 2025'
        };
        break;
      case 'mental-health':
        data = this.generateMentalHealthData();
        metadata = {
          source: 'nimh-demo',
          lastUpdated: '2025-02-28',
          reliability: 0.90,
          methodology: 'Composite survey data with clinical verification',
          notes: 'Synthetic data based on NIMH prevalence patterns',
          citation: 'Virtual National Institute of Mental Health Prevalence Study, 2025'
        };
        break;
      case 'lgbtq-health':
        data = this.generateLGBTQHealthData();
        metadata = {
          source: 'health-equity-demo',
          lastUpdated: '2025-01-10',
          reliability: 0.85,
          methodology: 'Multi-stage cluster sampling with targeted outreach',
          notes: 'Synthetic data based on health equity research patterns',
          citation: 'Virtual Health Equity Research Collaborative, 2025'
        };
        break;
      case 'chronic-disease':
      default:
        data = this.generateChronicDiseaseData();
        metadata = {
          source: 'health-stats-demo',
          lastUpdated: '2025-04-05',
          reliability: 0.92,
          methodology: 'Population-based surveillance with medical record verification',
          notes: 'Synthetic data based on chronic disease surveillance patterns',
          citation: 'Virtual Chronic Disease Surveillance System, 2025'
        };
    }
    
    // Apply any filters if provided
    if (filters) {
      data = this.filterData(data, filters);
    }
    
    return { data, metadata };
  }
  
  async getDataSources(): Promise<DataSource[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [
      {
        id: 'cdc-demo',
        name: 'CDC Health Data Repository',
        description: 'Comprehensive health statistics from the Centers for Disease Control and Prevention',
        reliability: 0.95,
        lastUpdated: '2025-03-15',
        organization: 'Centers for Disease Control and Prevention',
        url: 'https://data.cdc.gov'
      },
      {
        id: 'nimh-demo',
        name: 'Mental Health Research Database',
        description: 'Mental health statistics and survey data',
        reliability: 0.90,
        lastUpdated: '2025-02-28',
        organization: 'National Institute of Mental Health',
        url: 'https://www.nimh.nih.gov/research/data'
      },
      {
        id: 'health-equity-demo',
        name: 'Health Equity Data Collaborative',
        description: 'Data focusing on health disparities and underserved populations',
        reliability: 0.85,
        lastUpdated: '2025-01-10',
        organization: 'Health Equity Research Collaborative',
        url: 'https://healthequitydata.org'
      },
      {
        id: 'health-stats-demo',
        name: 'National Health Statistics System',
        description: 'Comprehensive health statistics and chronic disease tracking',
        reliability: 0.92,
        lastUpdated: '2025-04-05',
        organization: 'Department of Health and Human Services',
        url: 'https://healthstatistics.gov'
      },
      {
        id: 'state-health-demo',
        name: 'State Health Departments Aggregation',
        description: 'Combined datasets from state health departments',
        reliability: 0.88,
        lastUpdated: '2025-03-20',
        organization: 'Association of State Health Officials',
        url: 'https://statehealthdata.org'
      }
    ];
  }
  
  // Helper methods to generate synthetic data
  private generateObesityData(): HealthDataPoint[] {
    const data: HealthDataPoint[] = [];
    const baselineYear = 2023;
    const baseValue = 34.5; // national baseline
    
    // Generate time series data
    for (let i = 0; i < 36; i++) { // 3 years of monthly data
      const date = new Date(baselineYear, i % 12, 1);
      const monthStr = date.toISOString().slice(0, 10);
      
      // Add slight upward trend with seasonal variation
      const timeValue = baseValue + (i * 0.05) + (Math.sin(i * 0.5) * 0.8);
      
      // National average
      data.push({
        date: monthStr,
        value: +timeValue.toFixed(1),
        category: 'obesity',
        confidence: 0.95
      });
      
      // Add data by region
      const regions = ['Northeast', 'Midwest', 'South', 'West'];
      const regionBaselines = { 'Northeast': 32.1, 'Midwest': 35.7, 'South': 38.2, 'West': 30.3 };
      
      regions.forEach(region => {
        const regionValue = regionBaselines[region as keyof typeof regionBaselines] + (i * 0.04) + (Math.sin(i * 0.5) * 0.6) + (Math.random() * 0.5 - 0.25);
        
        data.push({
          date: monthStr,
          value: +regionValue.toFixed(1),
          category: 'obesity',
          region: region,
          confidence: 0.92
        });
      });
      
      // Add data by age group
      const ageGroups = ['18-34', '35-49', '50-64', '65+'];
      const ageGroupBaselines = { '18-34': 30.2, '35-49': 36.4, '50-64': 37.8, '65+': 33.5 };
      
      ageGroups.forEach(ageGroup => {
        const ageValue = ageGroupBaselines[ageGroup as keyof typeof ageGroupBaselines] + (i * 0.03) + (Math.sin(i * 0.5) * 0.5) + (Math.random() * 0.4 - 0.2);
        
        data.push({
          date: monthStr,
          value: +ageValue.toFixed(1),
          category: 'obesity',
          ageGroup: ageGroup,
          confidence: 0.90
        });
      });
      
      // Add data by race/ethnicity
      const races = ['White', 'Black', 'Hispanic', 'Asian', 'Other'];
      const raceBaselines = { 'White': 34.3, 'Black': 40.7, 'Hispanic': 39.1, 'Asian': 17.4, 'Other': 35.2 };
      
      races.forEach(race => {
        const raceValue = raceBaselines[race as keyof typeof raceBaselines] + (i * 0.03) + (Math.sin(i * 0.5) * 0.4) + (Math.random() * 0.4 - 0.2);
        
        data.push({
          date: monthStr,
          value: +raceValue.toFixed(1),
          category: 'obesity',
          race: race,
          confidence: 0.89
        });
      });
    }
    
    return data;
  }
  
  private generateMentalHealthData(): HealthDataPoint[] {
    const data: HealthDataPoint[] = [];
    const baselineYear = 2023;
    const baseValue = 18.5; // national baseline for mental health prevalence
    
    // Generate time series data
    for (let i = 0; i < 36; i++) { // 3 years of monthly data
      const date = new Date(baselineYear, i % 12, 1);
      const monthStr = date.toISOString().slice(0, 10);
      
      // Add upward trend with seasonal variation (more pronounced in winter)
      const monthFactor = (i % 12) <= 2 || (i % 12) >= 10 ? 1.2 : 0.9; // Higher in winter months
      const timeValue = baseValue + (i * 0.06 * monthFactor) + (Math.sin(i * 0.5) * 0.9);
      
      // National average
      data.push({
        date: monthStr,
        value: +timeValue.toFixed(1),
        category: 'mental-health',
        confidence: 0.90
      });
      
      // Add data by gender
      const genders = ['Male', 'Female'];
      const genderBaselines = { 'Male': 14.3, 'Female': 23.4 };
      
      genders.forEach(gender => {
        const genderValue = genderBaselines[gender as keyof typeof genderBaselines] + (i * 0.05 * monthFactor) + (Math.sin(i * 0.5) * 0.8) + (Math.random() * 0.3 - 0.15);
        
        data.push({
          date: monthStr,
          value: +genderValue.toFixed(1),
          category: 'mental-health',
          gender: gender,
          confidence: 0.88
        });
      });
      
      // Add data by age group with higher prevalence in younger groups
      const ageGroups = ['18-25', '26-34', '35-49', '50-64', '65+'];
      const ageGroupBaselines = { '18-25': 21.6, '26-34': 19.8, '35-49': 17.5, '50-64': 15.2, '65+': 11.8 };
      
      ageGroups.forEach(ageGroup => {
        // Younger groups seeing faster increases
        const ageFactor = ageGroup === '18-25' || ageGroup === '26-34' ? 1.2 : 0.9;
        const ageValue = ageGroupBaselines[ageGroup as keyof typeof ageGroupBaselines] + (i * 0.04 * monthFactor * ageFactor) + (Math.sin(i * 0.5) * 0.7) + (Math.random() * 0.4 - 0.2);
        
        data.push({
          date: monthStr,
          value: +ageValue.toFixed(1),
          category: 'mental-health',
          ageGroup: ageGroup,
          confidence: 0.85
        });
      });
      
      // Add data by region
      const regions = ['Northeast', 'Midwest', 'South', 'West'];
      const regionBaselines = { 'Northeast': 19.2, 'Midwest': 18.6, 'South': 17.8, 'West': 20.5 };
      
      regions.forEach(region => {
        const regionValue = regionBaselines[region as keyof typeof regionBaselines] + (i * 0.04 * monthFactor) + (Math.sin(i * 0.5) * 0.6) + (Math.random() * 0.5 - 0.25);
        
        data.push({
          date: monthStr,
          value: +regionValue.toFixed(1),
          category: 'mental-health',
          region: region,
          confidence: 0.87
        });
      });
    }
    
    return data;
  }
  
  private generateLGBTQHealthData(): HealthDataPoint[] {
    const data: HealthDataPoint[] = [];
    const baselineYear = 2023;
    const baseValue = 76.3; // national baseline for LGBTQ+ health access score (higher is better)
    
    // Generate time series data
    for (let i = 0; i < 36; i++) { // 3 years of monthly data
      const date = new Date(baselineYear, i % 12, 1);
      const monthStr = date.toISOString().slice(0, 10);
      
      // Add gradual improvement trend
      const timeValue = baseValue + (i * 0.15) + (Math.sin(i * 0.5) * 0.5);
      
      // National average
      data.push({
        date: monthStr,
        value: +timeValue.toFixed(1),
        category: 'lgbtq-health',
        confidence: 0.85
      });
      
      // Add data by region with significant disparities
      const regions = ['Northeast', 'Midwest', 'South', 'West'];
      const regionBaselines = { 'Northeast': 84.3, 'Midwest': 72.1, 'South': 68.5, 'West': 82.7 };
      
      regions.forEach(region => {
        // Different improvement rates by region
        const regionFactor = region === 'Northeast' || region === 'West' ? 1.2 : 0.8;
        const regionValue = regionBaselines[region as keyof typeof regionBaselines] + (i * 0.12 * regionFactor) + (Math.sin(i * 0.5) * 0.4) + (Math.random() * 0.6 - 0.3);
        
        data.push({
          date: monthStr,
          value: +regionValue.toFixed(1),
          category: 'lgbtq-health',
          region: region,
          confidence: 0.83
        });
      });
      
      // Add data for specific states to show significant variation
      const states = ['CA', 'NY', 'MA', 'MS', 'AL', 'TX'];
      const stateBaselines = { 'CA': 85.2, 'NY': 84.6, 'MA': 88.1, 'MS': 62.3, 'AL': 63.8, 'TX': 67.5 };
      
      states.forEach(state => {
        // Different improvement rates by state
        const stateFactor = ['CA', 'NY', 'MA'].includes(state) ? 1.3 : 0.7;
        const stateValue = stateBaselines[state as keyof typeof stateBaselines] + (i * 0.1 * stateFactor) + (Math.sin(i * 0.5) * 0.3) + (Math.random() * 0.5 - 0.25);
        
        data.push({
          date: monthStr,
          value: +stateValue.toFixed(1),
          category: 'lgbtq-health',
          state: state,
          confidence: 0.80
        });
      });
      
      // Add data by age group
      const ageGroups = ['18-29', '30-49', '50+'];
      const ageGroupBaselines = { '18-29': 78.5, '30-49': 77.2, '50+': 72.8 };
      
      ageGroups.forEach(ageGroup => {
        const ageValue = ageGroupBaselines[ageGroup as keyof typeof ageGroupBaselines] + (i * 0.14) + (Math.sin(i * 0.5) * 0.4) + (Math.random() * 0.4 - 0.2);
        
        data.push({
          date: monthStr,
          value: +ageValue.toFixed(1),
          category: 'lgbtq-health',
          ageGroup: ageGroup,
          confidence: 0.82
        });
      });
    }
    
    return data;
  }
  
  private generateChronicDiseaseData(): HealthDataPoint[] {
    const data: HealthDataPoint[] = [];
    const baselineYear = 2023;
    const baseValue = 10.8; // national baseline for chronic disease prevalence
    
    // Generate time series data
    for (let i = 0; i < 36; i++) { // 3 years of monthly data
      const date = new Date(baselineYear, i % 12, 1);
      const monthStr = date.toISOString().slice(0, 10);
      
      // Add slight upward trend with seasonal variation (higher in winter)
      const monthFactor = (i % 12) <= 2 || (i % 12) >= 10 ? 1.1 : 0.95;
      const timeValue = baseValue + (i * 0.03 * monthFactor) + (Math.sin(i * 0.5) * 0.4);
      
      // National average
      data.push({
        date: monthStr,
        value: +timeValue.toFixed(1),
        category: 'chronic-disease',
        confidence: 0.92
      });
      
      // Add data by age group with higher prevalence in older groups
      const ageGroups = ['18-34', '35-49', '50-64', '65-79', '80+'];
      const ageGroupBaselines = { '18-34': 3.2, '35-49': 7.6, '50-64': 14.3, '65-79': 22.8, '80+': 31.5 };
      
      ageGroups.forEach(ageGroup => {
        // Older groups seeing faster increases
        const ageFactor = ageGroup === '65-79' || ageGroup === '80+' ? 1.2 : 0.9;
        const ageValue = ageGroupBaselines[ageGroup as keyof typeof ageGroupBaselines] + (i * 0.02 * monthFactor * ageFactor) + (Math.sin(i * 0.5) * 0.3) + (Math.random() * 0.3 - 0.15);
        
        data.push({
          date: monthStr,
          value: +ageValue.toFixed(1),
          category: 'chronic-disease',
          ageGroup: ageGroup,
          confidence: 0.90
        });
      });
      
      // Add data by region
      const regions = ['Northeast', 'Midwest', 'South', 'West'];
      const regionBaselines = { 'Northeast': 10.1, 'Midwest': 11.2, 'South': 12.5, 'West': 9.8 };
      
      regions.forEach(region => {
        const regionValue = regionBaselines[region as keyof typeof regionBaselines] + (i * 0.025 * monthFactor) + (Math.sin(i * 0.5) * 0.35) + (Math.random() * 0.4 - 0.2);
        
        data.push({
          date: monthStr,
          value: +regionValue.toFixed(1),
          category: 'chronic-disease',
          region: region,
          confidence: 0.89
        });
      });
      
      // Add data by gender
      const genders = ['Male', 'Female'];
      const genderBaselines = { 'Male': 11.3, 'Female': 10.4 };
      
      genders.forEach(gender => {
        const genderValue = genderBaselines[gender as keyof typeof genderBaselines] + (i * 0.03 * monthFactor) + (Math.sin(i * 0.5) * 0.3) + (Math.random() * 0.3 - 0.15);
        
        data.push({
          date: monthStr,
          value: +genderValue.toFixed(1),
          category: 'chronic-disease',
          gender: gender,
          confidence: 0.91
        });
      });
    }
    
    return data;
  }
  
  // Helper method to filter data
  private filterData(data: HealthDataPoint[], filters: any): HealthDataPoint[] {
    return data.filter(item => {
      let match = true;
      
      if (filters.dateRange) {
        const itemDate = new Date(item.date).getTime();
        match = match && (itemDate >= filters.dateRange[0].getTime() && itemDate <= filters.dateRange[1].getTime());
      }
      
      if (filters.ageGroup && item.ageGroup) {
        match = match && item.ageGroup === filters.ageGroup;
      }
      
      if (filters.gender && item.gender) {
        match = match && item.gender === filters.gender;
      }
      
      if (filters.region && item.region) {
        match = match && item.region === filters.region;
      }
      
      if (filters.state && item.state) {
        match = match && item.state === filters.state;
      }
      
      if (filters.race && item.race) {
        match = match && item.race === filters.race;
      }
      
      return match;
    });
  }
}

// Export a singleton instance
export const demoDataService = new DemoDataService();

export default demoDataService;
