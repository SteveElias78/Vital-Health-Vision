
/**
 * Provides statistical analysis functions for data validation
 */
export class DataStatisticsAnalyzer {
  /**
   * Calculate aggregate statistics for data
   */
  public static calculateAggregateStats(data: any[]): { 
    averages: Record<string, number>; 
    counts: Record<string, number> 
  } {
    if (!Array.isArray(data) || data.length === 0) {
      return { averages: {}, counts: {} };
    }
    
    const sums: Record<string, number> = {};
    const counts: Record<string, number> = {};
    
    // Calculate sums and counts
    data.forEach(record => {
      Object.entries(record).forEach(([field, value]) => {
        if (typeof value === 'number') {
          if (sums[field] === undefined) {
            sums[field] = 0;
            counts[field] = 0;
          }
          
          sums[field] += value;
          counts[field]++;
        }
      });
    });
    
    // Calculate averages
    const averages: Record<string, number> = {};
    
    Object.entries(sums).forEach(([field, sum]) => {
      if (counts[field] > 0) {
        averages[field] = sum / counts[field];
      }
    });
    
    return { averages, counts };
  }

  /**
   * Compare baseline data to current data and identify issues
   */
  public static compareDatasets(
    baselineData: any[],
    currentData: any[]
  ): Array<{
    type: string;
    field: string;
    baselineValue: number;
    currentValue: number;
    percentDiff: number;
    severity: 'high' | 'medium' | 'low';
  }> {
    const issues: Array<{
      type: string;
      field: string;
      baselineValue: number;
      currentValue: number;
      percentDiff: number;
      severity: 'high' | 'medium' | 'low';
    }> = [];
    
    const baselineStats = this.calculateAggregateStats(baselineData);
    const currentStats = this.calculateAggregateStats(currentData);
    
    // Compare averages for numeric fields
    Object.entries(baselineStats.averages).forEach(([field, baselineAvg]) => {
      const currentAvg = currentStats.averages[field];
      
      if (currentAvg !== undefined) {
        const percentDiff = Math.abs((currentAvg - baselineAvg) / baselineAvg) * 100;
        
        // Flag significant differences (more than 20%)
        if (percentDiff > 20) {
          issues.push({
            type: 'baseline_deviation',
            field,
            baselineValue: baselineAvg,
            currentValue: currentAvg,
            percentDiff,
            severity: percentDiff > 50 ? 'high' : 'medium'
          });
        }
      }
    });
    
    return issues;
  }
}
