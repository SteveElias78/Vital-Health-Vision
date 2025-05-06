export const COLOR_THEMES = [
  { name: 'Default', className: 'theme-default' },
  { name: 'Dark', className: 'theme-dark' },
  { name: 'Light', className: 'theme-light' },
  { name: 'Blue', className: 'theme-blue' },
  { name: 'Green', className: 'theme-green' },
  { name: 'Purple', className: 'theme-purple' },
  { name: 'Orange', className: 'theme-orange' },
];

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
};

export const AVAILABLE_WIDGETS = [
  { id: 'health-trends', name: 'Health Trends', description: 'View health condition trends over time' },
  { id: 'demographic-breakdown', name: 'Demographics', description: 'Analyze health conditions by demographic factors' },
  { id: 'prediction-model', name: 'Prediction Model', description: 'View machine learning predictions for future trends' },
  { id: 'correlation-matrix', name: 'Correlations', description: 'Explore relationships between health factors' },
  { id: 'health-map', name: 'Geographic Map', description: 'View health metrics by region' },
  { id: 'ai-insights', name: 'AI Insights', description: 'Claude AI-powered analysis of health data' }
];
