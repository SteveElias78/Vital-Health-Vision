
import { RadialChartDataPoint } from '@/types/visualization';

export interface DataSource {
  id: string;
  name: string;
  tier: string;
}

export interface HealthMetric {
  id: string;
  name: string;
  unit: string;
}

export type RadialDataSegment = RadialChartDataPoint;

export interface VisualizationData {
  data: RadialDataSegment[];
  metadata: {
    reliability: number;
    source: string;
    lastUpdated: string;
    [key: string]: any;
  }
}
