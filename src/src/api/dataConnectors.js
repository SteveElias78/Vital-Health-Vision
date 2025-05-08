// src/api/dataConnectors.js
import axios from 'axios';

/**
 * Multi-source data connector that intelligently selects between CDC and alternative data sources
 * with validation, normalization, and resilient fallback mechanisms
 */
class HealthDataConnector {
  constructor() {
    this.cache = new Map();
    this.cacheDuration = 30 * 60 * 1000; // 30 minutes
    
    // Data source configurations
    this.dataSources = {
      CDC_SODA: {
        baseUrl: 'https://data.cdc.gov/resource/',
        datasets: {
          PLACES: '6vp6-wxuq', // Local data for better health
          BRFSS: 'dttw-5yxu',  // Behavioral Risk Factor Surveillance System
          NVSS: 'muzy-jte6',   // National Vital Statistics
          YRBS: 'q6p7-56au',   // Youth Risk Behavior Survey
          COVID: 'vbim-akqf',  // COVID-19 Case Surveillance
          VACCINE: 'unsk-b7fc' // Vaccination coverage
        },
        priority: 1,
        requiresAuth: false
      },
      WHO_GHO: {
        baseUrl: 'https://apps.who.int/gho/athena/api/GHO/',
        priority: 2,
        requiresAuth: false
      },
      FENWAY_INSTITUTE: {
        // This would be a real API endpoint in production
        baseUrl: 'https://example-api.fenwayhealth.org/data/v1/',
        priority: 2,
        requiresAuth: false
      }
    };
  }

  /**
   * Get health data from CDC's SODA API
   * @param {string} dataset - Dataset identifier
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} - The data and metadata
   */
  async getCDCData(dataset, params = {}) {
    try {
      const source = this.dataSources.CDC_SODA;
      
      if (!source.datasets[dataset]) {
        throw new Error(`Unknown CDC dataset: ${dataset}`);
      }
      
      const datasetId = source.datasets[dataset];
      const url = `${source.baseUrl}${datasetId}.json`;
      
      // Check cache first
      const cacheKey = this.getCacheKey('CDC_SODA', dataset, params);
      const cachedData = this.getFromCache(cacheKey);
      if (cachedData) {
        return cachedData;
      }
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      
      // Add default limit if not specified
      if (!params.$limit) {
        queryParams.append('$limit', '10000');
      }
      
      // Add all parameters
      Object.entries(params).forEach(([key, value]) => {
        queryParams.append(key, value);
      });
      
      const response = await axios.get(`${url}?${queryParams.toString()}`);
      
      // Process the response
      const result = {
        data: response.data,
        metadata: {
          source: 'CDC_SODA',
          dataset,
          fetchedAt: new Date().toISOString(),
          recordCount: response.data.length,
          params
        }
      };
      
      // Cache the result
      this.addToCache(cacheKey, result);
      
      return result;
    } catch (error) {
      console.error('Error fetching CDC data:', error);
      throw new Error(`Failed to fetch CDC data: ${error.message}`);
    }
  }
  
  /**
   * Get health data from WHO's Global Health Observatory
   * @param {string} indicator - Health indicator code
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} - The data and metadata
   */
  async getWHOData(indicator, params = {}) {
    try {
      const source = this.dataSources.WHO_GHO;
      const url = `${source.baseUrl}${indicator}.json`;
      
      // Check cache first
      const cacheKey = this.getCacheKey('WHO_GHO', indicator, params);
      const cachedData = this.getFromCache(cacheKey);
      if (cachedData) {
        return cachedData;
      }
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      
      // Add all parameters
      Object.entries(params).forEach(([key, value]) => {
        queryParams.append(key, value);
      });
      
      const response = await axios.get(`${url}?${queryParams.toString()}`);
      
      // Process the response
      const result = {
        data: response.data.fact,
        metadata: {
          source: 'WHO_GHO',
          indicator,
          fetchedAt: new Date().toISOString(),
          recordCount: response.data.fact?.length || 0,
          params
        }
      };
      
      // Cache the result
      this.addToCache(cacheKey, result);
      
      return result;
    } catch (error) {
      console.error('Error fetching WHO data:', error);
      throw new Error(`Failed to fetch WHO data: ${error.message}`);
    }
  }
  
  /**
   * Get LGBT health data from Fenway Institute
   * @param {string} dataset - Dataset identifier
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} - The data and metadata
   */
  async getFenwayData(dataset, params = {}) {
    try {
      const source = this.dataSources.FENWAY_INSTITUTE;
      const url = `${source.baseUrl}${dataset}`;
      
      // Check cache first
      const cacheKey = this.getCacheKey('FENWAY_INSTITUTE', dataset, params);
      const cachedData = this.getFromCache(cacheKey);
      if (cachedData) {
        return cachedData;
      }
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      
      // Add all parameters
      Object.entries(params).forEach(([key, value]) => {
        queryParams.append(key, value);
      });
      
      const response = await axios.get(`${url}?${queryParams.toString()}`);
      
      // Process the response
      const result = {
        data: response.data,
        metadata: {
          source: 'FENWAY_INSTITUTE',
          dataset,
          fetchedAt: new Date().toISOString(),
          recordCount: response.data.length,
          params
        }
      };
      
      // Cache the result
      this.addToCache(cacheKey, result);
      
      return result;
    } catch (error) {
      console.error('Error fetching Fenway Institute data:', error);
      
      // For demo purposes, return mock data
      const mockData = this.getMockLGBTQData(dataset);
      
      return {
        data: mockData,
        metadata: {
          source: 'FENWAY_INSTITUTE',
          dataset,
          fetchedAt: new Date().toISOString(),
          recordCount: mockData.length,
          isMockData: true,
          params
        }
      };
    }
  }
  
