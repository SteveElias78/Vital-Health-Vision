
import { VisualizationData } from './types';

/**
 * Mock data service for visualizations when real data is not available
 */
export const mockFetchData = async (metric: string, source: string, options = {}): Promise<VisualizationData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate mock data based on the selected metric and source
  const baseValue = metric === 'obesity' ? 35 : 
                   metric === 'diabetes' ? 12 :
                   metric === 'hypertension' ? 28 : 20;
  
  const reliability = source.includes('NHANES') || source.includes('WHO') ? 0.9 : 
                     source.includes('BRFSS') ? 0.85 : 0.7;
  
  // Generate some demographic categories
  const demographicCategories = ['18-34', '35-49', '50-64', '65+'];
  
  // Generate data with some variance by demographic
  return {
    data: demographicCategories.map((category, index) => ({
      category,
      value: baseValue + (Math.random() * 10 - 5) + (index * 2),
      color: index === 0 ? '#FFC700' : // gold
             index === 1 ? '#997800' : // darker gold
             index === 2 ? '#33394F' : // navy blue
             '#000723'  // midnight
    })),
    metadata: {
      source,
      reliability,
      lastUpdated: new Date().toISOString(),
      metric
    }
  };
};
