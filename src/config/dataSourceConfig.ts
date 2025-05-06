
import { AuthConfig, DataSourceConfig } from '../utils/types';

// Government data sources
export const GOVERNMENT_SOURCES: Record<string, DataSourceConfig> = {
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

// Authentication configurations for data sources
export const AUTH_CONFIG: Record<string, AuthConfig> = {
  WHO_GHO: {
    apiKey: process.env.WHO_API_KEY,
    headerName: 'Ocp-Apim-Subscription-Key',
  },
  CDC_DATA_GOV: {
    apiKey: process.env.CDC_API_KEY,
    headerName: 'X-App-Token',
  },
};

// Add additional configuration for The Fenway Institute and other alternative sources
export const ALTERNATIVE_SOURCES = {
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
  },
  INTERNET_ARCHIVE_CDC: {
    baseUrl: 'https://archive.org/services/health-data',
    endpoints: {
      lgbtqHealth: '/lgbtq-health-archive',
      youthRisk: '/youth-risk-archive',
      minorityHealth: '/minority-health-archive',
    },
    dataDate: '2022-01-15',
    priority: 6,
    requiresAuth: false,
    reliability: 0.65,
    categories: ['lgbtq-health', 'youth-risk-behavior'],
  }
};

// Define which data categories might be compromised and need alternative sources
export const COMPROMISED_CATEGORIES = ['lgbtq-health', 'maternal-health', 'transgender-health', 'reproductive-health'];
