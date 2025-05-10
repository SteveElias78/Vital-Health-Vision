
import { HealthDataPoint } from '@/components/dashboard/HealthDataVisualization';

export interface RadialChartDataPoint {
  category: string;
  value: number;
  color?: string;
}

export function mapToRadialChartData(data: HealthDataPoint[]): RadialChartDataPoint[] {
  return data.map(item => ({
    category: item.name,
    value: item.value,
    color: item.color
  }));
}

export interface ArtDecoThemeProps {
  className?: string;
  animation?: 'pulse' | 'glow' | 'shimmer' | 'none';
  corners?: 'sharp' | 'rounded' | 'decorated';
  variant?: 'primary' | 'secondary' | 'accent' | 'dark';
  pattern?: 'none' | 'grid' | 'dots' | 'lines';
}

export interface DemoIndicatorProps {
  className?: string;
  showLabel?: boolean;
}
