
import React from 'react';
import { RadialHealthVisualizer } from '@/components/visualizations';
import { ClaudeAIInsights } from '@/components/ai-insights';
import { DataSourceReliability } from './DataSourceReliability';
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { DashboardCard } from "@/components/DashboardCard";
import { Info, Download, Settings, BarChart3, PieChart } from "lucide-react";

export const UnifiedDashboard: React.FC = () => {
  // Sample data for visualizations
  const sampleData = [
    { category: '18-34', value: 31.5 },
    { category: '35-49', value: 35.8 },
    { category: '50-64', value: 38.2 },
    { category: '65+', value: 34.1 }
  ];

  return (
    <div className="space-y-6">
      {/* Header section with gold accents */}
      <div className="border-b border-gold-500/30 pb-4 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-light text-gold-400">
            Health <span className="font-medium">Analytics</span> Dashboard
          </h1>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-1" /> Settings
            </Button>
            <Button variant="default" size="sm">
              <Download className="w-4 h-4 mr-1" /> Export
            </Button>
          </div>
        </div>
        <p className="mt-2 text-gold-300/70">
          Exploring public health trends with advanced data visualization
        </p>
      </div>

      {/* Main visualizations grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Primary visualization - spans 2 columns */}
        <DashboardCard 
          title="Demographic Health Analysis"
          description="Age-based population health metrics"
          className="lg:col-span-2 art-deco-border-animate"
          footer={
            <div className="flex justify-between items-center w-full">
              <span className="text-xs text-gold-300/70">Updated: May 2025</span>
              <Button variant="outline" size="sm" className="ml-auto">
                <PieChart className="w-4 h-4 mr-1" /> View Details
              </Button>
            </div>
          }
        >
          <div className="h-80">
            <RadialHealthVisualizer />
          </div>
        </DashboardCard>

        {/* Claude AI insights panel */}
        <DashboardCard
          title="AI Health Analysis"
          description="Claude's interpretation of the data"
        >
          <ClaudeAIInsights 
            data={sampleData}
            dataSource="NHANES 2023"
            metric="obesity" 
          />
        </DashboardCard>

        {/* Decorative separator with art deco styling */}
        <div className="lg:col-span-3 flex items-center justify-center my-4">
          <div className="art-deco-separator">
            <span className="art-deco-diamond"></span>
            <span className="art-deco-diamond"></span>
            <span className="art-deco-diamond"></span>
          </div>
        </div>

        {/* Secondary visualizations row */}
        <DashboardCard
          title="Data Source Reliability"
          description="Evaluation of source data quality"
        >
          <DataSourceReliability />
        </DashboardCard>

        <DashboardCard
          title="Geographic Distribution"
          description="Regional health variance analysis"
          className="lg:col-span-2"
        >
          <div className="flex items-center justify-center h-64 bg-midnight-900/50 border border-gold-500/20 rounded">
            <div className="text-center">
              <div className="art-deco-circle w-16 h-16 mx-auto flex items-center justify-center mb-4">
                <BarChart3 className="w-8 h-8 text-gold-400/80" />
              </div>
              <h3 className="text-gold-400 mb-2">Geographic Visualization</h3>
              <p className="text-gold-300/70 text-sm max-w-md">
                Interactive map visualization of health metrics across different regions
              </p>
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* Info panel with art deco styling */}
      <div className="mt-8 p-5 border border-gold-500/30 rounded-md bg-gradient-to-br from-midnight-900 to-midnight-950">
        <div className="flex items-start">
          <div className="art-deco-circle flex-shrink-0 w-10 h-10 flex items-center justify-center mr-4">
            <Info className="w-5 h-5 text-gold-400" />
          </div>
          <div>
            <h3 className="text-gold-400 mb-1 text-lg font-light">About This Dashboard</h3>
            <p className="text-gold-300/70 text-sm">
              This dashboard visualizes comprehensive health metrics using Art Deco styled visualizations. 
              Data is sourced from multiple verified health databases including NHANES, BRFSS, and the WHO.
              Interactive elements allow for detailed exploration of demographic trends.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
