
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

export interface RadialDataSegment {
  category: string;
  value: number;
  color: string;
  label?: string;
  [key: string]: any;
}

export interface VisualizationData {
  data: RadialDataSegment[];
  metadata: {
    reliability: number;
    source: string;
    lastUpdated: string;
    [key: string]: any;
  }
}
