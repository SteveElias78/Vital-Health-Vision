
/**
 * Helper function to truncate labels
 */
export const truncateLabel = (label: string | undefined, maxLength: number): string => {
  if (!label) return '';
  return label.length > maxLength ? `${label.substring(0, maxLength)}...` : label;
};

/**
 * Helper function to format numbers nicely
 */
export const formatNumber = (value: number | string): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (numValue === undefined || numValue === null || isNaN(numValue)) return '0';
  
  // Format based on magnitude
  if (numValue >= 1000000) {
    return `${(numValue / 1000000).toFixed(1)}M`;
  } else if (numValue >= 1000) {
    return `${(numValue / 1000).toFixed(1)}K`;
  } else if (Number.isInteger(numValue)) {
    return numValue.toString();
  } else {
    return numValue.toFixed(1);
  }
};

/**
 * Calculate segment offset for hover effect
 */
export const calculateSegmentOffset = (d: any, radius: number) => {
  // Calculate angle in radians at the center of the arc
  const angle = (d.startAngle + d.endAngle) / 2;
  // Calculate offset distance (5% of radius)
  const offset = radius * 0.05;
  // Calculate x and y components of the offset
  const x = Math.sin(angle) * offset;
  const y = -Math.cos(angle) * offset;
  return `translate(${x}, ${y})`;
};
