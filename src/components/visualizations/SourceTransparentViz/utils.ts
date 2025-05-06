
/**
 * Format source name for display
 */
export const formatSourceName = (sourceName: string): string => {
  return sourceName.replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Get color based on confidence score
 */
export const getConfidenceColor = (score: number): string => {
  if (score >= 0.8) return '#4cd137'; // High confidence - green
  if (score >= 0.6) return '#fbc531'; // Medium confidence - yellow
  return '#e84118'; // Low confidence - red
};

/**
 * Format value for display
 */
export const formatValue = (value: number): string => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value % 1 === 0 ? value.toString() : value.toFixed(1);
};
