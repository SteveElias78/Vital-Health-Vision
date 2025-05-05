
export interface SourceMapping {
  source: string;
  method: string;
  params: Record<string, any>;
}

export interface CategoryMapping {
  primary: SourceMapping[];
  secondary: SourceMapping[];
}

export class DataMappingUtils {
  static getDataSourceMapping(): Record<string, CategoryMapping> {
    return {
      'obesity': {
        primary: [
          { source: 'nhanes', method: 'fetchBodyMeasures', params: { cycle: '2017-2018' } },
          { source: 'brfss', method: 'fetchData', params: { category: 'overweight' } }
        ],
        secondary: [
          { source: 'archive', method: 'fetchArchivedData', params: { datasetName: 'obesity' } }
        ]
      },
      'mental-health': {
        primary: [
          { source: 'nhanes', method: 'fetchMentalHealth', params: { cycle: '2017-2018' } },
          { source: 'brfss', method: 'fetchData', params: { category: 'mentalHealth' } }
        ],
        secondary: [
          { source: 'archive', method: 'fetchArchivedData', params: { datasetName: 'mental-health' } }
        ]
      },
      'lgbtq-health': {
        primary: [
          { source: 'nhanes', method: 'fetchSexualOrientationData', params: { cycle: '2017-2018' } },
          { source: 'brfss', method: 'fetchData', params: { category: 'lgbtq' } }
        ],
        secondary: [
          { source: 'fenway', method: 'fetchLgbtqHealthDisparities', params: {} },
          { source: 'archive', method: 'fetchLgbtqHealthData', params: {} }
        ]
      },
      'minority-health': {
        primary: [
          { source: 'nhanes', method: 'fetchDemographics', params: { cycle: '2017-2018' } },
          { source: 'brfss', method: 'fetchData', params: { breakoutBy: 'Race/Ethnicity' } }
        ],
        secondary: [
          { source: 'archive', method: 'fetchMinorityHealthData', params: {} }
        ]
      },
      'global-health': {
        primary: [
          { source: 'who', method: 'fetchIndicatorData', params: {} }
        ],
        secondary: []
      }
    };
  }

  /**
   * Get sources for a specific category
   */
  static getSourcesForCategory(
    category: string, 
    isCompromised: boolean
  ): { 
    primarySources: SourceMapping[], 
    secondarySources: SourceMapping[] 
  } {
    const mapping = this.getDataSourceMapping()[category];
    
    if (!mapping) {
      throw new Error(`No data source mapping for category: ${category}`);
    }
    
    // For compromised categories, prioritize alternative sources
    const primarySources = isCompromised 
      ? [...mapping.secondary, ...mapping.primary] 
      : mapping.primary;
    
    const secondarySources = isCompromised
      ? []
      : mapping.secondary;
    
    return { primarySources, secondarySources };
  }

  /**
   * Get available data categories
   */
  static getAvailableCategories(): string[] {
    return Object.keys(this.getDataSourceMapping());
  }
}
