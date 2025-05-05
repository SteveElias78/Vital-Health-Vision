
import { GOVERNMENT_SOURCES, ALTERNATIVE_SOURCES } from '../../config/dataSourceConfig';

export interface SourceStatus {
  available: boolean;
  lastChecked: Date | null;
  lastSuccessful: Date | null;
  failureCount: number;
  integrityVerified?: boolean;
}

export interface DataSourceStatusMap {
  [key: string]: SourceStatus;
}

export interface SourceInfo {
  id: string;
  name: string;
  reliability: number;
  categories: string[];
  status: SourceStatus;
}

export interface SourcesInfo {
  government: SourceInfo[];
  alternative: SourceInfo[];
  compromisedCategories: string[];
}

export class SourceManager {
  private dataSourceStatus: DataSourceStatusMap;

  constructor() {
    this.dataSourceStatus = {};
    this.initializeSourceStatus();
  }

  /**
   * Initialize source status tracking
   */
  private initializeSourceStatus(): void {
    // Initialize government sources
    Object.keys(GOVERNMENT_SOURCES).forEach(source => {
      this.dataSourceStatus[source] = {
        available: true,
        lastChecked: null,
        lastSuccessful: null,
        failureCount: 0,
        integrityVerified: false
      };
    });
    
    // Initialize alternative sources
    Object.keys(ALTERNATIVE_SOURCES).forEach(source => {
      this.dataSourceStatus[source] = {
        available: true,
        lastChecked: null,
        lastSuccessful: null,
        failureCount: 0,
      };
    });
  }

  /**
   * Update the status of a data source
   */
  updateSourceStatus(source: string, success: boolean, integrityVerified: boolean = false): void {
    const now = new Date();
    
    if (!this.dataSourceStatus[source]) {
      this.dataSourceStatus[source] = {
        available: true,
        lastChecked: now,
        lastSuccessful: null,
        failureCount: 0,
        integrityVerified: false
      };
    }
    
    this.dataSourceStatus[source].lastChecked = now;
    
    if (success) {
      this.dataSourceStatus[source].lastSuccessful = now;
      this.dataSourceStatus[source].failureCount = 0;
      this.dataSourceStatus[source].available = true;
      
      if (integrityVerified) {
        this.dataSourceStatus[source].integrityVerified = true;
      }
    } else {
      this.dataSourceStatus[source].failureCount += 1;
      
      // Mark source as unavailable after 3 consecutive failures
      if (this.dataSourceStatus[source].failureCount >= 3) {
        this.dataSourceStatus[source].available = false;
      }
    }
  }

  /**
   * Check if a source is available
   */
  isSourceAvailable(source: string): boolean {
    return this.dataSourceStatus[source]?.available !== false;
  }

  /**
   * Get the status of all sources
   */
  getSourceStatus(): DataSourceStatusMap {
    return this.dataSourceStatus;
  }

  /**
   * Determine if a source is a government source
   */
  isGovernmentSource(source: string): boolean {
    return ['nhanes', 'brfss', 'who', 'nih', 'cdc'].includes(source);
  }

  /**
   * Get reliability score for a source
   */
  getSourceReliability(source: string): number {
    if (source === 'nhanes') return 0.95;
    if (source === 'brfss') return 0.9;
    if (source === 'who') return 0.95;
    if (source === 'archive') return 0.9;
    if (source === 'fenway') return 0.9;
    return 0.8; // Default
  }

  /**
   * Get information about data sources
   */
  getSourcesInfo(compromisedCategories: string[]): SourcesInfo {
    return {
      government: Object.entries(GOVERNMENT_SOURCES).map(([id, config]) => ({
        id,
        name: id.replace(/_/g, ' '),
        reliability: config.reliability || 0,
        categories: config.categories || [],
        status: this.dataSourceStatus[id] || { available: false, lastChecked: null, lastSuccessful: null, failureCount: 0 }
      })),
      alternative: Object.entries(ALTERNATIVE_SOURCES).map(([id, config]) => ({
        id,
        name: id.replace(/_/g, ' '),
        reliability: config.reliability || 0,
        categories: config.categories || [],
        status: this.dataSourceStatus[id] || { available: false, lastChecked: null, lastSuccessful: null, failureCount: 0 }
      })),
      compromisedCategories
    };
  }
}
