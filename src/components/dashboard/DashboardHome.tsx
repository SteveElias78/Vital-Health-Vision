import React from 'react';
import { ArrowUpRight, TrendingUp, Activity, Globe } from 'lucide-react';
import { StatsOverview, getDefaultStats } from './StatsOverview';
import { DataSourceReliability } from './DataSourceReliability';
import { FeaturesSection } from './FeaturesSection';
import { HealthDataVisualization, getDefaultHealthData, getDiabetesRegionalData } from './HealthDataVisualization';
import { DashboardHeader } from './DashboardHeader';
import { DashboardFooter } from './DashboardFooter';

export const DashboardHome: React.FC = () => {
  const obesityData = getDefaultHealthData();
  const diabetesData = getDiabetesRegionalData();
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
            {/* Obesity Visualization */}
            <div className="lg:col-span-1">
              <HealthDataVisualization 
                data={obesityData}
                title="Obesity Prevalence by Age Group"
                subtitle="Demographics breakdown by age categories"
                centerText="Average"
                centerValue={34.9}
                unit="%"
                source="NHANES"
                lastUpdated="May 2025"
              />
            </div>
            
            {/* Diabetes Visualization */}
            <div className="lg:col-span-1">
              <HealthDataVisualization 
                data={diabetesData}
                title="Diabetes Prevalence by Region"
                subtitle="Geographic distribution analysis"
                centerText="Average"
                centerValue={11.2}
                unit="%"
                source="CDC"
                lastUpdated="April 2025"
              />
            </div>
          </div>
          
          {/* Data Source Reliability */}
          <DataSourceReliability />
          
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
