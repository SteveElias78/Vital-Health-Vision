
import { COMPROMISED_CATEGORIES } from '../../config/dataSourceConfig';

interface ValidationRule {
  requiredFields?: string[];
  valueRanges?: Record<string, { min: number; max: number }>;
  suspiciousPatterns?: {
    field: string;
    condition: (value: any, record: any) => boolean;
  }[];
}

interface BaselineData {
  data: any[];
  source: string;
  timestamp: string;
}

interface ValidationIssue {
  type: string;
  field?: string;
  value?: any;
  fields?: string[];
  range?: { min: number; max: number };
  recordIndex?: number;
  severity: 'high' | 'medium' | 'low';
  baselineValue?: number;
  currentValue?: number;
  percentDiff?: number;
}

interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
  metadata: {
    category: string;
    timestamp: string;
    validationApplied: boolean;
    compromisedCategory?: boolean;
  };
}

export class DataValidationService {
  private baselineData: Map<string, BaselineData>;
  private validationRules: Map<string, ValidationRule>;
  
  constructor() {
    this.baselineData = new Map();
    this.validationRules = new Map();
    this.setupValidationRules();
  }
  
  /**
   * Setup validation rules for different data categories
   */
  private setupValidationRules(): void {
    // LGBTQ health validation rules
    this.validationRules.set('lgbtq-health', {
      // Ensure the data has expected fields
      requiredFields: ['sexualOrientation', 'genderIdentity', 'value'],
      
      // Ensure values are within expected ranges
      valueRanges: {
        'value': { min: 0, max: 100 }
      },
      
      // Check for suspicious patterns that indicate tampering
      suspiciousPatterns: [
        {
          field: 'value',
          condition: (value, record) => {
            // Flag suspiciously high values for LGBTQ health metrics
            // that might indicate data manipulation
            if (record.sexualOrientation && 
                (record.sexualOrientation === 'Lesbian, Gay or Bisexual' ||
                 record.sexualOrientation === 'LGB') &&
                value > 90) {
              return true;
            }
            return false;
          }
        }
      ]
    });
    
    // Mental health validation rules
    this.validationRules.set('mental-health', {
      requiredFields: ['depressionRate', 'anxietyRate'],
      valueRanges: {
        'depressionRate': { min: 0, max: 50 },
        'anxietyRate': { min: 0, max: 50 }
      },
      suspiciousPatterns: [
        {
          field: 'depressionRate',
          condition: (value) => value < 5 // Suspiciously low mental health issues
        }
      ]
    });
    
    // Add rules for other categories as needed
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
   * Validate data against rules and baseline
   */
  public async validateData(
    category: string, 
    data: any[], 
    options: { compareToBaseline?: boolean } = {}
  ): Promise<ValidationResult> {
    const { compareToBaseline = true } = options;
    
    // Get validation rules for this category
    const rules = this.validationRules.get(category);
    
    if (!rules) {
      console.warn(`No validation rules found for category: ${category}`);
      return {
        valid: true,
        issues: [],
        metadata: {
          category,
          timestamp: new Date().toISOString(),
          validationApplied: false
        }
      };
    }
    
    const issues: ValidationIssue[] = [];
    
    // Apply validation rules
    if (Array.isArray(data)) {
      // Check required fields
      if (rules.requiredFields && rules.requiredFields.length > 0) {
        const missingFields = this.checkRequiredFields(data, rules.requiredFields);
        
        if (missingFields.length > 0) {
          issues.push({
            type: 'missing_fields',
            fields: missingFields,
            severity: 'high'
          });
        }
      }
      
      // Check value ranges
      if (rules.valueRanges) {
        const outOfRangeIssues = this.checkValueRanges(data, rules.valueRanges);
        
        if (outOfRangeIssues.length > 0) {
          issues.push(...outOfRangeIssues);
        }
      }
      
      // Check suspicious patterns
      if (rules.suspiciousPatterns) {
        const patternIssues = this.checkSuspiciousPatterns(data, rules.suspiciousPatterns);
        
        if (patternIssues.length > 0) {
          issues.push(...patternIssues);
        }
      }
    }
    
    // Compare to baseline if available and requested
    if (compareToBaseline && this.baselineData.has(category)) {
      const baselineIssues = await this.compareToBaseline(category, data);
      
      if (baselineIssues.length > 0) {
        issues.push(...baselineIssues);
      }
    }
    
    // Determine overall validity
    const valid = issues.length === 0 || 
                  !issues.some(issue => issue.severity === 'high');
    
    return {
      valid,
      issues,
      metadata: {
        category,
        timestamp: new Date().toISOString(),
        validationApplied: true,
        compromisedCategory: COMPROMISED_CATEGORIES.includes(category)
      }
    };
  }
  
  /**
   * Check if required fields are present
   */
  private checkRequiredFields(data: any[], requiredFields: string[]): string[] {
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
  private checkValueRanges(
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
  private checkSuspiciousPatterns(
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
  
  /**
   * Compare data to baseline
   */
  private async compareToBaseline(category: string, data: any[]): Promise<ValidationIssue[]> {
    const baseline = this.baselineData.get(category);
    
    if (!baseline || !baseline.data) {
      return [];
    }
    
    const issues: ValidationIssue[] = [];
    
    // This is a simplified implementation - in practice, you would
    // implement more sophisticated comparison logic based on your data structure
    
    // For example, compare aggregate statistics
    const baselineStats = this.calculateAggregateStats(baseline.data);
    const currentStats = this.calculateAggregateStats(data);
    
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
  
  /**
   * Calculate aggregate statistics for data
   */
  private calculateAggregateStats(data: any[]): { 
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
}
