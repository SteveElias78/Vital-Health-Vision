
import React from 'react';
import { ArtDecoDatasetCard } from '@/components/artdeco/ArtDecoDatasetCard';
import { Search, Filter, Download } from 'lucide-react';

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
      <div className="border-b border-gold-500/30 pb-4">
        <h1 className="text-3xl font-light text-gold-400">
          Explore and analyze <span className="font-medium">public health datasets</span>
        </h1>
        <p className="mt-2 text-gold-300/70">
          Access comprehensive health data from verified government and research sources
        </p>
      </div>
      
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative w-full sm:w-auto flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gold-400/50" />
          </div>
          <input
            type="text"
            placeholder="Search datasets..."
            className="bg-midnight-800 border border-gold-500/30 text-gold-50 rounded-md pl-10 pr-4 py-2 w-full focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-500"
          />
        </div>
        
        <div className="flex space-x-2">
          <button className="flex items-center space-x-2 bg-midnight-800 text-gold-400 border border-gold-500/30 px-4 py-2 rounded hover:bg-midnight-700">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
          
          <button className="flex items-center space-x-2 bg-midnight-800 text-gold-400 border border-gold-500/30 px-4 py-2 rounded hover:bg-midnight-700">
            <Download className="h-4 w-4" />
            <span>Download</span>
          </button>
        </div>
      </div>
      
      {/* Dataset Categories */}
      <div className="flex space-x-2 overflow-x-auto border-b border-gold-500/20 pb-2">
        <button className="px-4 py-2 bg-midnight-800 text-gold-400 rounded-md">Datasets</button>
        <button className="px-4 py-2 text-gold-300 hover:text-gold-400">Visualizations</button>
        <button className="px-4 py-2 text-gold-300 hover:text-gold-400">Analytics</button>
      </div>
      
      {/* Datasets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {datasets.map((dataset) => (
          <ArtDecoDatasetCard
            key={dataset.id}
            title={dataset.title}
            description={dataset.description}
            source={dataset.source}
            lastUpdated={dataset.lastUpdated}
            records={dataset.records}
            onAnalyze={() => handleAnalyzeDataset(dataset.id)}
          />
        ))}
      </div>
      
      {/* Decorative Footer */}
      <div className="mt-8 flex justify-center items-center">
        <div className="h-px w-24 bg-gradient-to-r from-transparent via-gold-500/30 to-transparent"></div>
        <div className="mx-4 w-8 h-8 rounded-full border border-gold-500/50 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-gold-500/20"></div>
        </div>
        <div className="h-px w-24 bg-gradient-to-r from-transparent via-gold-500/30 to-transparent"></div>
      </div>
    </div>
  );
};

export default Datasets;
