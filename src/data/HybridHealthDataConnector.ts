import { NHANESConnector } from './connectors/NHANESConnector';
import { BRFSSConnector } from './connectors/BRFSSConnector';
import { WHOConnector } from './connectors/WHOConnector';
import { InternetArchiveConnector } from './connectors/InternetArchiveConnector';
import { DataResponse } from '../utils/types';
import { MultiSourceDataConnector } from './connectors/MultiSourceDataConnector';
import { FenwayInstituteConnector } from './connectors/FenwayInstituteConnector';
import { SourceManager, SourcesInfo } from './utils/SourceManager';
import { COMPROMISED_CATEGORIES } from '../config/dataSourceConfig';

export class HybridHealthDataConnector {
  private nhanes: NHANESConnector;
  private brfss: BRFSSConnector;
  private who: WHOConnector;
  private archive: InternetArchiveConnector;
  private multiSource: MultiSourceDataConnector;
  private fenway: FenwayInstituteConnector;
  private sourceManager: SourceManager;
  
  constructor() {
    // Initialize all connectors
    this.nhanes = new NHANESConnector();
    this.brfss = new BRFSSConnector();
    this.who = new WHOConnector();
    this.archive = new InternetArchiveConnector();
    this.multiSource = new MultiSourceDataConnector();
    this.fenway = new FenwayInstituteConnector();
    this.sourceManager = new SourceManager();
  }
  
  /**
   * Get BMI data from NHANES and BRFSS
   */
  async getBmiData(params?: Record<string, any>): Promise<DataResponse> {
    try {
      // Try NHANES first
      const nhanesData = await this.nhanes.fetchHealthData(params);
      
      // If NHANES fails, try BRFSS
      if (!nhanesData.data || nhanesData.data.length === 0) {
        console.warn('NHANES data unavailable, falling back to BRFSS');
        const brfssData = await this.brfss.fetchHealthData(params);
        return brfssData;
      }
      
      return nhanesData;
    } catch (error) {
      console.error('Error fetching BMI data:', error);
      throw error;
    }
  }
  
  /**
   * Get mental health data from NHANES and BRFSS
   */
  async getMentalHealthData(params?: Record<string, any>): Promise<DataResponse> {
    try {
      // Try NHANES first
      const nhanesData = await this.nhanes.fetchHealthData(params);
      
      // If NHANES fails, try BRFSS
      if (!nhanesData.data || nhanesData.data.length === 0) {
        console.warn('NHANES data unavailable, falling back to BRFSS');
        const brfssData = await this.brfss.fetchHealthData(params);
        return brfssData;
      }
      
      return nhanesData;
    } catch (error) {
      console.error('Error fetching mental health data:', error);
      throw error;
    }
  }
  
  /**
   * Get archived health data from the Internet Archive
   */
  async getArchivedHealthData(params?: Record<string, any>): Promise<DataResponse> {
    try {
      const archiveData = await this.archive.fetchArchivedData(params);
      return archiveData;
    } catch (error) {
      console.error('Error fetching archived health data:', error);
      throw error;
    }
  }
  
  /**
   * Get health data from all potential sources based on category
   */
  async getHealthData(category: string, params?: Record<string, any>): Promise<DataResponse> {
    // Check if this is a sensitive category that may need alternative sources
    const isCompromisedCategory = COMPROMISED_CATEGORIES.some(
      compromisedCategory => category.includes(compromisedCategory)
    );
    
    // If it's a compromised category, use the multi-source connector
    if (isCompromisedCategory && Math.random() > 0.3) { // 70% chance to use alternative source for compromised categories
      try {
        console.log(`Using alternative source for compromised category: ${category}`);
        return await this.multiSource.getHealthData(category, params);
      } catch (error) {
        console.warn(`Failed to fetch from alternative source for ${category}, falling back to standard sources`);
        // Continue to standard sources if alternative fails
      }
    }
    
    try {
      let result: DataResponse;
      
      // Choose data source based on category
      switch (category) {
        case 'obesity':
          result = await this.getBmiData(params);
          break;
        case 'mental-health':
          result = await this.getMentalHealthData(params);
          break;
        case 'lgbtq-health':
          // For LGBTQ health data, try Fenway Institute first
          try {
            result = await this.fenway.fetchLgbtqHealthDisparities();
          } catch (error) {
            // Fallback to multi-source connector
            result = await this.multiSource.getHealthData(category, params);
          }
          break;
        case 'archived':
          result = await this.getArchivedHealthData(params);
          break;
        default:
          console.warn(`No specific handling for category: ${category}, using NHANES as default`);
          result = await this.nhanes.fetchHealthData(params);
      }
      
      return result;
    } catch (error) {
      console.error(`Error fetching health data for ${category}:`, error);
      throw error;
    }
  }
  
  /**
   * Get sources status information
   */
  getSourcesStatus() {
    return this.sourceManager.getSourceStatus();
  }
  
  /**
   * Get information about all data sources
   */
  getSourcesInfo(): SourcesInfo {
    return this.sourceManager.getSourcesInfo(COMPROMISED_CATEGORIES);
  }
}
