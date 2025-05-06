
export interface HealthMetric {
  id: string;
  name: string;
  unit: string;
}

export interface DataSource {
  id: string;
  name: string;
  tier: string;
}

export interface RadialDataSegment {
  category: string;
  value: number;
  color: string;
  startAngle?: number;
  endAngle?: number;
  percentage?: number;
}

export interface VisualizationData {
  data: RadialDataSegment[];
  metadata: {
    source: string;
    reliability: number;
    lastUpdated: string;
    metric: string;
  }
}
