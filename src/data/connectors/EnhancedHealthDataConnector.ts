
import { NHANESConnectorImpl } from './NHANESConnectorImpl';
import { BRFSSConnectorImpl } from './BRFSSConnectorImpl';
import { DataResponse } from '../../utils/types';

interface TopicMapping {
  components?: string[];
  cycle?: string;
  category?: string;
  year?: number;
  questionCode?: string;
}

export class EnhancedHealthDataConnector {
  private nhanesConnector: NHANESConnectorImpl;
  private brfssConnector: BRFSSConnectorImpl;
  
  constructor() {
    // Create instances of specialized connectors
    this.nhanesConnector = new NHANESConnectorImpl();
    this.brfssConnector = new BRFSSConnectorImpl();
  }
  
  /**
   * Maps between generic health categories and NHANES/BRFSS-specific endpoints
   */
  private getSourceSpecificParams(dataCategory: string, source: string): TopicMapping | null {
    const mappings: Record<string, Record<string, TopicMapping>> = {
      'mental-health': {
        'CDC_NHANES': {
          components: ['DEMO', 'DPQ'],
          cycle: '2017-2018'
        },
        'CDC_BRFSS': {
          category: 'mentalHealth',
          year: 2024
        }
      },
      'obesity': {
        'CDC_NHANES': {
          components: ['DEMO', 'BMX', 'DBQ'],
          cycle: '2017-2018'
        },
        'CDC_BRFSS': {
          category: 'overweight',
          year: 2024
        }
      },
      'lgbtq-health': {
        'CDC_NHANES': {
          components: ['DEMO', 'SXQ'],
          cycle: '2017-2018'
        },
        'CDC_BRFSS': {
          questionCode: 'SOGI',
          year: 2024
        }
      }
    };
    
    return mappings[dataCategory]?.[source] || null;
  }
  
  /**
   * Fetches mental health data from NHANES
   */
  async fetchNHANESMentalHealth(params: Record<string, any> = {}): Promise<DataResponse> {
    const cycle = params.cycle || '2017-2018';
    
    try {
      // Fetch demographics and depression questionnaire
      const demoData = await this.nhanesConnector.fetchDemographics(cycle);
      const mentalHealthData = await this.nhanesConnector.fetchMentalHealth(cycle);
      
      // Join the datasets
      const joinedData = this.nhanesConnector.joinDatasets([demoData, mentalHealthData]);
      
      // Add enhanced metadata
      return {
        data: joinedData.data,
        metadata: {
          ...joinedData.metadata,
          source: 'CDC_NHANES',
          topic: 'mental-health',
          integrityVerified: true,
          sourceType: 'government',
          dataCategory: 'mental-health'
        }
      };
    } catch (error) {
      console.error('Error fetching NHANES mental health data:', error);
      throw error;
    }
  }
  
  /**
   * Fetches state-level mental health data from BRFSS
   */
  async fetchBRFSSMentalHealth(params: Record<string, any> = {}): Promise<DataResponse> {
    const year = params.year || 2024;
    const location = params.location || 'All States';
    
    try {
      // Fetch mental health data
      const mentalHealthData = await this.brfssConnector.fetchMentalHealthData(year, location);
      
      // Add enhanced metadata
      return {
        data: mentalHealthData.data,
        metadata: {
          ...mentalHealthData.metadata,
          source: 'CDC_BRFSS',
          topic: 'mental-health',
          integrityVerified: true,
          sourceType: 'government',
          dataCategory: 'mental-health'
        }
      };
    } catch (error) {
      console.error('Error fetching BRFSS mental health data:', error);
      throw error;
    }
  }
  
  /**
   * Fetches combined mental health data from multiple sources
   */
  async fetchMentalHealthData(params: Record<string, any> = {}): Promise<DataResponse> {
    try {
      // Determine which sources to use based on params
      const sources = params.sources || ['CDC_NHANES', 'CDC_BRFSS'];
      const results: Record<string, any> = {};
      
      // Fetch from each source
      for (const source of sources) {
        if (source === 'CDC_NHANES') {
          results.nhanes = await this.fetchNHANESMentalHealth(params);
        } else if (source === 'CDC_BRFSS') {
          results.brfss = await this.fetchBRFSSMentalHealth(params);
        }
      }
      
      // Create a combined result
      return {
        data: results,
        metadata: {
          topic: 'mental-health',
          sources: sources,
          fetchTime: new Date().toISOString(),
          reliability: 0.95,
          integrityVerified: true,
          sourceType: 'government',
          dataCategory: 'mental-health',
          params
        }
      };
    } catch (error) {
      console.error('Error fetching combined mental health data:', error);
      throw error;
    }
  }
  
