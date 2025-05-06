
import { AuthConfig, DataSourceConfig } from '../utils/types';

// Government data sources
export const GOVERNMENT_SOURCES: Record<string, DataSourceConfig> = {
  WHO_GLOBAL_HEALTH_OBSERVATORY: {
    baseUrl: 'https://www.who.int/data/gho/data/api',
    endpoints: {
      indicators: '/indicators',
      countries: '/countries',
      dimensions: '/dimensions',
    },
    requiresAuth: true,
    authType: 'apiKey',
    reliability: 0.95,
    categories: ['global', 'mortality', 'disease', 'health-systems'],
    cacheEnabled: true,
    cacheDuration: 3600000, // 1 hour
  },
  
  WHO_INEQUALITY_REPOSITORY: {
    baseUrl: 'https://www.who.int/data/inequality-monitor/api',
    endpoints: {
      indicators: '/indicators',
      dimensions: '/dimensions',
      countries: '/countries',
    },
    requiresAuth: true,
    authType: 'apiKey',
    reliability: 0.95,
    categories: ['inequality', 'demographics', 'social-determinants'],
    cacheEnabled: true,
    cacheDuration: 3600000, // 1 hour
  },
  
  CDC_WONDER: {
    baseUrl: 'https://wonder.cdc.gov/api',
    endpoints: {
      mortality: '/mortality',
      natality: '/natality',
      cancer: '/cancer',
    },
    requiresAuth: true,
    authType: 'apiKey',
    reliability: 0.85,
    categories: ['mortality', 'birth', 'cancer'],
    cacheEnabled: true,
    cacheDuration: 3600000, // 1 hour
  },
  
  CDC_NCHS: {
    baseUrl: 'https://www.cdc.gov/nchs/api',
    endpoints: {
      indicators: '/indicators',
      datasets: '/datasets',
    },
    requiresAuth: true,
    authType: 'apiKey',
    reliability: 0.85,
    categories: ['vital-statistics', 'health-surveys', 'mortality'],
    cacheEnabled: true,
    cacheDuration: 3600000, // 1 hour
  },
  
  OECD_HEALTH: {
    baseUrl: 'https://stats.oecd.org/restsdmx/sdmx.ashx/GetData/HEALTH',
    endpoints: {
      stats: '/all',
      healthStats: '/health',
    },
    requiresAuth: false,
    reliability: 0.9,
    categories: ['health-systems', 'expenditure', 'workforce', 'access'],
    cacheEnabled: true,
    cacheDuration: 3600000, // 1 hour
  },
  
  NHANES: {
    baseUrl: 'https://data.cdc.gov/resource/mm6f-kvrv.json',
    requiresAuth: false,
    reliability: 0.95,
    categories: ['obesity', 'mental-health', 'general-health'],
    cacheEnabled: true,
    cacheDuration: 3600000, // 1 hour
  },
  
  BRFSS: {
    baseUrl: 'https://data.cdc.gov/resource/dxpw-cm5u.json',
    requiresAuth: false,
    reliability: 0.9,
    categories: ['obesity', 'mental-health', 'general-health'],
    cacheEnabled: true,
    cacheDuration: 3600000, // 1 hour
  },
  
  WHO_GHO: {
    baseUrl: 'https://ghoapi.azureedge.net/api/en',
    requiresAuth: true,
    authType: 'apiKey',
    reliability: 0.95,
    categories: ['general-health', 'mortality'],
    cacheEnabled: true,
    cacheDuration: 3600000, // 1 hour
  },
  
  CDC_DATA_GOV: {
    baseUrl: 'https://data.cdc.gov/resource/bi63-dtpu.json',
    requiresAuth: true,
    authType: 'apiKey',
    reliability: 0.9,
    categories: ['mortality', 'chronic-disease'],
    cacheEnabled: true,
    cacheDuration: 3600000, // 1 hour
  }
};