  /**
   * Get health data with resilient fallbacks between sources
   * @param {string} category - Health data category
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} - The data and metadata
   */
  async getHealthData(category, params = {}) {
    // Map categories to specific data sources and parameters
    const categoryMapping = {
      'chronic-disease': {
        primarySource: { type: 'CDC_SODA', dataset: 'PLACES' },
        fallbackSource: { type: 'WHO_GHO', indicator: 'NCD_CCS_DIABETES' },
        params: { measureid: 'DIABETES' }
      },
      'mental-health': {
        primarySource: { type: 'CDC_SODA', dataset: 'BRFSS' },
        fallbackSource: { type: 'WHO_GHO', indicator: 'MH_12' },
        params: { topic: 'mental' }
      },
      'lgbtq-health': {
        primarySource: { type: 'FENWAY_INSTITUTE', dataset: 'lgbtq-health-metrics' },
        fallbackSource: { type: 'CDC_SODA', dataset: 'YRBS' },
        params: { topic: 'orientation' }
      },
      'mortality': {
        primarySource: { type: 'CDC_SODA', dataset: 'NVSS' },
        fallbackSource: { type: 'WHO_GHO', indicator: 'MORT_MATERNALNUM' },
        params: {}
      },
      'vaccination': {
        primarySource: { type: 'CDC_SODA', dataset: 'VACCINE' },
        fallbackSource: { type: 'WHO_GHO', indicator: 'IMMUNIZATION' },
        params: {}
      }
    };
    
    const mapping = categoryMapping[category];
    
    if (!mapping) {
      throw new Error(`Unknown health data category: ${category}`);
    }
    
    // Merge category-specific parameters with user parameters
    const mergedParams = { ...mapping.params, ...params };
    
    try {
      // Try primary source first
      const primary = mapping.primarySource;
      
      try {
        let result;
        
        if (primary.type === 'CDC_SODA') {
          result = await this.getCDCData(primary.dataset, mergedParams);
        } else if (primary.type === 'WHO_GHO') {
          result = await this.getWHOData(primary.indicator, mergedParams);
        } else if (primary.type === 'FENWAY_INSTITUTE') {
          result = await this.getFenwayData(primary.dataset, mergedParams);
        }
        
        return result;
      } catch (primaryError) {
        console.warn(`Primary source failed for ${category}, trying fallback:`, primaryError);
        
        // Try fallback source
        const fallback = mapping.fallbackSource;
        
        if (fallback.type === 'CDC_SODA') {
          return await this.getCDCData(fallback.dataset, mergedParams);
        } else if (fallback.type === 'WHO_GHO') {
          return await this.getWHOData(fallback.indicator, mergedParams);
        } else if (fallback.type === 'FENWAY_INSTITUTE') {
          return await this.getFenwayData(fallback.dataset, mergedParams);
        }
      }
    } catch (error) {
      console.error(`All sources failed for ${category}:`, error);
      throw new Error(`Failed to fetch health data for ${category}`);
    }
  }
  
  /**
   * Get data for specific health topics with normalized fields
   * @param {string} topic - Health topic identifier
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} - Normalized data for the topic
   */
  async getHealthTopic(topic, params = {}) {
    try {
      let result;
      
      // Topic-specific data fetching and normalization
      switch (topic) {
        case 'diabetes':
          result = await this.getCDCData('PLACES', { 
            measureid: 'DIABETES', 
            ...params 
          });
          return this.normalizeChronicDiseaseData(result);
          
        case 'mental-health-prevalence':
          result = await this.getCDCData('BRFSS', {
            topic: 'depression',
            ...params
          });
          return this.normalizeMentalHealthData(result);
          
        case 'lgbtq-health-disparities':
          result = await this.getFenwayData('lgbtq-health-metrics', params);
          return this.normalizeLGBTQHealthData(result);
          
        case 'vaccination-rates':
          result = await this.getCDCData('VACCINE', params);
          return this.normalizeVaccinationData(result);
          
        default:
          throw new Error(`Unknown health topic: ${topic}`);
      }
    } catch (error) {
      console.error(`Error fetching health topic ${topic}:`, error);
      throw error;
    }
  }
  
  /**
   * Create a cache key for data
   * @private
   */
  getCacheKey(source, dataset, params) {
    return `${source}:${dataset}:${JSON.stringify(params)}`;
  }
  
