
import { BRFSSConnector } from './connectors/BRFSSConnector';
import { NHANESConnector } from './connectors/NHANESConnector';
import { WHOConnector } from './connectors/WHOConnector';
import { InternetArchiveConnector } from './connectors/InternetArchiveConnector';
import { FenwayInstituteConnector } from './connectors/FenwayInstituteConnector';

/**
 * Factory for creating and retrieving data connectors
 */
export class ConnectorFactory {
  private static instance: ConnectorFactory;
  private connectors: Map<string, any>;
  
  private constructor() {
    this.connectors = new Map();
    this.initialize();
  }
  
  /**
   * Get the singleton instance
   */
  public static getInstance(): ConnectorFactory {
    if (!ConnectorFactory.instance) {
      ConnectorFactory.instance = new ConnectorFactory();
    }
    return ConnectorFactory.instance;
  }
  
  /**
   * Initialize all connectors
   */
  private initialize(): void {
    // Initialize connectors
    this.connectors.set('brfss', new BRFSSConnector());
    this.connectors.set('nhanes', new NHANESConnector());
    this.connectors.set('who', new WHOConnector());
    this.connectors.set('archive', new InternetArchiveConnector());
    this.connectors.set('fenway', new FenwayInstituteConnector());
  }
  
  /**
   * Get a connector by source name
   */
  public getConnector(source: string): any {
    const connector = this.connectors.get(source);
    if (!connector) {
      throw new Error(`Unknown source: ${source}`);
    }
    return connector;
  }
}
