
import { ValidationRule } from './types';

/**
 * Manages validation rules for different data categories
 */
export class ValidationRuleManager {
  private validationRules: Map<string, ValidationRule>;
  
  constructor() {
    this.validationRules = new Map();
    this.setupValidationRules();
  }
  
  /**
   * Get validation rules for a specific category
   */
  public getRules(category: string): ValidationRule | undefined {
    return this.validationRules.get(category);
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
}
