
import React from 'react';
import {
  StatsOverview,
  getDefaultStats,
  DataSourceReliability,
  FeaturesSection,
  HealthDataVisualization,
  getDefaultHealthData,
  DashboardHeader,
  DashboardFooter
} from '@/components/dashboard';
import { ArtDecoRadialChart } from '@/components/artdeco/ArtDecoRadialChart';

const Dashboard = () => {
  const healthData = getDefaultHealthData();
  const statsCards = getDefaultStats();
  
  // Convert health data format for the ArtDecoRadialChart
  const radialChartData = healthData.map(item => ({
    category: item.name,
    value: item.value,
    color: item.color
  }));
  
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-midnight-900 to-midnight-950">
      <main className="flex-1 py-8">
        <div className="container px-6 max-w-7xl mx-auto space-y-6">
          {/* Page Header */}
          <DashboardHeader 
            title="Health Data Analytics"
            subtitle="Exploring public health trends and demographic analysis"
          />
          
          {/* Stats Overview */}
          <StatsOverview stats={statsCards} />
          
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Radial Visualization */}
            <div className="lg:col-span-1 bg-midnight-900 border border-gold-500/30 rounded-lg overflow-hidden">
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
                  data={radialChartData}
                  centerValue={34.9}
                  centerText="Average"
                  unit="%"
                />
              </div>
              <div className="pb-4 text-xs text-gold-300/70 text-center">
                Source: NHANES • Updated May 2025
              </div>
            </div>
            
            {/* Data Source Reliability Card */}
            <div className="lg:col-span-1">
              <DataSourceReliability />
            </div>
          </div>
          
          {/* Features Section */}
          <FeaturesSection />
          
          {/* Decorative Footer */}
          <DashboardFooter />
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