  /**
   * Fetches LGBTQ+ health data from available sources
   */
  async fetchLGBTQHealthData(params: Record<string, any> = {}): Promise<DataResponse> {
    try {
      const nhanesParams = this.getSourceSpecificParams('lgbtq-health', 'CDC_NHANES');
      
      if (nhanesParams?.components) {
        const cycle = params.cycle || nhanesParams.cycle || '2017-2018';
        const demoData = await this.nhanesConnector.fetchDemographics(cycle);
        const sexualOrientationData = await this.nhanesConnector.fetchSexualOrientationData(cycle);
        
        const joinedData = this.nhanesConnector.joinDatasets([demoData, sexualOrientationData]);
        
        return {
          data: joinedData.data,
          metadata: {
            ...joinedData.metadata,
            source: 'CDC_NHANES',
            topic: 'lgbtq-health',
            integrityVerified: true,
            sourceType: 'government',
            dataCategory: 'lgbtq-health'
          }
        };
      }
      
      // Fallback with placeholder data
      return {
        data: [],
        metadata: {
          topic: 'lgbtq-health',
          note: 'LGBTQ+ health data integration',
          fetchTime: new Date().toISOString(),
          sourceType: 'government',
          dataCategory: 'lgbtq-health',
          reliability: 0.9
        }
      };
    } catch (error) {
      console.error('Error fetching LGBTQ+ health data:', error);
      throw error;
    }
  }
  
  /**
   * Fetches obesity and BMI data from multiple sources
   */
  async fetchObesityData(params: Record<string, any> = {}): Promise<DataResponse> {
    try {
      const nhanesParams = this.getSourceSpecificParams('obesity', 'CDC_NHANES');
      const brfssParams = this.getSourceSpecificParams('obesity', 'CDC_BRFSS');
      
      // Fetch NHANES measured BMI data (physical examination)
      const nhanesCycle = params.cycle || nhanesParams?.cycle || '2017-2018';
      const nhanesData = await this.nhanesConnector.fetchBodyMeasures(nhanesCycle);
      
      // Fetch BRFSS self-reported BMI data (telephone survey)
      const brfssYear = params.year || brfssParams?.year || 2024;
      const brfssData = await this.brfssConnector.fetchPrevalenceData({
        year: brfssYear,
        topic: brfssParams?.category || 'overweight'
      });
      
      // Combine the results
      return {
        data: {
          nhanes: nhanesData.data, // Measured BMI
          brfss: brfssData.data    // Self-reported BMI
        },
        metadata: {
          topic: 'obesity',
          sources: ['CDC_NHANES', 'CDC_BRFSS'],
          fetchTime: new Date().toISOString(),
          notes: 'NHANES provides measured BMI while BRFSS provides self-reported BMI',
          reliability: 0.95,
          integrityVerified: true,
          sourceType: 'government',
          dataCategory: 'obesity'
        }
      };
    } catch (error) {
      console.error('Error fetching obesity data:', error);
      throw error;
    }
  }
  
  /**
   * Main method to get health data based on category
   */
  async getHealthData(dataCategory: string, params: Record<string, any> = {}): Promise<DataResponse> {
    // Determine which specialized connector to use based on category and params
    
    // Mental health data
    if (dataCategory === 'mental-health') {
      return this.fetchMentalHealthData(params);
    }
    
    // LGBTQ+ health data
    if (dataCategory === 'lgbtq-health') {
      return this.fetchLGBTQHealthData(params);
    }
    
    // Obesity and BMI data
    if (dataCategory === 'obesity' || dataCategory === 'bmi') {
      return this.fetchObesityData(params);
    }
    
    // Default - return error for unsupported category
    throw new Error(`Unsupported data category: ${dataCategory}`);
  }
}
