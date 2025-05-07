
import React, { useState } from 'react';
import { Navbar } from "@/components/Navbar";
import { ArtDecoDatasetCard } from '@/components/artdeco';
import { Search, Filter, Download } from 'lucide-react';
import { toast } from 'sonner';

const DatasetExplorer = () => {
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
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('datasets');
  
  const handleAnalyzeDataset = (datasetId: string) => {
    console.log(`Analyzing dataset: ${datasetId}`);
    toast.success(`Starting analysis for ${datasets.find(d => d.id === datasetId)?.title}`);
    // In real application, this would navigate to analysis page or open analysis modal
  };

  const filteredDatasets = datasets.filter(dataset => 
    dataset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dataset.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dataset.source.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-midnight-900 to-midnight-950">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container px-6 max-w-7xl mx-auto space-y-6">
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
          <div className="flex space-x-2 border-b border-gold-500/20 pb-2">
            <button 
              className={`px-4 py-2 rounded-md ${activeTab === 'datasets' ? 'bg-midnight-800 text-gold-400' : 'text-gold-300 hover:text-gold-400'}`}
              onClick={() => setActiveTab('datasets')}
            >
              Datasets
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${activeTab === 'visualizations' ? 'bg-midnight-800 text-gold-400' : 'text-gold-300 hover:text-gold-400'}`}
              onClick={() => setActiveTab('visualizations')}
            >
              Visualizations
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${activeTab === 'analytics' ? 'bg-midnight-800 text-gold-400' : 'text-gold-300 hover:text-gold-400'}`}
              onClick={() => setActiveTab('analytics')}
            >
              Analytics
            </button>
          </div>
          
          {activeTab === 'datasets' && (
            <>
              {/* Datasets Grid */}
              {filteredDatasets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDatasets.map((dataset) => (
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
              ) : (
                <div className="text-center py-12 border border-gold-500/30 rounded-lg bg-midnight-900/50">
                  <p className="text-gold-300">No datasets found matching your search criteria.</p>
                </div>
              )}
            </>
          )}
          
          {activeTab === 'visualizations' && (
            <div className="text-center py-12 border border-gold-500/30 rounded-lg bg-midnight-900/50">
              <h3 className="text-xl text-gold-400 mb-2">Visualizations</h3>
              <p className="text-gold-300">Explore interactive visualizations of our health datasets.</p>
              <p className="text-gold-300/70 mt-2">This feature is coming soon.</p>
            </div>
          )}
          
          {activeTab === 'analytics' && (
            <div className="text-center py-12 border border-gold-500/30 rounded-lg bg-midnight-900/50">
              <h3 className="text-xl text-gold-400 mb-2">Analytics</h3>
              <p className="text-gold-300">Run advanced analytics on health datasets.</p>
              <p className="text-gold-300/70 mt-2">This feature is coming soon.</p>
            </div>
          )}
          
          {/* Decorative Footer */}
          <div className="mt-8 flex justify-center items-center">
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-gold-500/30 to-transparent"></div>
            <div className="mx-4 w-8 h-8 rounded-full border border-gold-500/50 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-gold-500/20"></div>
            </div>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-gold-500/30 to-transparent"></div>
          </div>
        </div>
      </main>
      
      <footer className="py-6 border-t border-gold-500/20">
        <div className="container px-4 text-center text-sm text-gold-300/70">
          © 2025 Vital Health Vision. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default DatasetExplorer;
