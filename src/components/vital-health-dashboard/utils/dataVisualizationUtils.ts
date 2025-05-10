
/**
 * Gets the color for a confidence level based on the score
 */
export const getConfidenceColor = (score: number): string => {
  if (score >= 0.9) return '#4cd137'; // High confidence
  if (score >= 0.7) return '#fbc531';  // Medium confidence
  return '#e84118';                    // Low confidence
};

/**
 * Formats a source name for display by replacing underscores with spaces
 */
export const formatSourceName = (source: string): string => {
  return source.replace(/_/g, ' ');
};
