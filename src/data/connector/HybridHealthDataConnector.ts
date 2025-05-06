
import { BaseDataConnector } from './BaseDataConnector';
import { NHANESConnector } from './NHANESConnector';
import { BRFSSConnector } from './BRFSSConnector';
import { WHOConnector } from './WHOConnector';
import { FenwayInstituteConnector } from './FenwayInstituteConnector';
import { DataValidationService } from './DataValidationService';
import { HealthDataResponse, MetricsRegistry } from './types';

/**
 * Primary Hybrid Data Connector that orchestrates multiple data sources
 */
export class HybridHealthDataConnector {
  private connectors: Record<string, BaseDataConnector>;
  private dataValidationService: DataValidationService;
  private metricsRegistry: MetricsRegistry;
  
  constructor() {
    // Initialize connectors map
    this.connectors = {};
    
    // Register data validation service
    this.dataValidationService = new DataValidationService();
    
    // Initialize metrics registry
    this.metricsRegistry = this.initializeMetricsRegistry();
    
    // Register default connectors
    this.registerDefaultConnectors();
  }
  
  /**
   * Initialize the metrics registry with category mappings
   * @private
   */
  private initializeMetricsRegistry(): MetricsRegistry {
    return {
      'obesity': {
        primarySources: ['NHANES', 'BRFSS'],
        alternativeSources: ['WHO Global Health Observatory', 'Fenway Institute'],
        description: 'Obesity prevalence among adults',
        unit: '%'
      },
      'diabetes': {
        primarySources: ['NHANES', 'BRFSS'],
        alternativeSources: ['WHO Global Health Observatory'],
        description: 'Diabetes prevalence among adults',
        unit: '%'
      },
      'lgbtq_health': {
        primarySources: ['Fenway Institute'],
        alternativeSources: ['BRFSS'],
        description: 'LGBTQ+ health indicators',
        unit: 'various'
      },
      'global_health': {
        primarySources: ['WHO Global Health Observatory'],
        alternativeSources: [],
        description: 'Global health indicators',
        unit: 'various'
      }
      // Add more metrics as needed
    };
  }
  
  /**
   * Register default connectors
   * @private
   */
  private registerDefaultConnectors(): void {
    this.registerConnector('NHANES', new NHANESConnector());
    this.registerConnector('BRFSS', new BRFSSConnector());
    this.registerConnector('WHO Global Health Observatory', new WHOConnector());
    this.registerConnector('Fenway Institute', new FenwayInstituteConnector());
  }
  
  /**
   * Register a data connector
   * @param name - Name to register the connector under
   * @param connector - The connector instance
   */
  public registerConnector(name: string, connector: BaseDataConnector): void {
    if (!(connector instanceof BaseDataConnector)) {
      throw new Error(`Connector must be an instance of BaseDataConnector`);
    }
    
    this.connectors[name] = connector;
    console.log(`Registered ${name} connector`);
  }
  
  /**
   * Get a registered connector
   * @param name - Name of the connector to retrieve
   * @returns The connector instance
   */
  public getConnector(name: string): BaseDataConnector {
    const connector = this.connectors[name];
    
    if (!connector) {
      throw new Error(`Connector "${name}" not found`);
    }
    
    return connector;
  }
  
  /**
   * Check if a connector is registered
   * @param name - Name of the connector to check
   * @returns Whether the connector is registered
   */
  public hasConnector(name: string): boolean {
    return !!this.connectors[name];
  }
  
