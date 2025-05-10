
/**
 * Returns a color based on the confidence score
 * @param score The confidence score (0-1)
 * @returns A color string
 */
export const getConfidenceColor = (score: number): string => {
  if (score >= 0.9) return '#10b981'; // green
  if (score >= 0.8) return '#22c55e'; // green-500
  if (score >= 0.7) return '#84cc16'; // lime-500 
  if (score >= 0.6) return '#eab308'; // yellow-500
  if (score >= 0.5) return '#f59e0b'; // amber-500
  return '#ef4444'; // red-500
};

/**
 * Returns a formatted source name from an ID
 * @param id The source ID
 * @returns A formatted source name
 */
export const formatSourceName = (id: string): string => {
  const sourceMap: Record<string, string> = {
    'cdc': 'CDC',
    'who': 'WHO',
    'nhanes': 'NHANES',
    'brfss': 'BRFSS',
    'census': 'U.S. Census',
    'state-health-dept': 'State Health Dept.',
    'fenway': 'Fenway Institute',
    'ihme': 'IHME'
  };
  
  return sourceMap[id] || id;
};

/**
 * Formats a date string to a nice readable format
 * @param dateString ISO date string
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

/**
 * Returns a status badge color based on data quality
 * @param quality Quality score (0-1)
 * @returns CSS class name for the badge
 */
export const getQualityBadgeColor = (quality: number): string => {
  if (quality >= 0.9) return 'bg-emerald-900 text-emerald-300 border-emerald-600';
  if (quality >= 0.8) return 'bg-green-900 text-green-300 border-green-600';
  if (quality >= 0.7) return 'bg-lime-900 text-lime-300 border-lime-600';
  if (quality >= 0.6) return 'bg-yellow-900 text-yellow-300 border-yellow-600';
  return 'bg-red-900 text-red-300 border-red-600';
};

/**
 * Returns a formatted percentage string
 * @param value The value to format
 * @returns A formatted percentage string
 */
export const formatPercent = (value: number): string => {
  return `${value.toFixed(1)}%`;
};
