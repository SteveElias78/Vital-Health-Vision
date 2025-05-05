
import { DemographicDataPoint } from './types';

// Enhanced sample data
export const demographicsData: DemographicDataPoint[] = [
  { age: '18-24', male: 400, female: 800, malePercent: 15, femalePercent: 22 },
  { age: '25-34', male: 700, female: 1000, malePercent: 21, femalePercent: 28 },
  { age: '35-44', male: 1000, female: 750, malePercent: 30, femalePercent: 24 },
  { age: '45-54', male: 930, female: 880, malePercent: 35, femalePercent: 30 },
  { age: '55-64', male: 800, female: 820, malePercent: 40, femalePercent: 38 },
  { age: '65+', male: 500, female: 600, malePercent: 42, femalePercent: 45 },
];

// Chart config
export const chartConfig = {
  'male': { label: 'Male', theme: { light: '#0EA5E9', dark: '#38BDF8' } },
  'female': { label: 'Female', theme: { light: '#D946EF', dark: '#E879F9' } }
};