  /**
   * Fetch health data using the most appropriate source
   * @param metric - Health metric to fetch
   * @param options - Options for the request
   * @returns Promise with the fetched data and metadata
   */
  public async fetchHealthData(metric: string, options: Record<string, any> = {}): Promise<HealthDataResponse> {
    console.log(`Fetching health data for ${metric}`);
    
    // Determine best source based on metric and options
    const primarySource = this.selectPrimarySource(metric, options);
    
    if (!primarySource || !this.hasConnector(primarySource)) {
      throw new Error(`No suitable data source found for metric: ${metric}`);
    }
    
    try {
      // Try primary source first
      console.log(`Using primary source: ${primarySource}`);
      const primaryConnector = this.getConnector(primarySource);
      const primaryData = await primaryConnector.fetchData(options);
      
      // Validate data integrity
      const validationResult = this.dataValidationService.validate(primaryData);
      
      if (validationResult.isValid) {
        return {
          data: primaryData,
          source: primarySource,
          sourceMetadata: primaryConnector.getSourceMetadata(),
          validationStatus: validationResult
        };
      }
      
      console.log(`Primary source data validation failed: ${validationResult.issues.join(', ')}`);
      
      // Try backup sources if primary validation fails
      const backupSources = this.selectBackupSources(metric, options);
      
      for (const source of backupSources) {
        if (!this.hasConnector(source)) continue;
        
        console.log(`Trying backup source: ${source}`);
        const backupConnector = this.getConnector(source);
        const backupData = await backupConnector.fetchData(options);
        const backupValidation = this.dataValidationService.validate(backupData);
        
        if (backupValidation.isValid) {
          return {
            data: backupData,
            source,
            sourceMetadata: backupConnector.getSourceMetadata(),
            validationStatus: backupValidation,
            fallbackNote: `Primary source (${primarySource}) validation failed: ${validationResult.issues.join(', ')}`
          };
        }
      }
      
      // If we reach here, no valid data was found in any source
      throw new Error(`No valid data found across any sources for metric: ${metric}`);
    } catch (error) {
      console.error('Error fetching health data:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown error fetching health data');
    }
  }
  
  /**
   * Select the best primary source for a given metric
   * @param metric - Health metric to fetch
   * @param options - Additional options
   * @returns Name of the best primary source
   */
  private selectPrimarySource(metric: string, options: Record<string, any> = {}): string | null {
    // Check if the metric is in our registry
    const metricInfo = this.metricsRegistry[metric.toLowerCase()];
    
    if (metricInfo && metricInfo.primarySources.length > 0) {
      // Return the first registered connector from the primary sources list
      for (const source of metricInfo.primarySources) {
        if (this.hasConnector(source)) {
          return source;
        }
      }
    }
    
    // Fallback to tier-based selection if metric not in registry
    const connectorNames = Object.keys(this.connectors);
    
    // Look for Tier 1A connectors first
    const tier1AConnectors = connectorNames.filter(name => 
      this.connectors[name].getSourceMetadata().tier === '1A'
    );
    
    if (tier1AConnectors.length > 0) {
      return tier1AConnectors[0];
    }
    
    // Then try Tier 1B
    const tier1BConnectors = connectorNames.filter(name => 
      this.connectors[name].getSourceMetadata().tier === '1B'
    );
    
    if (tier1BConnectors.length > 0) {
      return tier1BConnectors[0];
    }
    
    return connectorNames[0] || null;
  }
  
  /**
   * Select backup sources for a given metric
   * @param metric - Health metric to fetch
   * @param options - Additional options
   * @returns Array of backup source names
   */
  private selectBackupSources(metric: string, options: Record<string, any> = {}): string[] {
    const backupSources: string[] = [];
    
    // Check if the metric is in our registry
    const metricInfo = this.metricsRegistry[metric.toLowerCase()];
    
    if (metricInfo) {
      // Add alternate sources from the registry
      for (const source of metricInfo.alternativeSources) {
        if (this.hasConnector(source)) {
          backupSources.push(source);
        }
      }
      
      // Add primary sources that aren't already the selected primary source
      const primarySource = this.selectPrimarySource(metric, options);
      for (const source of metricInfo.primarySources) {
        if (source !== primarySource && this.hasConnector(source)) {
          backupSources.push(source);
        }
      }
    }
    
    // If no backup sources found from the registry, use all available connectors
    if (backupSources.length === 0) {
      const primarySource = this.selectPrimarySource(metric, options);
      return Object.keys(this.connectors).filter(name => name !== primarySource);
    }
    
    return backupSources;
  }
  
  /**
   * Get available metrics from the registry
   * @returns List of available metrics
   */
  public getAvailableMetrics(): string[] {
    return Object.keys(this.metricsRegistry);
  }
  
  /**
   * Get information about a specific metric
   * @param metric - The metric to get information for
   * @returns Metric information or null if not found
   */
  public getMetricInfo(metric: string): any {
    return this.metricsRegistry[metric.toLowerCase()] || null;
  }
  
  /**
   * Get registered connector names
   * @returns List of registered connector names
   */
  public getRegisteredConnectors(): string[] {
    return Object.keys(this.connectors);
  }
}
