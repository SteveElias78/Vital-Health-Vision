
import { VisualizationData } from '../types';

/**
 * Mock data service that returns health metrics data based on metric and source
 */
export const mockFetchData = async (metric: string, source: string): Promise<VisualizationData> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Gold-themed color palette with varying shades
  const goldPalette = [
    '#f9ca24', '#f0932b', '#d4a010', '#c48c0c', '#a37707', '#826006'
  ];
  
  let data;
  
  switch (metric) {
    case 'obesity':
      data = [
        { category: '18-34', value: 32.5, color: goldPalette[0] },
        { category: '35-49', value: 38.7, color: goldPalette[1] },
        { category: '50-64', value: 42.1, color: goldPalette[2] },
        { category: '65+', value: 36.3, color: goldPalette[3] }
      ];
      break;
    
    case 'diabetes':
      data = [
        { category: '18-34', value: 5.9, color: goldPalette[0] },
        { category: '35-49', value: 12.5, color: goldPalette[1] },
        { category: '50-64', value: 19.3, color: goldPalette[2] },
        { category: '65+', value: 26.8, color: goldPalette[3] }
      ];
      break;
      
    case 'hypertension':
      data = [
        { category: '18-34', value: 15.3, color: goldPalette[0] },
        { category: '35-49', value: 30.9, color: goldPalette[1] },
        { category: '50-64', value: 48.2, color: goldPalette[2] },
        { category: '65+', value: 62.5, color: goldPalette[3] }
      ];
      break;
      
    case 'vaccination':
      data = [
        { category: '18-34', value: 65.2, color: goldPalette[0] },
        { category: '35-49', value: 72.5, color: goldPalette[1] },
        { category: '50-64', value: 85.3, color: goldPalette[2] },
        { category: '65+', value: 91.7, color: goldPalette[3] }
      ];
      break;
      
    default:
      data = [
        { category: '18-34', value: 32.5, color: goldPalette[0] },
        { category: '35-49', value: 38.7, color: goldPalette[1] },
        { category: '50-64', value: 42.1, color: goldPalette[2] },
        { category: '65+', value: 36.3, color: goldPalette[3] }
      ];
  }
  
  const getSourceReliability = (source: string) => {
    switch (source) {
      case 'NHANES 2023':
      case 'BRFSS 2024':
      case 'WHO GHO':
        return 0.95;
      case 'CDC Wonder':
        return 0.87;
      case 'FenwayInstitute':
        return 0.75;
      default:
        return 0.8;
    }
  };
  
  return {
    data,
    metadata: {
      source,
      reliability: getSourceReliability(source),
      lastUpdated: new Date().toISOString(),
      metric
    }
  };
};
