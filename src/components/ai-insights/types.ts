
export interface Insight {
  id: number | string;
  type?: 'trend' | 'correlation' | 'anomaly' | 'recommendation' | 'observation';
  content?: string;
  answer?: string;
  question?: string;
  confidence?: number;
  timestamp: string;
}

export interface DataSourceInfo {
  name: string;
  reliability: 'high' | 'medium' | 'low';
  lastUpdated: string;
}

export interface ClaudeAIInsightsProps {
  data: any;
  dataSource?: string;
  metric?: string;
  onInsightGenerated?: (insights: Insight[]) => void;
}

export interface ClaudeAPIResponse {
  insights?: Insight[];
  answer?: string;
  confidence?: number;
}
