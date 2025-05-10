
import { demoDataService, HealthDataCategory } from '../demo/DemoDataService';

export class EnhancedHealthDataConnector {
  async getHealthData(category: string, options: any = {}) {
    // Simulate an enhanced data processing pipeline
    console.log('Fetching enhanced health data for category:', category);
    
    try {
      // Get base data from the demo service
      const { data, metadata } = await demoDataService.getHealthData(category as HealthDataCategory);
      
      // Apply enhanced processing based on view option
      if (options.view === 'comparison') {
        return this.enhanceWithComparison(data, metadata);
      } else if (options.view === 'predictions') {
        return this.enhanceWithPredictions(data, metadata);
      } else if (options.view === 'correlations') {
        return this.enhanceWithCorrelations(data, metadata);
      }
      
      // Default enhancement
      return { 
        ...data,
        metadata: {
          ...metadata,
          enhanced: true,
          processingLevel: 'advanced',
          confidenceScore: 0.89,
          lastUpdated: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error in enhanced health data connector:', error);
      throw new Error('Failed to process enhanced health data');
    }
  }
  
  private enhanceWithComparison(data: any, metadata: any) {
    // Add comparison data between different sources or time periods
    return {
      ...data,
      comparison: {
        // Generate year-over-year comparison
        yearOverYear: data.timeSeries ? this.calculateYearOverYear(data.timeSeries) : [],
        // Source comparison if multiple sources are available
        sourceDifference: this.calculateSourceDifference(data)
      },
      metadata: {
        ...metadata,
        enhanced: true,
        processingLevel: 'comparison',
        comparisonMethod: 'statistical difference analysis',
        significanceThreshold: 0.05,
        lastUpdated: new Date().toISOString()
      }
    };
  }
  
  private enhanceWithPredictions(data: any, metadata: any) {
    // Add prediction data extending from time series
    return {
      ...data,
      predictions: {
        // Simple linear projection
        sixMonthProjection: data.timeSeries ? this.generateProjection(data.timeSeries, 6) : [],
        // Regional projections
        regionalProjections: data.regional ? this.generateRegionalProjections(data.regional) : {}
      },
      metadata: {
        ...metadata,
        enhanced: true,
        processingLevel: 'predictive',
        modelType: 'time-series regression',
        confidenceInterval: 0.95,
        lastUpdated: new Date().toISOString()
      }
    };
  }
  
  private enhanceWithCorrelations(data: any, metadata: any) {
    // Add correlation analysis between different metrics
    return {
      ...data,
      correlations: {
        factors: [
          { factor: "Income Level", correlation: -0.68, significance: 0.95 },
          { factor: "Education", correlation: -0.72, significance: 0.97 },
          { factor: "Healthcare Access", correlation: -0.58, significance: 0.91 },
          { factor: "Physical Activity", correlation: -0.76, significance: 0.98 },
          { factor: "Dietary Factors", correlation: 0.65, significance: 0.94 }
        ],
        methodology: "Pearson correlation coefficient analysis with significance testing"
      },
      metadata: {
        ...metadata,
        enhanced: true,
        processingLevel: 'correlation',
        analysisMethod: 'multivariate correlation',
        lastUpdated: new Date().toISOString()
      }
    };
  }
  
  // Helper methods for data enhancements
  
  private calculateYearOverYear(timeSeriesData: any[]) {
    if (!timeSeriesData || timeSeriesData.length < 13) return [];
    
    const result = [];
    for (let i = 12; i < timeSeriesData.length; i++) {
      const current = timeSeriesData[i];
      const previousYear = timeSeriesData[i - 12];
      
      if (current && previousYear) {
        const percentChange = ((current.value - previousYear.value) / previousYear.value) * 100;
        
        result.push({
          date: current.date,
          currentValue: current.value,
          previousYearValue: previousYear.value,
          percentChange: parseFloat(percentChange.toFixed(2))
        });
      }
    }
    
    return result;
  }
  
  private calculateSourceDifference(data: any) {
    const sources = data.bySource;
    if (!sources) return [];
    
    const sourceKeys = Object.keys(sources);
    if (sourceKeys.length < 2) return [];
    
    // Compare the first two sources
    const source1 = sourceKeys[0];
    const source2 = sourceKeys[1];
    
    const source1Data = sources[source1];
    const source2Data = sources[source2];
    
    if (!source1Data || !source2Data) return [];
    
    // Match data points by location/state
    const comparisonMap = new Map();
    
    source1Data.forEach((point: any) => {
      if (point.locationdesc) {
        comparisonMap.set(point.locationdesc, { 
          location: point.locationdesc,
          [source1]: point.value 
        });
      }
    });
    
    source2Data.forEach((point: any) => {
      if (point.locationdesc && comparisonMap.has(point.locationdesc)) {
        const existing = comparisonMap.get(point.locationdesc);
        existing[source2] = point.value;
        existing.difference = parseFloat((existing[source1] - point.value).toFixed(2));
        existing.percentDifference = parseFloat((((existing[source1] - point.value) / point.value) * 100).toFixed(2));
      }
    });
    
    return Array.from(comparisonMap.values());
  }
  
  private generateProjection(timeSeriesData: any[], months: number) {
    if (!timeSeriesData || timeSeriesData.length < 2) return [];
    
    // Get the last few data points for the projection
    const recentData = timeSeriesData.slice(-12);
    
    // Calculate average monthly change
    let totalChange = 0;
    for (let i = 1; i < recentData.length; i++) {
      totalChange += recentData[i].value - recentData[i - 1].value;
    }
    const avgMonthlyChange = totalChange / (recentData.length - 1);
    
    // Generate projection data
    const projections = [];
    const lastDataPoint = timeSeriesData[timeSeriesData.length - 1];
    const lastDate = new Date(lastDataPoint.date);
    let lastValue = lastDataPoint.value;
    
    for (let i = 1; i <= months; i++) {
      const projectedDate = new Date(lastDate);
      projectedDate.setMonth(lastDate.getMonth() + i);
      
      // Add some randomness to the projection
      const randomFactor = 1 + ((Math.random() - 0.5) * 0.05); // ±2.5% random variation
      lastValue = lastValue + (avgMonthlyChange * randomFactor);
      
      projections.push({
        id: `projection-${i}`,
        date: projectedDate.toISOString().split('T')[0],
        value: parseFloat(lastValue.toFixed(2)),
        isProjected: true
      });
    }
    
    // Return original data + projections
    return [...timeSeriesData, ...projections];
  }
  
  private generateRegionalProjections(regionalData: any[]) {
    if (!regionalData || regionalData.length === 0) return {};
    
    // Group by region
    const regionGroups: Record<string, any[]> = {};
    regionalData.forEach(dataPoint => {
      const region = dataPoint.state || dataPoint.locationdesc;
      if (region) {
        if (!regionGroups[region]) {
          regionGroups[region] = [];
        }
        regionGroups[region].push(dataPoint);
      }
    });
    
    // Generate projection for each region
    const projections: Record<string, any> = {};
    
    Object.entries(regionGroups).forEach(([region, dataPoints]) => {
      // Simple projection: current value + random trend between -2% and +5%
      const currentValue = dataPoints[0].value;
      const trendFactor = 1 + ((Math.random() * 0.07) - 0.02); // Between -2% and +5%
      
      projections[region] = {
        currentValue,
        projectedValue: parseFloat((currentValue * trendFactor).toFixed(2)),
        percentChange: parseFloat(((trendFactor - 1) * 100).toFixed(2))
      };
    });
    
    return projections;
  }
}