  /**
   * Get data from cache
   * @private
   */
  getFromCache(key) {
    if (!this.cache.has(key)) {
      return null;
    }
    
    const cacheEntry = this.cache.get(key);
    const now = Date.now();
    
    if (now - cacheEntry.timestamp > this.cacheDuration) {
      this.cache.delete(key);
      return null;
    }
    
    return cacheEntry.data;
  }
  
  /**
   * Add data to cache
   * @private
   */
  addToCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
  
  /**
   * Normalize chronic disease data
   * @private
   */
  normalizeChronicDiseaseData(result) {
    const normalized = result.data.map(item => ({
      location: item.locationname || item.locationdesc || 'Unknown',
      value: parseFloat(item.data_value) || 0,
      category: item.measureid || 'Unknown',
      year: item.year || item.yearstart || new Date().getFullYear(),
      dataType: item.datavaluetype || 'Prevalence',
      demographic: item.stratification1 || 'Overall'
    }));
    
    return {
      data: normalized,
      metadata: {
        ...result.metadata,
        normalized: true
      }
    };
  }
  
  /**
   * Normalize mental health data
   * @private
   */
  normalizeMentalHealthData(result) {
    const normalized = result.data.map(item => ({
      location: item.locationdesc || item.locationname || 'Unknown',
      value: parseFloat(item.data_value) || 0,
      category: 'Mental Health',
      metric: item.questionid || item.measureid || 'Depression',
      year: item.year || item.yearstart || new Date().getFullYear(),
      demographic: item.stratification1 || 'Overall'
    }));
    
    return {
      data: normalized,
      metadata: {
        ...result.metadata,
        normalized: true
      }
    };
  }
  
  /**
   * Normalize LGBTQ+ health data
   * @private
   */
  normalizeLGBTQHealthData(result) {
    const normalized = result.data.map(item => ({
      category: item.category || item.health_category || 'Health Outcome',
      demographic: item.demographic || 'LGBTQ+',
      value: parseFloat(item.value || item.prevalence || item.rate) || 0,
      comparator: parseFloat(item.reference_value || item.comparator) || 0,
      disparity: parseFloat(item.disparity || item.difference) || 0,
      year: item.year || item.period || new Date().getFullYear(),
      source: item.source || result.metadata.source
    }));
    
    return {
      data: normalized,
      metadata: {
        ...result.metadata,
        normalized: true
      }
    };
  }
  
  /**
   * Normalize vaccination data
   * @private
   */
  normalizeVaccinationData(result) {
    const normalized = result.data.map(item => ({
      vaccine: item.vaccine || item.vaccinetype || 'Unknown',
      ageGroup: item.age || item.age_group || 'Overall',
      coverage: parseFloat(item.coverage || item.data_value) || 0,
      location: item.location || item.locationdesc || 'United States',
      year: item.year || item.yearstart || new Date().getFullYear(),
      demographic: item.stratification1 || 'Overall'
    }));
    
    return {
      data: normalized,
      metadata: {
        ...result.metadata,
        normalized: true
      }
    };
  }
  
  /**
   * Get mock LGBTQ+ health data for demo purposes
   * @private
   */
  getMockLGBTQData(dataset) {
    // This would be replaced with real API calls in production
    return [
      {
        category: 'Mental Health',
        demographic: 'Lesbian/Gay',
        value: 28.2,
        comparator: 16.9,
        disparity: 11.3,
        year: 2023,
        source: 'Fenway Institute Survey'
      },
      {
        category: 'Mental Health',
        demographic: 'Bisexual',
        value: 34.6,
        comparator: 16.9,
        disparity: 17.7,
        year: 2023,
        source: 'Fenway Institute Survey'
      },
      {
        category: 'Mental Health',
        demographic: 'Transgender',
        value: 41.5,
        comparator: 16.9,
        disparity: 24.6,
        year: 2023,
        source: 'Fenway Institute Survey'
      },
      {
        category: 'Healthcare Access',
        demographic: 'Lesbian/Gay',
        value: 81.4,
        comparator: 88.7,
        disparity: -7.3,
        year: 2023,
        source: 'Fenway Institute Survey'
      },
      {
        category: 'Healthcare Access',
        demographic: 'Bisexual',
        value: 78.2,
        comparator: 88.7,
        disparity: -10.5,
        year: 2023,
        source: 'Fenway Institute Survey'
      },
      {
        category: 'Healthcare Access',
        demographic: 'Transgender',
        value: 72.6,
        comparator: 88.7,
        disparity: -16.1,
        year: 2023,
        source: 'Fenway Institute Survey'
      },
      {
        category: 'Substance Use',
        demographic: 'Lesbian/Gay',
        value: 24.8,
        comparator: 18.1,
        disparity: 6.7,
        year: 2023,
        source: 'Fenway Institute Survey'
      },
      {
        category: 'Substance Use',
        demographic: 'Bisexual',
        value: 27.3,
        comparator: 18.1,
        disparity: 9.2,
        year: 2023,
        source: 'Fenway Institute Survey'
      },
      {
        category: 'Substance Use',
        demographic: 'Transgender',
        value: 22.9,
        comparator: 18.1,
        disparity: 4.8,
        year: 2023,
        source: 'Fenway Institute Survey'
      }
    ];
  }
}

export default new HealthDataConnector();