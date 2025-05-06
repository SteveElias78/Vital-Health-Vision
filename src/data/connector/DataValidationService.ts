
import { ValidationResult } from './types';

/**
 * Data validation service for assessing data integrity
 */
export class DataValidationService {
  /**
   * Validate data integrity and reliability
   * @param data - Data to validate
   * @param options - Validation options
   * @returns Validation results
   */
  validate(data: any, options: Record<string, any> = {}): ValidationResult {
    // Simple validation based on data structure
    const hasData = data && data.data && Array.isArray(data.data) && data.data.length > 0;
    
    if (!hasData) {
      return {
        isValid: false,
        score: 0,
        issues: ['No data available or invalid data structure']
      };
    }
    
    // Check for missing values
    const missingValues = data.data.some((item: any) => 
      item.value === undefined || 
      item.value === null || 
      isNaN(item.value)
    );
    
    // Check for extreme outliers
    const values = data.data.map((item: any) => item.value);
    const mean = values.reduce((sum: number, val: number) => sum + val, 0) / values.length;
    const outliers = this.detectOutliers(values);
    
    // Check for metadata
    const hasMetadata = data.metadata && Object.keys(data.metadata).length > 0;
    
    // Calculate overall validation score
    const validationScore = this.calculateValidationScore({
      hasData,
      missingValues,
      outlierPercentage: outliers.length / values.length,
      hasMetadata
    });
    
    return {
      isValid: validationScore >= 0.7, // Threshold for validity
      score: validationScore,
      issues: this.identifyIssues({
        missingValues,
        outliers,
        hasMetadata
      }),
      outliers: outliers.length > 0 ? outliers : null
    };
  }
  
  /**
   * Detect outliers in a dataset using IQR method
   * @private
   */
  private detectOutliers(values: number[]): Array<{ index: number, value: number }> {
    // Sort values
    const sorted = [...values].sort((a, b) => a - b);
    
    // Calculate quartiles
    const q1 = sorted[Math.floor(sorted.length * 0.25)];
    const q3 = sorted[Math.floor(sorted.length * 0.75)];
    
    // Calculate IQR and bounds
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
    
    // Find outliers
    return values.map((value, index) => {
      if (value < lowerBound || value > upperBound) {
        return { index, value };
      }
      return null;
    }).filter((x): x is { index: number, value: number } => x !== null);
  }
  
  /**
   * Calculate overall validation score
   * @private
   */
  private calculateValidationScore({ 
    hasData, 
    missingValues, 
    outlierPercentage, 
    hasMetadata 
  }: {
    hasData: boolean;
    missingValues: boolean;
    outlierPercentage: number;
    hasMetadata: boolean;
  }): number {
    if (!hasData) return 0;
    
    let score = 1.0;
    
    // Reduce score for issues
    if (missingValues) score -= 0.3;
    if (outlierPercentage > 0) score -= outlierPercentage * 0.5;
    if (!hasMetadata) score -= 0.2;
    
    // Ensure score is within 0-1 range
    return Math.max(0, Math.min(1, score));
  }
  
  /**
   * Identify specific issues with the data
   * @private
   */
  private identifyIssues({ 
    missingValues, 
    outliers, 
    hasMetadata 
  }: {
    missingValues: boolean;
    outliers: any[];
    hasMetadata: boolean;
  }): string[] {
    const issues: string[] = [];
    
    if (missingValues) {
      issues.push('Data contains missing or invalid values');
    }
    
    if (outliers && outliers.length > 0) {
      issues.push(`Data contains ${outliers.length} statistical outliers`);
    }
    
    if (!hasMetadata) {
      issues.push('Data lacks proper metadata');
    }
    
    return issues.length > 0 ? issues : ['No issues detected'];
  }
}
