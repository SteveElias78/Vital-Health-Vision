
import { BaselineData } from './types';

/**
 * Manages baseline data for validation comparisons
 */
export class BaselineDataManager {
  private baselineData: Map<string, BaselineData>;
  
  constructor() {
    this.baselineData = new Map();
  }
  
  /**
   * Set baseline data for a category
   * This would typically be verified archive data from before January 2025
   */
  public setBaselineData(category: string, data: any[], source: string): void {
    this.baselineData.set(category, {
      data,
      source,
      timestamp: new Date().toISOString()
    });
  }
  
  /**
   * Get baseline data for a category
   */
  public getBaselineData(category: string): BaselineData | undefined {
    return this.baselineData.get(category);
  }
  
  /**
   * Check if baseline data exists for a category
   */
  public hasBaselineData(category: string): boolean {
    return this.baselineData.has(category);
  }
}