// Add additional configuration for alternative health data sources
export const ALTERNATIVE_SOURCES: Record<string, any> = {
  INTERNET_ARCHIVE_CDC: {
    baseUrl: 'https://archive.org/download/20250128-cdc-datasets/api',
    endpoints: {
      lgbtqHealth: '/lgbtq-health',
      youthRisk: '/youth-risk',
      minorityHealth: '/minority-health',
      socialVulnerability: '/social-vulnerability',
    },
    priority: 3,
    requiresAuth: false,
    reliability: 0.9,
    categories: ['lgbtq-health', 'youth', 'minority-health', 'social-determinants'],
    dataDate: '2025-01-28', // Date of archived snapshot
    cacheEnabled: true,
    cacheDuration: 3600000, // 1 hour
  },
  
  FENWAY_INSTITUTE: {
    baseUrl: 'https://fenwayhealth.org/api/research-data',
    endpoints: {
      lgbtqHealthDisparities: '/lgbtq-health-disparities',
      sogiBestPractices: '/sogi-data-collection',
      minorityHealthMetrics: '/minority-health-metrics',
    },
    priority: 1,
    requiresAuth: true,
    authType: 'apiKey',
    reliability: 0.9,
    categories: ['lgbtq-health', 'mental-health', 'obesity'],
    cacheEnabled: true,
    cacheDuration: 3600000, // 1 hour
  },
  
  WILLIAMS_INSTITUTE: {
    baseUrl: 'https://williamsinstitute.law.ucla.edu/api',
    endpoints: {
      demographicDatasets: '/demographic-datasets',
      lgbtCensusData: '/lgbt-census-data',
      healthDisparities: '/health-disparities',
    },
    priority: 4,
    requiresAuth: false,
    reliability: 0.75,
    categories: ['lgbtq-health'],
    cacheEnabled: true,
    cacheDuration: 3600000, // 1 hour
  },
  
  OUR_WORLD_DATA: {
    baseUrl: 'https://ourworldindata.org/api',
    endpoints: {
      healthMetrics: '/health-metrics',
      lifeExpectancy: '/life-expectancy',
      childMortality: '/child-mortality',
    },
    priority: 3,
    requiresAuth: false,
    reliability: 0.9,
    categories: ['global', 'mortality', 'life-expectancy', 'child-health'],
    cacheEnabled: true,
    cacheDuration: 3600000, // 1 hour
  },
  
  THE_19TH_ARCHIVE: {
    baseUrl: 'https://19tharchive.org/api',
    endpoints: {
      maternalMortality: '/cdc-maternal-mortality-archive',
      lgbtqYouthData: '/cdc-lgbtq-youth-archive',
      contraceptionData: '/cdc-contraception-archive',
    },
    priority: 3,
    requiresAuth: true,
    authType: 'oauth',
    reliability: 0.8,
    categories: ['maternal-health', 'lgbtq-health'],
    cacheEnabled: true,
    cacheDuration: 3600000, // 1 hour
  },
  
  GHDX_IHME: {
    baseUrl: 'https://ghdx.healthdata.org/api',
    endpoints: {
      globalBurdenDisease: '/gbd',
      indicators: '/indicators',
      countries: '/countries',
    },
    priority: 5,
    requiresAuth: true,
    authType: 'apiKey',
    reliability: 0.7,
    categories: ['youth-risk-behavior'],
    cacheEnabled: true,
    cacheDuration: 3600000, // 1 hour
  },
  
  LGBT_DATA: {
    baseUrl: 'https://lgbtdata.com/api',
    endpoints: {
      healthSurveys: '/health-surveys',
      demographicData: '/demographic-data',
      riskFactors: '/risk-factors',
    },
    priority: 2,
    requiresAuth: false,
    reliability: 0.85,
    categories: ['lgbtq-health'],
    cacheEnabled: true,
    cacheDuration: 3600000, // 1 hour
  },
  
  DATA_LUMOS: {
    baseUrl: 'https://datalumos.org/api',
    endpoints: {
      yrbsHistorical: '/cdc-yrbs-historical',
      hivSurveillance: '/hiv-surveillance-archived',
    },
    priority: 5,
    requiresAuth: true,
    authType: 'apiKey',
    reliability: 0.7,
    categories: ['youth-risk-behavior'],
    cacheEnabled: true,
    cacheDuration: 3600000, // 1 hour
  }
};

// Authentication configurations for data sources
export const AUTH_CONFIG: Record<string, AuthConfig> = {
  WHO_GLOBAL_HEALTH_OBSERVATORY: {
    apiKey: import.meta.env.VITE_WHO_API_KEY || '',
    headerName: 'Ocp-Apim-Subscription-Key',
  },
  WHO_INEQUALITY_REPOSITORY: {
    apiKey: import.meta.env.VITE_WHO_INEQUALITY_API_KEY || '',
    headerName: 'Ocp-Apim-Subscription-Key',
  },
  CDC_WONDER: {
    apiKey: import.meta.env.VITE_CDC_WONDER_API_KEY || '',
    headerName: 'X-API-Key',
  },
  CDC_NCHS: {
    apiKey: import.meta.env.VITE_CDC_NCHS_API_KEY || '',
    headerName: 'X-API-Key',
  },
  WHO_GHO: {
    apiKey: import.meta.env.VITE_WHO_API_KEY || '',
    headerName: 'Ocp-Apim-Subscription-Key',
  },
  CDC_DATA_GOV: {
    apiKey: import.meta.env.VITE_CDC_API_KEY || '',
    headerName: 'X-App-Token',
  },
  FENWAY_INSTITUTE: {
    apiKey: import.meta.env.VITE_FENWAY_API_KEY || '',
    headerName: 'X-API-Key',
  },
  GHDX_IHME: {
    apiKey: import.meta.env.VITE_GHDX_IHME_API_KEY || '',
    headerName: 'X-API-Key',
  },
  DATA_LUMOS: {
    apiKey: import.meta.env.VITE_DATA_LUMOS_API_KEY || '',
    headerName: 'X-API-Key',
  }
};

// Define which data categories might be compromised and need alternative sources
export const COMPROMISED_CATEGORIES = [
  'lgbtq-health',
  'gender-identity',
  'sexual-orientation',
  'reproductive-health',
  'maternal-health',
  'minority-health',
  'social-determinants',
  'health-equity',
  'youth-risk',
  'transgender-health'
];
