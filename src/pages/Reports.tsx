
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, BarChart2 } from 'lucide-react';

const Reports = () => {
  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="border-b border-gold-500/30 pb-4">
        <h1 className="text-3xl font-light text-gold-400">
          Health <span className="font-medium">Reports</span>
        </h1>
        <p className="text-gold-300 mt-2">
          Generate comprehensive reports and export data for further analysis.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="art-deco-card border-gold-300">
          <div className="art-deco-card-header p-4">
            <h2 className="art-deco-title">Population Health Summary</h2>
          </div>
          <CardContent className="p-6">
            <div className="flex flex-col h-full">
              <p className="art-deco-subtitle mb-4">
                Overview of key population health metrics across demographics
              </p>
              <div className="flex items-center justify-center flex-1 my-6">
                <div className="art-deco-circle w-16 h-16 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-gold-400/80" />
                </div>
              </div>
              <Button className="art-deco-button mt-auto w-full">
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="art-deco-card border-gold-300">
          <div className="art-deco-card-header p-4">
            <h2 className="art-deco-title">Data Export Options</h2>
          </div>
          <CardContent className="p-6">
            <div className="flex flex-col h-full">
              <p className="art-deco-subtitle mb-4">
                Export health data in various formats for external analysis
              </p>
              <div className="flex items-center justify-center flex-1 my-6">
                <div className="art-deco-circle w-16 h-16 flex items-center justify-center">
                  <Download className="w-8 h-8 text-gold-400/80" />
                </div>
              </div>
              <Button className="art-deco-button mt-auto w-full">
                Export Data
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="art-deco-card border-gold-300">
          <div className="art-deco-card-header p-4">
            <h2 className="art-deco-title">Custom Analytics</h2>
          </div>
          <CardContent className="p-6">
            <div className="flex flex-col h-full">
              <p className="art-deco-subtitle mb-4">
                Build custom analytical reports with selected parameters
              </p>
              <div className="flex items-center justify-center flex-1 my-6">
                <div className="art-deco-circle w-16 h-16 flex items-center justify-center">
                  <BarChart2 className="w-8 h-8 text-gold-400/80" />
                </div>
              </div>
              <Button className="art-deco-button mt-auto w-full">
                Create Custom Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="art-deco-divider"></div>
      
      <Card className="art-deco-card border-gold-300">
        <div className="art-deco-card-header p-4">
          <h2 className="art-deco-title">Recent Reports</h2>
        </div>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 border-b border-gold-500/20">
              <div>
                <h3 className="text-gold-400">National Health Trends Q1 2025</h3>
                <p className="text-sm text-gold-300/70">Generated: April 2, 2025</p>
              </div>
              <Button variant="outline" className="border-gold-500/30 text-gold-400">
                View
              </Button>
            </div>
            
            <div className="flex justify-between items-center p-3 border-b border-gold-500/20">
              <div>
                <h3 className="text-gold-400">Demographic Health Disparities</h3>
                <p className="text-sm text-gold-300/70">Generated: March 28, 2025</p>
              </div>
              <Button variant="outline" className="border-gold-500/30 text-gold-400">
                View
              </Button>
            </div>
            
            <div className="flex justify-between items-center p-3 border-b border-gold-500/20">
              <div>
                <h3 className="text-gold-400">Regional Obesity Analysis</h3>
                <p className="text-sm text-gold-300/70">Generated: March 15, 2025</p>
              </div>
              <Button variant="outline" className="border-gold-500/30 text-gold-400">
                View
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
