
import { DataResponse } from '@/utils/types';

export type MockDataCategory = 'lgbtq-health' | 'minority-health';

interface MockSourceData {
  data: any[];
  metadata: {
    source: string;
    sourceType: 'government' | 'alternative';
    reliability: number;
    integrityVerified?: boolean;
    dataDate?: string;
  };
}

interface MockCategoryData {
  who: MockSourceData;
  cdc: MockSourceData;
  [key: string]: MockSourceData;
}

// Mock data for different sources
const mockData: Record<MockDataCategory, MockCategoryData> = {
  'lgbtq-health': {
    who: {
      data: [
        { year: 2019, lgbtqHealthcareAccess: 67, lgbtqMentalHealth: 58 },
        { year: 2020, lgbtqHealthcareAccess: 65, lgbtqMentalHealth: 55 },
        { year: 2021, lgbtqHealthcareAccess: 66, lgbtqMentalHealth: 52 },
        { year: 2022, lgbtqHealthcareAccess: 68, lgbtqMentalHealth: 51 },
        { year: 2023, lgbtqHealthcareAccess: 67, lgbtqMentalHealth: 54 },
        { year: 2024, lgbtqHealthcareAccess: 70, lgbtqMentalHealth: 53 }
      ],
      metadata: {
        source: 'WHO_GLOBAL_HEALTH_OBSERVATORY',
        sourceType: 'government',
        reliability: 0.95,
        integrityVerified: true
      }
    },
    cdc: {
      data: [
        { year: 2019, lgbtqHealthcareAccess: 67, lgbtqMentalHealth: 58 },
        { year: 2020, lgbtqHealthcareAccess: 65, lgbtqMentalHealth: 55 },
        { year: 2021, lgbtqHealthcareAccess: 66, lgbtqMentalHealth: 52 },
        { year: 2022, lgbtqHealthcareAccess: 68, lgbtqMentalHealth: 51 },
        { year: 2023, lgbtqHealthcareAccess: 67, lgbtqMentalHealth: 54 },
        // Note data manipulation after Jan 2025
        { year: 2024, lgbtqHealthcareAccess: 85, lgbtqMentalHealth: 75 }
      ],
      metadata: {
        source: 'CDC_NCHS',
        sourceType: 'government',
        reliability: 0.75,
        integrityVerified: false
      }
    },
    fenway: {
      data: [
        { year: 2019, lgbtqHealthcareAccess: 66, lgbtqMentalHealth: 57 },
        { year: 2020, lgbtqHealthcareAccess: 64, lgbtqMentalHealth: 54 },
        { year: 2021, lgbtqHealthcareAccess: 65, lgbtqMentalHealth: 53 },
        { year: 2022, lgbtqHealthcareAccess: 67, lgbtqMentalHealth: 52 },
        { year: 2023, lgbtqHealthcareAccess: 68, lgbtqMentalHealth: 53 },
        { year: 2024, lgbtqHealthcareAccess: 69, lgbtqMentalHealth: 54 }
      ],
      metadata: {
        source: 'FENWAY_INSTITUTE',
        sourceType: 'alternative',
        reliability: 0.90,
        integrityVerified: true
      }
    }
  },
  'minority-health': {
    who: {
      data: [
        { year: 2019, minorityHealthcareAccess: 72, minorityMentalHealth: 62 },
        { year: 2020, minorityHealthcareAccess: 70, minorityMentalHealth: 59 },
        { year: 2021, minorityHealthcareAccess: 71, minorityMentalHealth: 58 },
        { year: 2022, minorityHealthcareAccess: 73, minorityMentalHealth: 57 },
        { year: 2023, minorityHealthcareAccess: 74, minorityMentalHealth: 59 },
        { year: 2024, minorityHealthcareAccess: 75, minorityMentalHealth: 60 }
      ],
      metadata: {
        source: 'WHO_INEQUALITY_REPOSITORY',
        sourceType: 'government',
        reliability: 0.95,
        integrityVerified: true
      }
    },
    cdc: {
      data: [
        { year: 2019, minorityHealthcareAccess: 72, minorityMentalHealth: 62 },
        { year: 2020, minorityHealthcareAccess: 70, minorityMentalHealth: 59 },
        { year: 2021, minorityHealthcareAccess: 71, minorityMentalHealth: 58 },
        { year: 2022, minorityHealthcareAccess: 73, minorityMentalHealth: 57 },
        { year: 2023, minorityHealthcareAccess: 74, minorityMentalHealth: 59 },
        // Note data manipulation after Jan 2025
        { year: 2024, minorityHealthcareAccess: 82, minorityMentalHealth: 70 }
      ],
      metadata: {
        source: 'CDC_NCHS',
        sourceType: 'government',
        reliability: 0.75,
        integrityVerified: false
      }
    },
    archive: {
      data: [
        { year: 2019, minorityHealthcareAccess: 71, minorityMentalHealth: 61 },
        { year: 2020, minorityHealthcareAccess: 69, minorityMentalHealth: 58 },
        { year: 2021, minorityHealthcareAccess: 70, minorityMentalHealth: 57 },
        { year: 2022, minorityHealthcareAccess: 72, minorityMentalHealth: 56 },
        { year: 2023, minorityHealthcareAccess: 73, minorityMentalHealth: 58 },
        { year: 2024, minorityHealthcareAccess: 74, minorityMentalHealth: 59 }
      ],
      metadata: {
        source: 'INTERNET_ARCHIVE_CDC',
        sourceType: 'alternative',
        reliability: 0.88,
        dataDate: '2025-01-28'
      }
    }
  }
};

