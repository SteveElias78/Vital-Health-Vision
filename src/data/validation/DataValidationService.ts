
import { COMPROMISED_CATEGORIES } from '../../config/dataSourceConfig';
import { ValidationRuleManager } from './ValidationRuleManager';
import { BaselineDataManager } from './BaselineDataManager';
import { ValidationCheckers } from './ValidationCheckers';
import { DataStatisticsAnalyzer } from './DataStatisticsAnalyzer';
import { ValidationResult, ValidationIssue } from './types';

/**
 * Service for validating data against rules and baselines
 */
export class DataValidationService {
  private ruleManager: ValidationRuleManager;
  private baselineManager: BaselineDataManager;
  
  constructor() {
    this.ruleManager = new ValidationRuleManager();
    this.baselineManager = new BaselineDataManager();
  }
  
  /**
   * Set baseline data for a category
   */
  public setBaselineData(category: string, data: any[], source: string): void {
    this.baselineManager.setBaselineData(category, data, source);
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
    const rules = this.ruleManager.getRules(category);
    
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
        const missingFields = ValidationCheckers.checkRequiredFields(data, rules.requiredFields);
        
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
        const outOfRangeIssues = ValidationCheckers.checkValueRanges(data, rules.valueRanges);
        
        if (outOfRangeIssues.length > 0) {
          issues.push(...outOfRangeIssues);
        }
      }
      
      // Check suspicious patterns
      if (rules.suspiciousPatterns) {
        const patternIssues = ValidationCheckers.checkSuspiciousPatterns(data, rules.suspiciousPatterns);
        
        if (patternIssues.length > 0) {
          issues.push(...patternIssues);
        }
      }
    }
    
    // Compare to baseline if available and requested
    if (compareToBaseline && this.baselineManager.hasBaselineData(category)) {
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
   * Compare data to baseline
   */
  private async compareToBaseline(category: string, data: any[]): Promise<ValidationIssue[]> {
    const baseline = this.baselineManager.getBaselineData(category);
    
    if (!baseline || !baseline.data) {
      return [];
    }
    
    // Compare datasets and convert to ValidationIssue format
    const comparisonResults = DataStatisticsAnalyzer.compareDatasets(baseline.data, data);
    
    return comparisonResults.map(result => ({
      ...result,
      type: result.type
    }));
  }
}
