
// Mock data connector for hybrid health data access
export type MockDataCategory = 'obesity' | 'mental-health' | 'lgbtq-health';

export class MockHybridHealthDataConnector {
  async getHealthData(category: MockDataCategory): Promise<any> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return mock data based on category
    switch(category) {
      case 'obesity':
        return this.getObesityData();
      case 'mental-health':
        return this.getMentalHealthData();
      case 'lgbtq-health':
        return this.getLGBTQHealthData();
      default:
        throw new Error(`Category ${category} not supported`);
    }
  }
  
  private getObesityData() {
    return {
      nhanes: [
        { locationdesc: 'Alabama', value: 36.1, stratification1: 'Overall' },
        { locationdesc: 'Alaska', value: 29.8, stratification1: 'Overall' },
        { locationdesc: 'Arizona', value: 31.4, stratification1: 'Overall' },
        { locationdesc: 'Arkansas', value: 35.5, stratification1: 'Overall' },
        { locationdesc: 'California', value: 26.2, stratification1: 'Overall' },
        { locationdesc: 'Colorado', value: 23.8, stratification1: 'Overall' },
        { locationdesc: 'Connecticut', value: 27.4, stratification1: 'Overall' },
        { locationdesc: 'Delaware', value: 33.2, stratification1: 'Overall' },
        { locationdesc: 'Florida', value: 28.4, stratification1: 'Overall' },
        { locationdesc: 'Georgia', value: 32.5, stratification1: 'Overall' }
      ],
      brfss: [
        { locationdesc: 'Alabama', value: 38.1, stratification1: 'Overall' },
        { locationdesc: 'Alaska', value: 31.9, stratification1: 'Overall' },
        { locationdesc: 'Arizona', value: 32.1, stratification1: 'Overall' },
        { locationdesc: 'Arkansas', value: 37.4, stratification1: 'Overall' },
        { locationdesc: 'California', value: 27.7, stratification1: 'Overall' },
        { locationdesc: 'Colorado', value: 24.2, stratification1: 'Overall' },
        { locationdesc: 'Connecticut', value: 29.1, stratification1: 'Overall' },
        { locationdesc: 'Delaware', value: 35.3, stratification1: 'Overall' },
        { locationdesc: 'Florida', value: 30.7, stratification1: 'Overall' },
        { locationdesc: 'Georgia', value: 34.3, stratification1: 'Overall' }
      ],
      metadata: {
        source: 'CDC',
        reliability: 0.9,
        description: 'Obesity prevalence data from multiple sources',
        lastUpdated: '2025-03-15'
      }
    };
  }
  
  private getMentalHealthData() {
    return {
      nhanes: [
        { locationdesc: 'Northeast', value: 18.7, stratification1: 'Depression' },
        { locationdesc: 'Midwest', value: 19.1, stratification1: 'Depression' },
        { locationdesc: 'South', value: 17.9, stratification1: 'Depression' },
        { locationdesc: 'West', value: 16.2, stratification1: 'Depression' },
        { locationdesc: 'Northeast', value: 21.3, stratification1: 'Anxiety' },
        { locationdesc: 'Midwest', value: 22.8, stratification1: 'Anxiety' },
        { locationdesc: 'South', value: 19.5, stratification1: 'Anxiety' },
        { locationdesc: 'West', value: 20.1, stratification1: 'Anxiety' },
      ],
      brfss: [
        { locationdesc: 'Urban', value: 20.4, stratification1: 'Mental Health' },
        { locationdesc: 'Suburban', value: 17.2, stratification1: 'Mental Health' },
        { locationdesc: 'Rural', value: 15.8, stratification1: 'Mental Health' },
      ],
      metadata: {
        source: 'BRFSS',
        reliability: 0.82,
        description: 'Mental health indicators across regions and urbanization levels',
        lastUpdated: '2025-02-28'
      }
    };
  }
  
  private getLGBTQHealthData() {
    return {
      fenway: [
        { category: 'Healthcare Access', value: 68.5, stratification1: 'Overall' },
        { category: 'Mental Health Services', value: 58.2, stratification1: 'Overall' },
        { category: 'Preventive Screenings', value: 64.7, stratification1: 'Overall' },
        { category: 'Provider Cultural Competency', value: 42.3, stratification1: 'Overall' },
        { category: 'Healthcare Discrimination', value: 31.8, stratification1: 'Overall' },
      ],
      nhanes: [
        { locationdesc: 'Northeast', value: 72.1, stratification1: 'Healthcare Access' },
        { locationdesc: 'Midwest', value: 65.3, stratification1: 'Healthcare Access' },
        { locationdesc: 'South', value: 58.7, stratification1: 'Healthcare Access' },
        { locationdesc: 'West', value: 68.9, stratification1: 'Healthcare Access' },
      ],
      metadata: {
        source: 'Fenway Institute',
        reliability: 0.79,
        description: 'LGBTQ+ health disparities and healthcare access metrics',
        lastUpdated: '2025-01-15'
      }
    };
  }
}
