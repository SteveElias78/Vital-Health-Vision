
import { TrendDataPoint } from './types';

// Enhanced sample data with more data points and dates
export const trendData: TrendDataPoint[] = [
  { month: 'Jan', date: '2023-01-01', 'Heart Disease': 4000, 'Diabetes': 2400, 'Obesity': 2400 },
  { month: 'Feb', date: '2023-02-01', 'Heart Disease': 3000, 'Diabetes': 1398, 'Obesity': 2210 },
  { month: 'Mar', date: '2023-03-01', 'Heart Disease': 2000, 'Diabetes': 9800, 'Obesity': 2290 },
  { month: 'Apr', date: '2023-04-01', 'Heart Disease': 2780, 'Diabetes': 3908, 'Obesity': 2000 },
  { month: 'May', date: '2023-05-01', 'Heart Disease': 1890, 'Diabetes': 4800, 'Obesity': 2181 },
  { month: 'Jun', date: '2023-06-01', 'Heart Disease': 2390, 'Diabetes': 3800, 'Obesity': 2500 },
  { month: 'Jul', date: '2023-07-01', 'Heart Disease': 3490, 'Diabetes': 4300, 'Obesity': 2100 },
  { month: 'Aug', date: '2023-08-01', 'Heart Disease': 3590, 'Diabetes': 4500, 'Obesity': 2300 },
  { month: 'Sep', date: '2023-09-01', 'Heart Disease': 4290, 'Diabetes': 5100, 'Obesity': 2400 },
  { month: 'Oct', date: '2023-10-01', 'Heart Disease': 4890, 'Diabetes': 5600, 'Obesity': 2600 },
  { month: 'Nov', date: '2023-11-01', 'Heart Disease': 5290, 'Diabetes': 5900, 'Obesity': 2700 },
  { month: 'Dec', date: '2023-12-01', 'Heart Disease': 5490, 'Diabetes': 6100, 'Obesity': 2800 },
];

// Transform trendData to match TimeseriesDataPoint interface
export const transformedTrendData = trendData.map(item => ({
  ...item,
  date: item.date,
  value: item['Heart Disease'] // Default value
}));

// Chart config for advanced tooltips
export const chartConfig = {
  'Heart Disease': { label: 'Heart Disease', theme: { light: '#8B5CF6', dark: '#A78BFA' } },
  'Diabetes': { label: 'Diabetes', theme: { light: '#0EA5E9', dark: '#38BDF8' } },
  'Obesity': { label: 'Obesity', theme: { light: '#F97316', dark: '#FB923C' } }
};
