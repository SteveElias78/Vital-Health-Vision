
import { DataResponse } from '../../utils/types';
import { SourceManager } from '../utils/SourceManager';
import { DataValidationUtils, ValidationResults } from '../utils/DataValidationUtils';
import { DataResultUtils } from '../utils/DataResultUtils';

/**
 * Service for validating and reconciling data from multiple sources
 */
export class ValidationService {
  private sourceManager: SourceManager;
  
  constructor(sourceManager: SourceManager) {
    this.sourceManager = sourceManager;
  }
  
  /**
   * Validate and reconcile data from multiple sources
   */
  public async validateAndReconcileResults(
    results: Record<string, DataResponse<any>>, 
    category: string,
    options: { deepValidation?: boolean; [key: string]: any } = {}
  ): Promise<DataResponse<any>> {
    const sources = Object.keys(results);
    
    // Only proceed if we have multiple sources
    if (sources.length <= 1) {
      return DataResultUtils.combineResults(results, category, this.sourceManager);
    }
    
    const validationResults: ValidationResults = {
      discrepancies: [],
      sourcesCompared: sources.length,
      compromisedSources: []
    };
    
    // Compare each pair of sources
    for (let i = 0; i < sources.length; i++) {
      for (let j = i + 1; j < sources.length; j++) {
        const source1 = sources[i];
        const source2 = sources[j];
        
        const comparisonResult = DataValidationUtils.compareDataSets(
          results[source1].data,
          results[source2].data,
          source1,
          source2
        );
        
        if (comparisonResult.discrepancies.length > 0) {
          validationResults.discrepancies.push(comparisonResult);
          
          // Check for government vs alternative source discrepancies
          const isSource1Gov = this.sourceManager.isGovernmentSource(source1);
          const isSource2Gov = this.sourceManager.isGovernmentSource(source2);
          
          if (isSource1Gov && !isSource2Gov) {
            validationResults.compromisedSources.push(source1);
          } else if (!isSource1Gov && isSource2Gov) {
            validationResults.compromisedSources.push(source2);
          }
        }
      }
    }
    
    // Perform deep validation if requested
    if (options.deepValidation) {
      // Choose the most reliable source for deep validation
      let mostReliableSource = sources[0];
      let highestReliability = this.sourceManager.getSourceReliability(mostReliableSource);
      
      for (let i = 1; i < sources.length; i++) {
        const reliability = this.sourceManager.getSourceReliability(sources[i]);
        if (reliability > highestReliability) {
          highestReliability = reliability;
          mostReliableSource = sources[i];
        }
      }
      
      const deepValidationResult = await DataValidationUtils.deepValidateData(
        category, 
        results[mostReliableSource].data
      );
      
      validationResults.deepValidation = {
        valid: deepValidationResult.valid,
        issues: deepValidationResult.issues
      };
      
      // If deep validation finds high-severity issues, mark the source as compromised
      if (!deepValidationResult.valid) {
        validationResults.compromisedSources.push(mostReliableSource);
      }
    }
    
    return DataResultUtils.processValidationResults(
      results, 
      validationResults, 
      category, 
      this.sourceManager
    );
  }
}
