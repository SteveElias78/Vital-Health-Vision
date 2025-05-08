
import React, { useState } from 'react';
import { AppLayoutWrapper } from '@/components/layout';
import { ArtDecoCard } from '@/components/artdeco/ArtDecoCard';
import { ArtDecoButton } from '@/components/artdeco/ArtDecoButton';
import { ArtDecoGradientDivider } from '@/components/artdeco/ArtDecoGradientDivider';
import { ArtDecoStatsCard } from '@/components/artdeco/ArtDecoStatsCard';
import { Search, Filter, Download, FileChartLine } from 'lucide-react';
import { FormDivider } from '@/components/decorative/FormDivider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArtDecoHealthVisualizer } from '@/components/visualizations/ArtDecoHealthVisualizer';

const Explore: React.FC = () => {
  const [activeTab, setActiveTab] = useState('datasets');

  return (
    <AppLayoutWrapper>
      <div className="container max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-light tracking-wider text-gold-400">Data Explorer</h1>
            <p className="text-gold-300/80">Explore and analyze public health datasets</p>
          </div>
          <div className="mt-4 flex items-center gap-3 md:mt-0">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-400" />
              <input
                type="text"
                placeholder="Search datasets..."
                className="art-deco-input pl-8"
              />
            </div>
            <ArtDecoButton variant="secondary" size="icon" aria-label="Filter">
              <Filter className="h-4 w-4" />
            </ArtDecoButton>
            <ArtDecoButton variant="secondary" size="icon" aria-label="Download">
              <Download className="h-4 w-4" />
            </ArtDecoButton>
          </div>
        </div>
        
        <Tabs defaultValue="datasets" className="mt-8">
          <TabsList className="mb-6 art-deco-tabs bg-midnight-800 border border-gold-500/30">
            <TabsTrigger value="datasets" className="data-[state=active]:bg-gold-500/20 data-[state=active]:text-gold-300">Datasets</TabsTrigger>
            <TabsTrigger value="visualizations" className="data-[state=active]:bg-gold-500/20 data-[state=active]:text-gold-300">Visualizations</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-gold-500/20 data-[state=active]:text-gold-300">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="datasets">
            <FormDivider pattern="diamonds" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {datasetsCards.map((dataset, index) => (
                <ArtDecoCard
                  key={index}
                  title={dataset.title}
                  subtitle={dataset.description}
                  animation="glow"
                  corners="decorated"
                  footer={
                    <ArtDecoButton className="w-full">
                      <FileChartLine className="mr-2 h-4 w-4" />
                      Analyze Dataset
                    </ArtDecoButton>
                  }
                >
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between text-sm text-gold-400/70">
                      <span>Source:</span>
                      <span className="font-medium">{dataset.source}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gold-400/70">
                      <span>Last Updated:</span>
                      <span className="font-medium">{dataset.updated}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gold-400/70">
                      <span>Records:</span>
                      <span className="font-medium">{dataset.records}</span>
                    </div>
                  </div>
                </ArtDecoCard>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="visualizations">
            <ArtDecoGradientDivider />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <ArtDecoHealthVisualizer title="Health Metrics Visualization" />
              
              <ArtDecoCard
                title="Create Custom Visualization"
                subtitle="Build your own visualizations with our Art Deco styled components"
                className="h-full flex flex-col"
              >
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                  <p className="text-gold-300/80 mb-6">Select datasets and visualization types to create custom charts and graphs.</p>
                  <ArtDecoButton variant="gradient">Create New Visualization</ArtDecoButton>
                </div>
              </ArtDecoCard>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics">
            <ArtDecoGradientDivider />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <ArtDecoStatsCard 
                title="Total Datasets"
                value="24"
                trend="up"
                trendValue="+3 this month"
                status="positive"
              />
              <ArtDecoStatsCard 
                title="Average Confidence"
                value="87"
                unit="%"
                trend="up"
                trendValue="+2.3%"
                status="positive"
              />
              <ArtDecoStatsCard 
                title="Data Points"
                value="1.4M"
                trend="up"
                trendValue="+120K"
                status="positive"
              />
              <ArtDecoStatsCard 
                title="Data Coverage"
                value="93"
                unit="%"
                trend="down"
                trendValue="-1.2%"
                status="negative"
              />
            </div>
            
            <ArtDecoCard
              title="Analytics Tools"
              subtitle="Access advanced analytics and statistical tools to analyze health data"
            >
              <div className="p-6 flex flex-col items-center justify-center text-center">
                <p className="text-gold-300/80 mb-6 max-w-lg mx-auto">
                  Our analytics tools provide advanced statistical analysis, predictive modeling, and data visualization capabilities to help you extract meaningful insights from health data.
                </p>
                <ArtDecoButton>Explore Analytics Tools</ArtDecoButton>
              </div>
            </ArtDecoCard>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayoutWrapper>
  );
};

// Sample data for the datasets cards
const datasetsCards = [
  {
    title: "COVID-19 Cases and Mortality",
    description: "National data on COVID-19 cases, deaths, and recovery rates",
    source: "CDC",
    updated: "May 1, 2025",
    records: "1.2M"
  },
  {
    title: "Diabetes Prevalence",
    description: "State-level diabetes prevalence by demographics",
    source: "NIH",
    updated: "April 15, 2025",
    records: "452K"
  },
  {
    title: "Heart Disease Risk Factors",
    description: "Analysis of risk factors correlated with heart disease",
    source: "American Heart Association",
    updated: "March 28, 2025",
    records: "789K"
  },
  {
    title: "Obesity Trends",
    description: "Historical data on obesity rates across demographics",
    source: "CDC",
    updated: "April 22, 2025",
    records: "845K"
  },
  {
    title: "Vaccine Coverage",
    description: "Geographic and demographic breakdowns of vaccine coverage",
    source: "WHO",
    updated: "May 2, 2025",
    records: "1.5M"
  },
  {
    title: "Environmental Health Indicators",
    description: "Air quality, water safety, and other environmental factors",
    source: "EPA",
    updated: "April 10, 2025",
    records: "678K"
  }
];

export default Explore;
