
export interface RadialChartDataPoint {
  category: string;
  value: number;
  color?: string;
  name?: string; // For backward compatibility
}

/**
 * Utility function to map various data formats to RadialChartDataPoint format
 */
export function mapToRadialChartData(data: any[]): RadialChartDataPoint[] {
  return data.map(item => ({
    category: item.category || item.name, // Support both formats
    value: item.value,
    color: item.color || '#FFC700',
    name: item.name || item.category // Ensure name is always available
  }));
}
