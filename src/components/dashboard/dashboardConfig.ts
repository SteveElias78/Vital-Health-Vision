
// Color themes for the dashboard
export interface ColorTheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  className: string;
}

export const COLOR_THEMES: ColorTheme[] = [
  { id: 'default', name: 'Default', primary: 'text-blue-500', secondary: 'text-purple-500', className: 'theme-default' },
  { id: 'dark', name: 'Dark', primary: 'text-gray-300', secondary: 'text-gray-500', className: 'theme-dark' },
  { id: 'light', name: 'Light', primary: 'text-gray-900', secondary: 'text-gray-600', className: 'theme-light' },
  { id: 'blue', name: 'Blue', primary: 'text-blue-600', secondary: 'text-blue-400', className: 'theme-blue' },
  { id: 'green', name: 'Green', primary: 'text-green-600', secondary: 'text-green-400', className: 'theme-green' },
  { id: 'purple', name: 'Purple', primary: 'text-purple-600', secondary: 'text-purple-400', className: 'theme-purple' },
  { id: 'orange', name: 'Orange', primary: 'text-orange-600', secondary: 'text-orange-400', className: 'theme-orange' },
];

// Layout templates for the dashboard
export const LAYOUT_TEMPLATES = {
  'Template 1': [
    { i: 'health-trends', x: 0, y: 0, w: 3, h: 2 },
    { i: 'demographic-breakdown', x: 3, y: 0, w: 2, h: 2 },
    { i: 'prediction-model', x: 0, y: 2, w: 3, h: 2 },
    { i: 'correlation-matrix', x: 3, y: 2, w: 2, h: 2 },
  ],
  'Template 2': [
    { i: 'health-map', x: 0, y: 0, w: 2, h: 2 },
    { i: 'health-trends', x: 2, y: 0, w: 3, h: 2 },
    { i: 'demographic-breakdown', x: 0, y: 2, w: 2, h: 2 },
    { i: 'prediction-model', x: 2, y: 2, w: 3, h: 2 },
  ],
  'Template 3': [
    { i: 'correlation-matrix', x: 0, y: 0, w: 2, h: 2 },
    { i: 'health-map', x: 2, y: 0, w: 3, h: 2 },
    { i: 'health-trends', x: 0, y: 2, w: 3, h: 2 },
    { i: 'demographic-breakdown', x: 3, y: 2, w: 2, h: 2 },
  ],
  'standard': [
    { i: 'health-trends', x: 0, y: 0, w: 6, h: 2 },
    { i: 'demographic-breakdown', x: 6, y: 0, w: 6, h: 2 },
    { i: 'prediction-model', x: 0, y: 2, w: 6, h: 2 },
    { i: 'correlation-matrix', x: 6, y: 2, w: 6, h: 2 },
    { i: 'health-map', x: 0, y: 4, w: 6, h: 2 },
    { i: 'ai-insights', x: 6, y: 4, w: 6, h: 2 },
  ],
  'compact': [
    { i: 'health-trends', x: 0, y: 0, w: 4, h: 2 },
    { i: 'demographic-breakdown', x: 0, y: 2, w: 4, h: 2 },
    { i: 'prediction-model', x: 0, y: 4, w: 4, h: 2 },
    { i: 'correlation-matrix', x: 0, y: 6, w: 4, h: 2 },
    { i: 'health-map', x: 0, y: 8, w: 4, h: 2 },
    { i: 'ai-insights', x: 0, y: 10, w: 4, h: 2 },
  ]
};

// Widget definitions for the dashboard
import { ReactNode } from 'react';

export interface Widget {
  id: string;
  name: string;
  description: string;
  component: React.ComponentType<any>;
}

// We're removing the inline JSX components and just defining the widget metadata
// The actual components are imported in DashboardGrid.tsx
export const AVAILABLE_WIDGETS: Widget[] = [
  { id: 'health-trends', name: 'Health Trends', description: 'View health condition trends over time', component: () => null },
  { id: 'demographic-breakdown', name: 'Demographics', description: 'Analyze health conditions by demographic factors', component: () => null },
  { id: 'prediction-model', name: 'Prediction Model', description: 'View machine learning predictions for future trends', component: () => null },
  { id: 'correlation-matrix', name: 'Correlations', description: 'Explore relationships between health factors', component: () => null },
  { id: 'health-map', name: 'Geographic Map', description: 'View health metrics by region', component: () => null },
  { id: 'ai-insights', name: 'AI Insights', description: 'Claude AI-powered analysis of health data', component: () => null }
];
