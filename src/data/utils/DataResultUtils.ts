
import { DataResponse } from '../../utils/types';
import { SourceManager } from './SourceManager';
import { ValidationResults } from './DataValidationUtils';

export class DataResultUtils {
  /**
   * Combine results from multiple sources
   */
  static combineResults(
    results: Record<string, DataResponse<any>>, 
    category: string,
    sourceManager: SourceManager
  ): DataResponse<any> {
    // Create a combined result object
    const combined: DataResponse<any> = {
      data: {},
      metadata: {
        source: 'hybrid',
        endpoint: `category/${category}`,
        timestamp: new Date().toISOString(),
        reliability: 0,
        cached: false,
        sources: Object.keys(results),
        category,
        fetchedAt: new Date().toISOString(),
        combinedResult: true
      }
    };
    
    // Add data from each source
    Object.entries(results).forEach(([source, result]) => {
      combined.data[source] = result.data;
      
      // Copy source-specific metadata
      combined.metadata[source] = result.metadata;
    });
    
    // Calculate overall reliability as the average of source reliabilities
    const reliabilities = Object.keys(results)
      .map(source => sourceManager.getSourceReliability(source));
    
    combined.metadata.reliability = reliabilities.reduce((sum, r) => sum + r, 0) / reliabilities.length;
    
    return combined;
  }

  /**
   * Process validation results and determine which source to use
   */
  static processValidationResults(
    results: Record<string, DataResponse<any>>,
    validationResults: ValidationResults,
    category: string,
    sourceManager: SourceManager
  ): DataResponse<any> {
    const sources = Object.keys(results);
    
    // If there are government sources with discrepancies, prefer alternative sources
    if (validationResults.compromisedSources.length > 0) {
      // Find the most reliable alternative source
      let bestAlternativeSource = null;
      let highestReliability = 0;
      
      for (const source of sources) {
        if (!validationResults.compromisedSources.includes(source)) {
          const reliability = sourceManager.getSourceReliability(source);
          if (reliability > highestReliability) {
            highestReliability = reliability;
            bestAlternativeSource = source;
          }
        }
      }
      
      if (bestAlternativeSource) {
        console.log(`Using alternative source ${bestAlternativeSource} due to discrepancies in government data`);
        
        // Return the alternative source result with validation metadata
        const result = results[bestAlternativeSource];
        result.metadata.validation = validationResults;
        result.metadata.validation.sourceSwitch = {
          from: validationResults.compromisedSources.join(', '),
          to: bestAlternativeSource,
          reason: 'data_integrity_concerns'
        };
        
        return result;
      }
    }
    
    // If no integrity concerns or no good alternative, combine results
    const combinedResults = DataResultUtils.combineResults(results, category, sourceManager);
    
    // Add validation metadata
    combinedResults.metadata.validation = validationResults;
    
    return combinedResults;
  }
}
