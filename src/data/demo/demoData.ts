
/**
 * This file provides demo data for the Vital Health Vision application
 * These datasets are used when a user logs in with demo credentials
 */

export const demoDashboardLayouts = {
  lg: [
    { i: "health-overview", x: 0, y: 0, w: 12, h: 6 },
    { i: "obesity-trends", x: 0, y: 6, w: 6, h: 8 },
    { i: "mental-health", x: 6, y: 6, w: 6, h: 8 },
    { i: "source-comparison", x: 0, y: 14, w: 12, h: 7 },
    { i: "data-reliability", x: 0, y: 21, w: 6, h: 6 },
    { i: "predictive-model", x: 6, y: 21, w: 6, h: 6 }
  ],
  md: [
    { i: "health-overview", x: 0, y: 0, w: 10, h: 6 },
    { i: "obesity-trends", x: 0, y: 6, w: 10, h: 7 },
    { i: "mental-health", x: 0, y: 13, w: 10, h: 7 },
    { i: "source-comparison", x: 0, y: 20, w: 10, h: 7 },
    { i: "data-reliability", x: 0, y: 27, w: 5, h: 6 },
    { i: "predictive-model", x: 5, y: 27, w: 5, h: 6 }
  ],
  sm: [
    { i: "health-overview", x: 0, y: 0, w: 6, h: 6 },
    { i: "obesity-trends", x: 0, y: 6, w: 6, h: 7 },
    { i: "mental-health", x: 0, y: 13, w: 6, h: 7 },
    { i: "source-comparison", x: 0, y: 20, w: 6, h: 7 },
    { i: "data-reliability", x: 0, y: 27, w: 6, h: 6 },
    { i: "predictive-model", x: 0, y: 33, w: 6, h: 6 }
  ],
  xs: [
    { i: "health-overview", x: 0, y: 0, w: 4, h: 6 },
    { i: "obesity-trends", x: 0, y: 6, w: 4, h: 7 },
    { i: "mental-health", x: 0, y: 13, w: 4, h: 7 },
    { i: "source-comparison", x: 0, y: 20, w: 4, h: 7 },
    { i: "data-reliability", x: 0, y: 27, w: 4, h: 6 },
    { i: "predictive-model", x: 0, y: 33, w: 4, h: 6 }
  ],
  xxs: [
    { i: "health-overview", x: 0, y: 0, w: 2, h: 6 },
    { i: "obesity-trends", x: 0, y: 6, w: 2, h: 7 },
    { i: "mental-health", x: 0, y: 13, w: 2, h: 7 },
    { i: "source-comparison", x: 0, y: 20, w: 2, h: 7 },
    { i: "data-reliability", x: 0, y: 27, w: 2, h: 6 },
    { i: "predictive-model", x: 0, y: 33, w: 2, h: 6 }
  ]
};

export const demoChronicDiseaseData = [
  { category: 'Diabetes', value: 12.5, location: 'United States', demographic: 'Overall', year: 2023 },
  { category: 'Hypertension', value: 29.3, location: 'United States', demographic: 'Overall', year: 2023 },
  { category: 'Heart Disease', value: 7.2, location: 'United States', demographic: 'Overall', year: 2023 },
  { category: 'Asthma', value: 8.4, location: 'United States', demographic: 'Overall', year: 2023 },
  { category: 'Obesity', value: 41.9, location: 'United States', demographic: 'Overall', year: 2023 },
  { category: 'Cancer', value: 4.8, location: 'United States', demographic: 'Overall', year: 2023 },
  { category: 'Stroke', value: 2.5, location: 'United States', demographic: 'Overall', year: 2023 },
  { category: 'COPD', value: 6.4, location: 'United States', demographic: 'Overall', year: 2023 }
];

