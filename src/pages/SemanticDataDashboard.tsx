
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout';
import { ArtDecoPageHeader } from '@/components/artdeco/ArtDecoPageHeader';
import { ArtDecoStatsCard } from '@/components/artdeco/ArtDecoStatsCard';
import { ArtDecoGradientDivider } from '@/components/artdeco/ArtDecoGradientDivider';
import { NetworkGraphVisualization, generateNetworkData } from '@/components/visualizations/NetworkGraphVisualization';
import { PredictiveTrendsChart, generatePredictiveData } from '@/components/predictive/PredictiveTrendsChart';
import { DataSourceTransparency, generateDataSources } from '@/components/governance/DataSourceTransparency';
import { SemanticDataFusionService } from '@/data/fusion/SemanticDataFusionService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SemanticDataDashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState('obesity');
  const [loading, setLoading] = useState(false);
  const [semanticData, setSemanticData] = useState<any>(null);
  
  // Initialize the semantic fusion service
  const dataFusionService = new SemanticDataFusionService();
  
  // Generate sample data for demonstration
  const networkData = generateNetworkData();
  const predictiveData = generatePredictiveData();
  const dataSources = generateDataSources();
  
  // Fetch data when category changes
  useEffect(() => {
    const fetchSemanticData = async () => {
      setLoading(true);
      try {
        const result = await dataFusionService.getHarmonizedData(selectedCategory, {
          includeAlternatives: true,
          enhancedSemantic: true
        });
        setSemanticData(result);
      } catch (error) {
        console.error('Error fetching semantic health data:', error);
        // Handle error state
      } finally {
        setLoading(false);
      }
    };
    
    fetchSemanticData();
  }, [selectedCategory]);
  
  // Summary statistics
  const summaryStats = [
    { 
      title: 'Data Sources', 
      value: '5', 
      status: 'neutral', 
      trendValue: 'INTEGRATED'
    },
    { 
      title: 'Confidence Score', 
      value: '92.4', 
      unit: '%',
      status: 'positive',
      trendValue: 'VERIFIED'
    },
    { 
      title: 'Anomalies', 
      value: '2', 
      status: 'negative',
      trendValue: 'DETECTED'
    },
    { 
      title: 'Predictions', 
      value: '18', 
      trend: 'up',
      trendValue: 'FORECASTED',
      status: 'positive'
    }
  ];
  
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8 space-y-6">
        <ArtDecoPageHeader 
          title="Semantic Health Intelligence"
          description="Advanced data fusion and predictive analytics for health metrics"
        />
        
        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {summaryStats.map((stat, index) => (
            <ArtDecoStatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              unit={stat.unit}
              status={stat.status}
              trendValue={stat.trendValue}
              trend={stat.trend}
            />
          ))}
        </div>
        
        <ArtDecoGradientDivider className="my-8" />
        
        {/* Main Dashboard Content */}
        <Tabs defaultValue="insights" className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="insights">Health Insights</TabsTrigger>
            <TabsTrigger value="predictions">Predictive Analysis</TabsTrigger>
            <TabsTrigger value="relationships">Health Relationships</TabsTrigger>
            <TabsTrigger value="governance">Data Governance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <PredictiveTrendsChart
                  title="Obesity Trends Analysis"
                  subtitle="Historical data with 6-month forecast"
                  data={predictiveData}
                  metricName="Obesity Rate"
                />
              </div>
              
              <div className="md:col-span-1">
                <ArtDecoStatsCard
                  title="Key Insight"
                  value="32.5%"
                  status="negative"
                  trendValue="+2.8% YOY"
                  trend="up"
                />
                
                <div className="mt-4 bg-midnight-900 border border-gold-500/30 rounded-lg p-4">
                  <h3 className="text-gold-400 text-lg font-medium mb-2">AI Analysis</h3>
                  <p className="text-gold-300/70 text-sm">
                    Obesity rates show consistent growth with seasonal variations.
                    Regional analysis indicates higher growth in southern states,
                    particularly in areas with limited access to fresh food options.
                  </p>
                  <div className="mt-4">
                    <h4 className="text-gold-400 text-sm font-medium">Correlating Factors:</h4>
                    <ul className="mt-1 space-y-1 text-xs text-gold-300/70">
                      <li>• Socioeconomic status (r=0.74)</li>
                      <li>• Food desert proximity (r=0.68)</li>
                      <li>• Exercise frequency (r=-0.82)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="predictions" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <PredictiveTrendsChart
                title="Health Metrics Forecast"
                subtitle="12-month predictive analysis with confidence intervals"
                data={generatePredictiveData(24, 12)}
                metricName="Diabetes Rate"
                xAxisLabel="Month"
                yAxisLabel="Prevalence (%)"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="relationships" className="space-y-6">
            <NetworkGraphVisualization
              title="Health Condition Relationships"
              subtitle="Network analysis of condition co-occurrences and relationships"
              nodes={networkData.nodes}
              links={networkData.links}
              width={900}
              height={500}
            />
          </TabsContent>
          
          <TabsContent value="governance" className="space-y-6">
            <DataSourceTransparency
              dataSources={dataSources}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SemanticDataDashboard;
