
/**
 * Type definitions for the BRFSS connector
 */

export interface BRFSSSoqlOptions {
  year?: number;
  category?: string;
  question?: string;
  location?: string | null;
  breakoutBy?: string | null;
  measure?: string | null;
  limit?: number;
}

export interface BRFSSFetchOptions extends BRFSSSoqlOptions {
  location?: string;
  format?: string;
  [key: string]: any;
}

export interface BRFSSStateData {
  state: string;
  value: number;
  ci_low: number;
  ci_high: number;
}

export interface BRFSSNormalizedData {
  location?: string;
  value?: string | number;
  confidenceLow?: string | number;
  confidenceHigh?: string | number;
  breakoutCategory?: string;
  breakoutValue?: string;
  questionId?: string;
  locationCode?: string;
  [key: string]: any;
}
