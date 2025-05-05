
export interface ValidationRule {
  requiredFields?: string[];
  valueRanges?: Record<string, { min: number; max: number }>;
  suspiciousPatterns?: {
    field: string;
    condition: (value: any, record: any) => boolean;
  }[];
}

export interface BaselineData {
  data: any[];
  source: string;
  timestamp: string;
}

export interface ValidationIssue {
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

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
  metadata: {
    category: string;
    timestamp: string;
    validationApplied: boolean;
    compromisedCategory?: boolean;
  };
}