export const demoMentalHealthData = [
  { category: 'Depression', value: 8.4, location: 'United States', demographic: 'Overall', year: 2023 },
  { category: 'Anxiety', value: 19.1, location: 'United States', demographic: 'Overall', year: 2023 },
  { category: 'Bipolar Disorder', value: 2.8, location: 'United States', demographic: 'Overall', year: 2023 },
  { category: 'PTSD', value: 3.6, location: 'United States', demographic: 'Overall', year: 2023 },
  { category: 'Schizophrenia', value: 0.3, location: 'United States', demographic: 'Overall', year: 2023 },
  { category: 'OCD', value: 1.2, location: 'United States', demographic: 'Overall', year: 2023 }
];

export const demoLgbtqHealthData = [
  { category: 'Depression', value: 14.2, location: 'United States', demographic: 'LGBTQ+', year: 2023 },
  { category: 'Anxiety', value: 24.5, location: 'United States', demographic: 'LGBTQ+', year: 2023 },
  { category: 'Substance Use', value: 12.8, location: 'United States', demographic: 'LGBTQ+', year: 2023 },
  { category: 'Suicide Risk', value: 8.9, location: 'United States', demographic: 'LGBTQ+', year: 2023 },
  { category: 'Healthcare Access', value: 76.3, location: 'United States', demographic: 'LGBTQ+', year: 2023 }
];

export const demoDataSources = [
  {
    id: 'cdc',
    name: 'CDC',
    status: 'online',
    reliability: 0.95,
    responseTime: 240,
    lastUpdated: '2023-04-15T12:30:00Z',
    categories: ['obesity', 'mental-health', 'chronic-disease']
  },
  {
    id: 'who',
    name: 'World Health Organization',
    status: 'online',
    reliability: 0.92,
    responseTime: 350,
    lastUpdated: '2023-03-28T09:15:00Z',
    categories: ['global-health', 'pandemic-data', 'infectious-disease']
  },
  {
    id: 'nih',
    name: 'National Institutes of Health',
    status: 'online',
    reliability: 0.98,
    responseTime: 180,
    lastUpdated: '2023-04-12T16:45:00Z',
    categories: ['clinical-trials', 'mental-health', 'rare-disease']
  },
  {
    id: 'fenway',
    name: 'Fenway Institute',
    status: 'online',
    reliability: 0.91,
    responseTime: 290,
    lastUpdated: '2023-04-05T11:20:00Z',
    categories: ['lgbtq-health', 'health-equity']
  },
  {
    id: 'census',
    name: 'US Census Bureau',
    status: 'degraded',
    reliability: 0.88,
    responseTime: 420,
    lastUpdated: '2023-03-15T13:10:00Z',
    categories: ['demographics', 'population-health']
  }
];

export const demoPredictiveModels = [
  {
    id: 'obesity-trend',
    name: 'Obesity Trend Forecasting',
    accuracy: 0.86,
    type: 'time-series',
    features: ['historical_rates', 'socioeconomic_factors', 'regional_data'],
    lastTrained: '2023-03-10T08:45:00Z',
    predictions: [
      { year: 2023, value: 41.9 },
      { year: 2024, value: 42.7 },
      { year: 2025, value: 43.2 },
      { year: 2026, value: 44.0 },
      { year: 2027, value: 44.5 }
    ]
  },
  {
    id: 'mental-health',
    name: 'Mental Health Prevalence',
    accuracy: 0.83,
    type: 'regression',
    features: ['age', 'region', 'socioeconomic_status', 'prior_conditions'],
    lastTrained: '2023-02-25T14:20:00Z',
    predictions: [
      { year: 2023, value: 21.3 },
      { year: 2024, value: 22.1 },
      { year: 2025, value: 23.4 },
      { year: 2026, value: 24.2 },
      { year: 2027, value: 25.0 }
    ]
  }
];

export const demoUserSettings = {
  colorTheme: 'gold-black',
  compactMode: false,
  defaultDataSource: 'hybrid',
  showSourceInfo: true,
  dataUpdateFrequency: 'daily',
  notificationsEnabled: true
};

export const demoDashboardConfig = {
  layouts: demoDashboardLayouts,
  activeWidgets: [
    "health-overview", 
    "obesity-trends", 
    "mental-health", 
    "source-comparison", 
    "data-reliability", 
    "predictive-model"
  ],
  colorTheme: 'default',
  compactMode: false
};
