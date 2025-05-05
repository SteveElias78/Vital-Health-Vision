
import { BRFSSSoqlOptions, BRFSSNormalizedData } from "../interfaces/BRFSSTypes";

/**
 * Utility functions for BRFSS data processing
 */
export class BRFSSUtils {
  /**
   * Builds a SOQL query for BRFSS data
   */
  static buildSoqlQuery(options: BRFSSSoqlOptions): string {
    const {
      year,
      category,
      question,
      location = null,
      breakoutBy = null,
      measure = null,
      limit = 1000
    } = options;
    
    // Start building the query
    let query = 'SELECT * ';
    
    // Add filters
    const whereConditions: string[] = [];
    
    if (year) {
      whereConditions.push(`year = ${year}`);
    }
    
    if (category) {
      whereConditions.push(`category = '${category}'`);
    }
    
    if (question) {
      whereConditions.push(`question = '${question}'`);
    }
    
    if (location) {
      whereConditions.push(`locationdesc = '${location}'`);
    }
    
    if (breakoutBy) {
      whereConditions.push(`break_out_category = '${breakoutBy}'`);
    }
    
    if (measure) {
      whereConditions.push(`measureid = '${measure}'`);
    }
    
    // Add the WHERE clause if we have conditions
    if (whereConditions.length > 0) {
      query += `WHERE ${whereConditions.join(' AND ')} `;
    }
    
    // Add limit
    query += `LIMIT ${limit}`;
    
    return query;
  }

  /**
   * Normalizes field names for consistent usage
   */
  static normalizeFieldNames<T>(data: any): T {
    if (!Array.isArray(data)) {
      return data as T;
    }
    
    // Field mapping for BRFSS
    const fieldMapping: Record<string, string> = {
      'locationdesc': 'location',
      'data_value': 'value',
      'confidence_limit_low': 'confidenceLow',
      'confidence_limit_high': 'confidenceHigh',
      'break_out_category': 'breakoutCategory',
      'break_out': 'breakoutValue',
      'questionid': 'questionId',
      'locationabbr': 'locationCode'
    };
    
    return data.map(item => {
      const normalized: Record<string, any> = {};
      
      Object.entries(item).forEach(([key, value]) => {
        const normalizedKey = fieldMapping[key] || key;
        normalized[normalizedKey] = value;
      });
      
      return normalized;
    }) as T;
  }
}
