
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

const Dashboard = () => {
  const healthData = getDefaultHealthData();
  const statsCards = getDefaultStats();
  
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
            <div className="lg:col-span-1">
              <HealthDataVisualization 
                data={healthData}
                title="Obesity Prevalence by Age Group"
                subtitle="Demographics breakdown by age categories"
                centerLabel="Average: 34.9%"
              />
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
