
/**
 * Configuration for government health data sources
 */
export const GOVERNMENT_SOURCES = {
  CDC_DATA_GOV: {
    baseUrl: 'https://data.cdc.gov/api/views',
    datasetIds: {
      BRFSS: 'dttw-5yxu', // BRFSS Prevalence Data
      PLACES: 'cwsq-ngmh',
      WONDER: 'static/API'
    },
    requiresAuth: true,
    authType: 'apiKey',
    reliability: 0.85,
    categories: ['behavioral-risk', 'chronic-disease', 'demographics'],
    integrityVerificationRequired: true
  },
  WHO_GHO: {
    baseUrl: 'https://ghoapi.azureedge.net/api',
    endpoints: {
      indicators: '/indicator',
      dimensions: '/dimension',
      countries: '/country'
    },
    requiresAuth: true,
    authType: 'apiKey',
    reliability: 0.95,
    categories: ['global', 'mortality', 'disease', 'health-systems'],
    integrityVerificationRequired: false
  },
  NHANES: {
    baseUrl: 'https://wwwn.cdc.gov/nchs/nhanes',
    apiEndpoint: '/api',
    downloadEndpoint: '/xpt',
    requiresAuth: false,
    reliability: 0.95,
    categories: ['nutrition', 'examination', 'laboratory', 'demographics'],
    integrityVerificationRequired: true
  },
};

/**
 * Configuration for alternative health data sources
 */
export const ALTERNATIVE_SOURCES = {
  INTERNET_ARCHIVE_CDC: {
    baseUrl: 'https://archive.org/download/20250128-cdc-datasets/api',
    endpoints: {
      lgbtqHealth: '/lgbtq-health',
      youthRisk: '/youth-risk',
      minorityHealth: '/minority-health',
    },
    requiresAuth: false,
    reliability: 0.9,
    categories: ['lgbtq', 'youth', 'minority-health'],
    dataDate: '2025-01-28'
  },
  FENWAY_INSTITUTE: {
    baseUrl: 'https://fenwayhealth.org/api/research-data',
    endpoints: {
      lgbtqHealthDisparities: '/lgbtq-health-disparities',
      sogiBestPractices: '/sogi-data-collection',
    },
    requiresAuth: true,
    authType: 'apiKey',
    reliability: 0.9,
    categories: ['lgbtq', 'sogi', 'health-disparities']
  },
  THE_19TH_ARCHIVE: {
    baseUrl: 'https://19tharchive.org/api',
    endpoints: {
      maternalMortality: '/cdc-maternal-mortality-archive',
      lgbtqYouthData: '/cdc-lgbtq-youth-archive',
    },
    requiresAuth: true,
    authType: 'oauth',
    reliability: 0.85,
    categories: ['maternal-health', 'lgbtq', 'youth']
  },
};

/**
 * Define potentially compromised data categories that may require alternative sources
 */
export const COMPROMISED_CATEGORIES = [
  'lgbtq',
  'gender-identity',
  'sexual-orientation',
  'reproductive-health',
  'minority-health',
  'social-determinants',
  'health-equity',
  'youth-risk'
];

/**
 * Auth configuration for data sources
 * Note: In a real application, API keys would be stored in environment variables
 */
export const AUTH_CONFIG = {
  CDC_DATA_GOV: {
    apiKey: 'placeholder-cdc-key', // Replace with actual key in production
    headerName: 'X-App-Token'
  },
  WHO_GHO: {
    apiKey: 'placeholder-who-key', // Replace with actual key in production
    headerName: 'X-API-Key'
  },
  FENWAY_INSTITUTE: {
    apiKey: 'placeholder-fenway-key', // Replace with actual key in production
    headerName: 'Authorization',
    prefix: 'Bearer '
  },
  THE_19TH_ARCHIVE: {
    clientId: 'placeholder-19th-client-id', // Replace with actual ID in production
    clientSecret: 'placeholder-19th-client-secret', // Replace with actual secret in production
    tokenUrl: 'https://19tharchive.org/oauth/token',
    grantType: 'client_credentials'
  },
};

/**
 * Types for the data source configurations
 */
export interface DataSourceConfig {
  baseUrl: string;
  requiresAuth: boolean;
  authType?: 'apiKey' | 'oauth';
  reliability: number;
  categories: string[];
  integrityVerificationRequired?: boolean;
  dataDate?: string;
  [key: string]: any; // For additional properties like endpoints, datasetIds
}

export interface AuthConfig {
  apiKey?: string;
  headerName?: string;
  prefix?: string;
  clientId?: string;
  clientSecret?: string;
  tokenUrl?: string;
  grantType?: string;
}

export type GovernmentSources = {
  [key: string]: DataSourceConfig;
};

export type AlternativeSources = {
  [key: string]: DataSourceConfig;
};

export type AuthConfigs = {
  [key: string]: AuthConfig;
};
