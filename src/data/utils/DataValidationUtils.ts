
import { COMPROMISED_CATEGORIES } from '../../config/dataSourceConfig';
import { DataResponse } from '../../utils/types';
import { DataValidationService } from '../validation/DataValidationService';

export interface ValidationResultDiscrepancy {
  type: string;
  field?: string;
  source1: { source: string; value?: any; count?: number };
  source2: { source: string; value?: any; count?: number };
  percentDiff: number;
}

export interface ComparisonResult {
  source1: string;
  source2: string;
  discrepancies: ValidationResultDiscrepancy[];
}

export interface ValidationResults {
  discrepancies: ComparisonResult[];
  sourcesCompared: number;
  compromisedSources: string[];
  sourceSwitch?: {
    from: string;
    to: string;
    reason: string;
  };
  deepValidation?: {
    valid: boolean;
    issues: any[];
  };
}

export class DataValidationUtils {
  private static validationService = new DataValidationService();

  /**
   * Compare two datasets and identify discrepancies
   */
  static compareDataSets(
    data1: any, 
    data2: any, 
    source1: string, 
    source2: string
  ): ComparisonResult {
    const discrepancies: ValidationResultDiscrepancy[] = [];
    
    // For arrays of objects, compare length and sample values
    if (Array.isArray(data1) && Array.isArray(data2)) {
      // Compare length
      if (data1.length !== data2.length) {
        discrepancies.push({
          type: 'record_count',
          source1: { source: source1, count: data1.length },
          source2: { source: source2, count: data2.length },
          percentDiff: Math.abs((data1.length - data2.length) / data1.length) * 100
        });
      }
      
      // Get a sample to compare (first 5 items)
      const sampleSize = Math.min(5, data1.length, data2.length);
      
      for (let i = 0; i < sampleSize; i++) {
        const item1 = data1[i];
        const item2 = data2[i];
        
        // Compare common fields
        const commonKeys = Object.keys(item1).filter(key => key in item2);
        
        for (const key of commonKeys) {
          if (typeof item1[key] === 'number' && typeof item2[key] === 'number') {
            const percentDiff = Math.abs((item1[key] - item2[key]) / item1[key]) * 100;
            
            // If difference is more than 10%, flag as discrepancy
            if (percentDiff > 10) {
              discrepancies.push({
                type: 'value',
                field: key,
                source1: { source: source1, value: item1[key] },
                source2: { source: source2, value: item2[key] },
                percentDiff
              });
            }
          }
        }
      }
    }
    
    return {
      source1,
      source2,
      discrepancies
    };
  }

  /**
   * Deep validate data using DataValidationService
   */
  static async deepValidateData(category: string, data: any): Promise<any> {
    return await this.validationService.validateData(category, data);
  }

  /**
   * Set baseline data for a category
   */
  static setBaselineData(category: string, data: any[], source: string): void {
    this.validationService.setBaselineData(category, data, source);
  }

  /**
   * Checks if a category is potentially compromised
   */
  static isCategoryCompromised(category: string): boolean {
    return COMPROMISED_CATEGORIES.some(
      compromisedCategory => category.includes(compromisedCategory)
    );
  }
}
