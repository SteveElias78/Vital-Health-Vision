
import { SourceHealthCheck, SourceHealthResults } from '../types';

/**
 * Responsible for checking health of data sources
 */
export class SourceHealthChecker {
  private sourceHealthChecks: Record<string, SourceHealthCheck>;
  
  constructor() {
    this.sourceHealthChecks = {};
  }
  
  /**
   * Check health of all data sources
   */
  async checkAllSourcesHealth(sources: { government: any[], alternative: any[] }): Promise<SourceHealthResults> {
    const results: SourceHealthResults = {};
    
    // Check government sources
    for (const source of sources.government) {
      results[source.id] = await this.checkSourceHealth(source.id);
    }
    
    // Check alternative sources
    for (const source of sources.alternative) {
      results[source.id] = await this.checkSourceHealth(source.id);
    }
    
    return results;
  }
  
  /**
   * Check health of a specific source
   */
  async checkSourceHealth(sourceId: string): Promise<SourceHealthCheck> {
    // If we already have a recent check, return it
    if (this.sourceHealthChecks[sourceId]) {
      const check = this.sourceHealthChecks[sourceId];
      
      // If check is less than 1 hour old, use cached result
      if (Date.now() - check.timestamp < 60 * 60 * 1000) {
        return check;
      }
    }
    
    try {
      // Try to fetch a small amount of test data
      const result = await this.testSourceConnectivity(sourceId);
      
      // Store health check result
      const healthCheck: SourceHealthCheck = {
        sourceId,
        status: result ? 'healthy' : 'unhealthy',
        timestamp: Date.now()
      };
      
      this.sourceHealthChecks[sourceId] = healthCheck;
      
      return healthCheck;
    } catch (error: any) {
      // Source is unhealthy
      const healthCheck: SourceHealthCheck = {
        sourceId,
        status: 'unhealthy',
        error: error.message,
        timestamp: Date.now()
      };
      
      this.sourceHealthChecks[sourceId] = healthCheck;
      
      return healthCheck;
    }
  }
  
  /**
   * Helper method to test source connectivity
   * In a real implementation, this would make an actual API call
   */
  private async testSourceConnectivity(sourceId: string): Promise<boolean> {
    // Simulate connectivity check - this would be replaced with actual implementation
    return Promise.resolve(Math.random() > 0.2); // 80% success rate for simulation
  }
}
