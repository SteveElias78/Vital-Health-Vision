
export interface SourceHealthCheck {
  sourceId: string;
  status: 'healthy' | 'unhealthy';
  error?: string;
  timestamp: number;
}

export interface SourceHealthResults {
  [key: string]: SourceHealthCheck;
}
