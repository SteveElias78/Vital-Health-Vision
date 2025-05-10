
import { ReactNode } from 'react';
import { HealthDataCategory } from '@/data/demo/DemoDataService';

export interface ClaudeAIInsightsProps {
  data: any;
  dataSource: HealthDataCategory | string;
  metric?: string;
}

export interface Insight {
  id: string;
  title: string;
  content: string;
  category: HealthDataCategory;
  type: 'summary' | 'trends' | 'recommendations' | 'correlations';
  confidenceScore: number;
  timestamp: string;
}

export interface DataSourceInfo {
  name: string;
  description: string;
  lastUpdated: string;
}