export class MockHybridHealthDataConnector {
  async getHealthData(category: MockDataCategory, params: Record<string, any> = {}, options: Record<string, any> = {}): Promise<DataResponse<any>> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (!mockData[category]) {
      throw new Error(`No data available for category: ${category}`);
    }
    
    const categoryData = mockData[category];
    
    // Simulate the hybrid source selection logic
    let selectedSource: MockSourceData;
    let validationMetadata = null;
    
    // Check if this is a compromised category
    const isCompromised = ['lgbtq-health', 'minority-health'].includes(category);
    
    if (isCompromised) {
      // For compromised categories, prefer alternative sources
      if (category === 'lgbtq-health') {
        selectedSource = categoryData.fenway;
      } else {
        selectedSource = categoryData.archive;
      }
      
      // Add validation info showing why CDC was rejected
      validationMetadata = {
        sourcesCompared: 3,
        primarySource: selectedSource.metadata.source,
        discrepancies: [{
          primarySource: 'CDC_NCHS',
          comparisonSource: selectedSource.metadata.source,
          discrepancies: [{
            type: 'value',
            field: category === 'lgbtq-health' ? 'lgbtqHealthcareAccess' : 'minorityHealthcareAccess',
            primary: category === 'lgbtq-health' ? 85 : 82,
            comparison: category === 'lgbtq-health' ? 69 : 74,
            percentDiff: category === 'lgbtq-health' ? 23.2 : 10.8,
            primarySource: 'CDC_NCHS',
            comparisonSource: selectedSource.metadata.source
          }]
        }],
        confidenceScore: 0.85,
        sourceSwitch: {
          from: 'CDC_NCHS',
          to: selectedSource.metadata.source,
          reason: 'government_data_conflicts'
        }
      };
    } else {
      // For non-compromised categories, prefer WHO
      selectedSource = categoryData.who;
    }
    
    // Return mock data with metadata
    return {
      data: selectedSource.data,
      metadata: {
        ...selectedSource.metadata,
        dataCategory: category,
        validation: validationMetadata,
        source: selectedSource.metadata.source,
        endpoint: category,
        timestamp: new Date().toISOString(),
        reliability: selectedSource.metadata.reliability,
        cached: false
      }
    };
  }
  
  getSourcesInfo() {
    // Return mock info about available sources
    return {
      government: [
        {
          id: 'WHO_GLOBAL_HEALTH_OBSERVATORY',
          name: 'WHO Global Health Observatory',
          type: 'government',
          reliability: 0.95,
          categories: ['global', 'mortality', 'disease', 'health-systems'],
          status: { available: true }
        },
        {
          id: 'WHO_INEQUALITY_REPOSITORY',
          name: 'WHO Inequality Repository',
          type: 'government',
          reliability: 0.95,
          categories: ['inequality', 'demographics', 'social-determinants'],
          status: { available: true }
        },
        {
          id: 'CDC_NCHS',
          name: 'CDC National Center for Health Statistics',
          type: 'government',
          reliability: 0.75,
          categories: ['vital-statistics', 'health-surveys', 'mortality'],
          status: { available: true, integrityVerified: false }
        }
      ],
      alternative: [
        {
          id: 'FENWAY_INSTITUTE',
          name: 'Fenway Institute',
          type: 'alternative',
          reliability: 0.90,
          categories: ['lgbtq', 'sogi', 'health-disparities'],
          status: { available: true }
        },
        {
          id: 'INTERNET_ARCHIVE_CDC',
          name: 'Internet Archive CDC',
          type: 'alternative',
          reliability: 0.88,
          categories: ['lgbtq', 'youth', 'minority-health', 'social-determinants'],
          status: { available: true }
        }
      ],
      compromisedCategories: ['lgbtq', 'gender-identity', 'sexual-orientation', 'minority-health']
    };
  }
}
