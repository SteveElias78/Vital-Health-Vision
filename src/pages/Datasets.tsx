
import React from 'react';
import { Search, Filter, Download, FileText } from 'lucide-react';
import { 
  ArtDecoCard, 
  ArtDecoCardHeader, 
  ArtDecoButton, 
  ArtDecoInput,
  ArtDecoDivider,
  ArtDecoPageHeader,
  ArtDecoBadge
} from '@/components/artdeco/ArtDecoStyles';

const Datasets = () => {
  // Sample dataset data
  const datasets = [
    {
      id: 'covid',
      title: 'COVID-19 Cases and Mortality',
      description: 'National data on COVID-19 cases, deaths, and recovery rates',
      source: 'CDC',
      lastUpdated: 'May 1, 2025',
      records: '1.2M'
    },
    {
      id: 'diabetes',
      title: 'Diabetes Prevalence',
      description: 'State-level diabetes prevalence by demographics',
      source: 'NIH',
      lastUpdated: 'April 15, 2025',
      records: '452K'
    },
    {
      id: 'heart',
      title: 'Heart Disease Risk Factors',
      description: 'Analysis of risk factors correlated with heart disease',
      source: 'American Heart Association',
      lastUpdated: 'March 28, 2025',
      records: '789K'
    },
    {
      id: 'obesity',
      title: 'Obesity Trends',
      description: 'Historical data on obesity rates across demographics',
      source: 'CDC',
      lastUpdated: 'April 22, 2025',
      records: '845K'
    },
    {
      id: 'vaccines',
      title: 'Vaccine Coverage',
      description: 'Geographic and demographic breakdowns of vaccine coverage',
      source: 'WHO',
      lastUpdated: 'May 2, 2025',
      records: '1.5M'
    },
    {
      id: 'env',
      title: 'Environmental Health Indicators',
      description: 'Air quality, water safety, and other environmental factors',
      source: 'EPA',
      lastUpdated: 'April 10, 2025',
      records: '678K'
    }
  ];
  
  const handleAnalyzeDataset = (datasetId: string) => {
    console.log(`Analyzing dataset: ${datasetId}`);
    // In real application, this would navigate to analysis page or open analysis modal
  };
  
  return (
    <div className="container px-6 max-w-7xl mx-auto py-8 space-y-6">
      {/* Page Header */}
      <ArtDecoPageHeader
        title={<>Explore and analyze <span className="font-medium">public health datasets</span></>}
        subtitle="Access comprehensive health data from verified government and research sources"
      />
      
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <ArtDecoInput
          type="text"
          placeholder="Search datasets..."
          leftIcon={<Search className="h-4 w-4 text-gold-400/50" />}
          className="w-full sm:w-auto flex-grow"
        />
        
        <div className="flex space-x-2">
          <ArtDecoButton leftIcon={<Filter className="h-4 w-4" />}>
            Filter
          </ArtDecoButton>
          
          <ArtDecoButton leftIcon={<Download className="h-4 w-4" />}>
            Download
          </ArtDecoButton>
        </div>
      </div>
      
      {/* Dataset Categories */}
      <div className="flex space-x-2 overflow-x-auto border-b border-gold-500/20 pb-2">
        <ArtDecoButton primary className="px-4 py-2 rounded-md">Datasets</ArtDecoButton>
        <button className="px-4 py-2 text-gold-300 hover:text-gold-400">Visualizations</button>
        <button className="px-4 py-2 text-gold-300 hover:text-gold-400">Analytics</button>
      </div>
      
      {/* Datasets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {datasets.map((dataset) => (
          <ArtDecoCard key={dataset.id}>
            <ArtDecoCardHeader
              title={dataset.title}
              description={dataset.description}
            />
            
            <div className="p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gold-300/70 text-sm">Source:</span>
                <span className="text-gold-300 text-sm">{dataset.source}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gold-300/70 text-sm">Last Updated:</span>
                <span className="text-gold-300 text-sm">{dataset.lastUpdated}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gold-300/70 text-sm">Records:</span>
                <span className="text-gold-300 text-sm">{dataset.records}</span>
              </div>
            </div>
            
            <div className="p-4 border-t border-gold-500/20">
              <ArtDecoButton 
                onClick={() => handleAnalyzeDataset(dataset.id)}
                className="w-full"
                leftIcon={<FileText className="h-4 w-4" />}
              >
                Analyze Dataset
              </ArtDecoButton>
            </div>
          </ArtDecoCard>
        ))}
      </div>
      
      {/* Decorative Footer */}
      <ArtDecoDivider centered />
    </div>
  );
};

export default Datasets;
