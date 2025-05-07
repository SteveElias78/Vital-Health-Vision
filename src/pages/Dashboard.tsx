
import React from 'react';
import { ArtDecoRadialChart } from '@/components/artdeco/ArtDecoRadialChart';
import { ArtDecoStatsCard } from '@/components/artdeco/ArtDecoStatsCard';
import { ArrowUpRight } from 'lucide-react';
import { Navbar } from '@/components/Navbar';

const Dashboard = () => {
  // Sample data for visualizations
  const healthData = [
    { name: '18-34', value: 31.5, color: '#FFC700' },
    { name: '35-49', value: 35.8, color: '#CCA000' },
    { name: '50-64', value: 38.2, color: '#33394F' },
    { name: '65+', value: 34.1, color: '#000723' }
  ];
  
  const statsCards = [
    { 
      title: 'Neural Networks', 
      value: '24', 
      status: 'neutral' as 'neutral',
      trendValue: 'ACTIVE'
    },
    { 
      title: 'Quantum Analysis', 
      value: '99.8', 
      unit: '%',
      status: 'positive' as 'positive',
      trendValue: 'OPTIMAL'
    },
    { 
      title: 'Predictive Score', 
      value: 'A+', 
      trend: 'up' as 'up',
      trendValue: '+2.4%',
      status: 'positive' as 'positive'
    },
    { 
      title: 'Global Reach', 
      value: '192', 
      status: 'neutral' as 'neutral',
      trendValue: 'NATIONS'
    }
  ];
  
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-midnight-900 to-midnight-950">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container px-6 max-w-7xl mx-auto space-y-6">
          {/* Page Header */}
          <div className="border-b border-gold-500/30 pb-4">
            <h1 className="text-3xl font-light text-gold-400">
              Health Data <span className="font-medium">Analytics</span>
            </h1>
            <p className="mt-2 text-gold-300/70">
              Exploring public health trends and demographic analysis
            </p>
          </div>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statsCards.map((card, index) => (
              <ArtDecoStatsCard 
                key={index}
                title={card.title}
                value={card.value}
                trend={card.trend}
                trendValue={card.trendValue}
                status={card.status}
                unit={card.unit}
              />
            ))}
          </div>
          
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Radial Visualization */}
            <div className="lg:col-span-1">
              <div className="border border-gold-500/30 rounded-lg overflow-hidden bg-gradient-to-br from-midnight-900 to-midnight-950 h-full">
                <div className="bg-gradient-to-r from-midnight-800 to-midnight-900 border-b border-gold-500/30 p-4">
                  <h2 className="text-xl font-light text-gold-400">
                    Obesity Prevalence by Age Group
                  </h2>
                  <p className="text-sm text-gold-300/70">
                    Demographics breakdown by age categories
                  </p>
                </div>
                <div className="p-4 flex justify-center">
                  <ArtDecoRadialChart 
                    data={healthData}
                    width={400}
                    height={400}
                    centerLabel="Average: 34.9%"
                  />
                </div>
              </div>
            </div>
            
            {/* Data Source Reliability Card */}
            <div className="lg:col-span-1">
              <div className="border border-gold-500/30 rounded-lg overflow-hidden bg-gradient-to-br from-midnight-900 to-midnight-950 h-full">
                <div className="bg-gradient-to-r from-midnight-800 to-midnight-900 border-b border-gold-500/30 p-4">
                  <h2 className="text-xl font-light text-gold-400">
                    Data Source Reliability
                  </h2>
                  <p className="text-sm text-gold-300/70">
                    Transparency in health data integrity
                  </p>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between">
                        <span className="text-gold-300">NHANES</span>
                        <span className="text-green-400">95%</span>
                      </div>
                      <div className="mt-1 h-2 w-full rounded-full bg-midnight-800">
                        <div className="h-2 rounded-full bg-gradient-to-r from-gold-400 to-green-400" style={{ width: '95%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between">
                        <span className="text-gold-300">BRFSS</span>
                        <span className="text-green-400">90%</span>
                      </div>
                      <div className="mt-1 h-2 w-full rounded-full bg-midnight-800">
                        <div className="h-2 rounded-full bg-gradient-to-r from-gold-400 to-green-400" style={{ width: '90%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between">
                        <span className="text-gold-300">WHO</span>
                        <span className="text-green-400">93%</span>
                      </div>
                      <div className="mt-1 h-2 w-full rounded-full bg-midnight-800">
                        <div className="h-2 rounded-full bg-gradient-to-r from-gold-400 to-green-400" style={{ width: '93%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between">
                        <span className="text-gold-300">Alternative Sources</span>
                        <span className="text-yellow-400">75%</span>
                      </div>
                      <div className="mt-1 h-2 w-full rounded-full bg-midnight-800">
                        <div className="h-2 rounded-full bg-gradient-to-r from-gold-400 to-yellow-400" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-gold-500/30 to-transparent"></div>
                  
                  <div className="rounded-md bg-midnight-800 p-4 text-sm text-gold-300/70">
                    <p>Data reliability scores are calculated based on sample size, methodology, and cross-validation across sources.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Features Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-light text-gold-400 mb-6 text-center">
              Data Science <span className="font-medium">& Analysis Methods</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-midnight-800 border border-gold-500/20 rounded-lg p-6">
                <div className="flex justify-center items-center mb-4">
                  <div className="w-16 h-16 rounded-full border border-gold-500/50 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-gold-500/20"></div>
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gold-400 text-center mb-2">Data Visualization</h3>
                <p className="text-gold-300/70 text-center">
                  Interactive charts, maps, and dashboards for exploring health data across demographics, time periods, and geographic regions.
                </p>
              </div>
              
              <div className="bg-midnight-800 border border-gold-500/20 rounded-lg p-6">
                <div className="flex justify-center items-center mb-4">
                  <div className="w-16 h-16 rounded-full border border-gold-500/50 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-gold-500/20"></div>
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gold-400 text-center mb-2">Statistical Analysis</h3>
                <p className="text-gold-300/70 text-center">
                  Comprehensive statistical tools for correlation analysis, trend identification, and pattern recognition in health datasets.
                </p>
              </div>
              
              <div className="bg-midnight-800 border border-gold-500/20 rounded-lg p-6">
                <div className="flex justify-center items-center mb-4">
                  <div className="w-16 h-16 rounded-full border border-gold-500/50 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-gold-500/20"></div>
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gold-400 text-center mb-2">Predictive Models</h3>
                <p className="text-gold-300/70 text-center">
                  Machine learning models that forecast health outcomes based on historical trends and demographic factors.
                </p>
              </div>
            </div>
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
      </main>
      
      <footer className="py-6 border-t border-gold-500/20">
        <div className="container px-4 text-center text-sm text-gold-300/70">
          © 2025 Vital Health Vision. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
