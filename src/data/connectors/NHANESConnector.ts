import { BaseDataConnector } from '../../utils/BaseDataConnector';
import { GOVERNMENT_SOURCES } from '../../config/dataSourceConfig';
import { DataResponse } from '../../utils/types';

// Define interfaces for the NHANES connector
interface SurveyCycle {
  cycle: string;
  notes: string;
}

interface DataComponents {
  demographics: string[];
  examination: string[];
  laboratory: string[];
  questionnaire: string[];
}

interface JoinedDataset {
  data: any[];
  metadata: {
    source: string;
    components: string[];
    cycle?: string;
    fetchTime: string;
    reliability: number;
    dataType: string;
    joinField: string;
    recordCount: number;
    [key: string]: any;
  };
}

export class NHANESConnector extends BaseDataConnector {
  protected availableSurveys: SurveyCycle[];
  protected dataComponents: DataComponents;
  
  constructor() {
    super('NHANES', GOVERNMENT_SOURCES.NHANES);
    
    // Available survey cycles
    this.availableSurveys = [
      { cycle: '2021-2023', notes: 'Partial cycle due to COVID-19 impact' },
      { cycle: '2017-March 2020', notes: 'Prepandemic file' },
      { cycle: '2017-2018', notes: 'Complete cycle' },
      { cycle: '2015-2016', notes: 'Complete cycle' },
      { cycle: '2013-2014', notes: 'Complete cycle' }
    ];
    
    // Data components in NHANES
    this.dataComponents = {
      demographics: ['DEMO', 'DSQIDS', 'DSQTOT'],
      examination: ['BMX', 'BPX', 'OHXDEN', 'VIX', 'DXXFEM'],
      laboratory: ['CBC', 'BIOPRO', 'HDL', 'TCHOL', 'INSULIN'],
      questionnaire: ['ACQ', 'ALQ', 'DIQ', 'DPQ', 'HSQ', 'MCQ', 'PAQ', 'SXQ', 'SMQ']
    };
  }
  
  /**
   * General method to fetch health data with various parameters
   */
  async fetchHealthData<T = any>(params?: Record<string, any>): Promise<DataResponse<T>> {
    try {
      const component = params?.component || 'DEMO';
      const cycle = params?.cycle || '2017-2018';
      
      return this.fetchDataComponent<T>(cycle, component, params);
    } catch (error) {
      console.error('Error fetching NHANES health data:', error);
      throw error;
    }
  }
  
  /**
   * Fetches a specific NHANES data component
   */
  async fetchDataComponent<T = any[]>(
    cycle: string, 
    component: string, 
    params: Record<string, any> = {}
  ): Promise<DataResponse<T>> {
    try {
      // Construct the URL for the JSON API
      const endpoint = `${cycle}/${component}.json`;
      
      // Make the request
      const result = await this.makeRequest<T>(endpoint, params);
      
      // Add more specific metadata
      result.metadata = {
        ...result.metadata,
        cycle,
        component,
        dataType: 'measured',
        reliability: 0.95
      };
      
      return result;
    } catch (error) {
      console.error(`Error fetching NHANES data for ${cycle}/${component}:`, error);
      throw error;
    }
  }
  
  /**
   * Fetches demographic data for a specific cycle
   */
  async fetchDemographics<T = any[]>(cycle: string): Promise<DataResponse<T>> {
    return this.fetchDataComponent<T>(cycle, 'DEMO');
  }
  
  /**
   * Fetches body measures data
   */
  async fetchBodyMeasures<T = any[]>(cycle: string): Promise<DataResponse<T>> {
    return this.fetchDataComponent<T>(cycle, 'BMX');
  }
  
  /**
   * Fetches mental health data
   */
  async fetchMentalHealth<T = any[]>(cycle: string): Promise<DataResponse<T>> {
    return this.fetchDataComponent<T>(cycle, 'DPQ');
  }
  
  /**
   * Fetches sexual orientation and behavior data where available
   */
  async fetchSexualOrientationData<T = any[]>(cycle: string): Promise<DataResponse<T>> {
    return this.fetchDataComponent<T>(cycle, 'SXQ');
  }
  
  /**
   * Joins multiple NHANES components by SEQN (participant ID)
   */
  joinDatasets(datasets: DataResponse<any[]>[]): JoinedDataset {
    // Extract all data arrays
    const dataArrays = datasets.map(ds => ds.data);
    
    // Create a map to join by SEQN
    const recordMap = new Map<number, Record<string, any>>();
    
    // Initialize with first dataset
    if (dataArrays[0] && Array.isArray(dataArrays[0])) {
      dataArrays[0].forEach(record => {
        if (record.SEQN) {
          recordMap.set(record.SEQN, { ...record });
        }
      });
    }
    
    // Join additional datasets
    for (let i = 1; i < dataArrays.length; i++) {
      if (dataArrays[i] && Array.isArray(dataArrays[i])) {
        dataArrays[i].forEach(record => {
          if (record.SEQN && recordMap.has(record.SEQN)) {
            // Merge with existing record
            const existingRecord = recordMap.get(record.SEQN);
            if (existingRecord) {
              recordMap.set(record.SEQN, {
                ...existingRecord,
                ...record
              });
            }
          }
        });
      }
    }
    
    // Convert back to array
    const joinedData = Array.from(recordMap.values());
    
    // Create combined metadata
    const combinedMetadata = {
      source: 'NHANES',
      components: datasets.map(ds => ds.metadata.component),
      cycle: datasets[0]?.metadata.cycle,
      fetchTime: new Date().toISOString(),
      reliability: 0.95,
      dataType: 'measured',
      joinField: 'SEQN',
      recordCount: joinedData.length
    };
    
    return {
      data: joinedData,
      metadata: combinedMetadata
    };
  }
}
