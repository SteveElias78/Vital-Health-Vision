
import axios from 'axios';
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

export class NHANESConnectorImpl extends BaseDataConnector {
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
  
  getAvailableSurveys() {
    return this.availableSurveys;
  }
  
  getDataComponents() {
    return this.dataComponents;
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
  async fetchDemographics<T = any[]>(cycle: string, params: Record<string, any> = {}): Promise<DataResponse<T>> {
    return this.fetchDataComponent<T>(cycle, 'DEMO', params);
  }
  
  /**
   * Fetches body measures data
   */
  async fetchBodyMeasures<T = any[]>(cycle: string, params: Record<string, any> = {}): Promise<DataResponse<T>> {
    return this.fetchDataComponent<T>(cycle, 'BMX', params);
  }
  
  /**
   * Fetches mental health data
   */
  async fetchMentalHealth<T = any[]>(cycle: string, params: Record<string, any> = {}): Promise<DataResponse<T>> {
    return this.fetchDataComponent<T>(cycle, 'DPQ', params);
  }
  
  /**
   * Fetches sexual orientation and behavior data where available
   */
  async fetchSexualOrientationData<T = any[]>(cycle: string, params: Record<string, any> = {}): Promise<DataResponse<T>> {
    return this.fetchDataComponent<T>(cycle, 'SXQ', params);
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
  
  /**
   * Fetches a predefined health topic that combines relevant NHANES components
   */
  async fetchHealthTopic<T = any[]>(topic: string, cycle: string, params: Record<string, any> = {}): Promise<DataResponse<T>> {
    try {
      // Define which components are needed for each topic
      const topicComponents: Record<string, string[]> = {
        diabetes: ['DEMO', 'DIQ', 'BMX', 'BIOPRO', 'GLU'],
        obesity: ['DEMO', 'BMX', 'PAQ', 'DBQ'],
        mentalHealth: ['DEMO', 'DPQ', 'SLQ', 'ALQ'],
        lgbtqHealth: ['DEMO', 'SXQ']
      };
      
      // Get components for the requested topic
      const components = topicComponents[topic];
      if (!components) {
        throw new Error(`Unknown health topic: ${topic}`);
      }
      
      // Fetch all required components
      const promises = components.map(component => 
        this.fetchDataComponent(cycle, component, params)
      );
      
      const datasets = await Promise.all(promises);
      
      // Join the datasets by SEQN
      const joinedData = this.joinDatasets(datasets);
      
      return {
        data: joinedData.data as T,
        metadata: {
          ...joinedData.metadata,
          topic
        }
      };
    } catch (error) {
      console.error(`Error fetching health topic ${topic}:`, error);
      throw error;
    }
  }
}
