
import { ValidationIssue } from './types';

/**
 * Provides validation check methods for different validation rule types
 */
export class ValidationCheckers {
  /**
   * Check if required fields are present
   */
  public static checkRequiredFields(data: any[], requiredFields: string[]): string[] {
    if (data.length === 0) {
      return requiredFields; // All fields are missing if data is empty
    }
    
    // Check the first few records
    const sampleSize = Math.min(5, data.length);
    const missingFields = new Set<string>();
    
    for (let i = 0; i < sampleSize; i++) {
      const record = data[i];
      
      for (const field of requiredFields) {
        if (record[field] === undefined || record[field] === null) {
          missingFields.add(field);
        }
      }
    }
    
    return Array.from(missingFields);
  }
  
  /**
   * Check if values are within expected ranges
   */
  public static checkValueRanges(
    data: any[], 
    valueRanges: Record<string, { min: number; max: number }>
  ): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    
    Object.entries(valueRanges).forEach(([field, range]) => {
      const { min, max } = range;
      
      // Check each record
      data.forEach((record, index) => {
        const value = record[field];
        
        // Skip if field is not present
        if (value === undefined || value === null) {
          return;
        }
        
        // Check if numeric value is outside range
        if (typeof value === 'number') {
          if (value < min || value > max) {
            issues.push({
              type: 'value_out_of_range',
              field,
              value,
              range: { min, max },
              recordIndex: index,
              severity: 'medium'
            });
          }
        }
      });
    });
    
    return issues;
  }
  
  /**
   * Check for suspicious patterns in the data
   */
  public static checkSuspiciousPatterns(
    data: any[], 
    patterns: { field: string; condition: (value: any, record: any) => boolean }[]
  ): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    
    patterns.forEach(pattern => {
      const { field, condition } = pattern;
      
      // Check each record
      data.forEach((record, index) => {
        const value = record[field];
        
        // Skip if field is not present
        if (value === undefined || value === null) {
          return;
        }
        
        // Apply the condition
        if (condition(value, record)) {
          issues.push({
            type: 'suspicious_pattern',
            field,
            value,
            recordIndex: index,
            severity: 'high'
          });
        }
      });
    });
    
    return issues;
  }
}
