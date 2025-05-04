
import { ForecastDataPoint } from './types';

// Enhanced forecast data
export const forecastData: ForecastDataPoint[] = [
  { year: '2020', period: 0, actual: 120, predicted: 118, prediction_lower: 110, prediction_upper: 126 },
  { year: '2021', period: 1, actual: 132, predicted: 129, prediction_lower: 120, prediction_upper: 138 },
  { year: '2022', period: 2, actual: 141, predicted: 138, prediction_lower: 130, prediction_upper: 146 },
  { year: '2023', period: 3, actual: 152, predicted: 149, prediction_lower: 140, prediction_upper: 158 },
  { year: '2024', period: 4, actual: 165, predicted: 160, prediction_lower: 150, prediction_upper: 170 },
  { year: '2025', period: 5, actual: null, predicted: 172, prediction_lower: 160, prediction_upper: 184 },
  { year: '2026', period: 6, actual: null, predicted: 185, prediction_lower: 172, prediction_upper: 198 },
  { year: '2027', period: 7, actual: null, predicted: 196, prediction_lower: 182, prediction_upper: 210 },
];

// Chart config
export const chartConfig = {
  'actual': { label: 'Historical', theme: { light: '#8B5CF6', dark: '#A78BFA' } },
  'predicted': { label: 'Predicted', theme: { light: '#0EA5E9', dark: '#38BDF8' } }
};
