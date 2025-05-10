
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArtDecoPageHeader } from '@/components/artdeco/ArtDecoPageHeader';
import { DemoModeIndicator } from '@/components/demo/DemoModeIndicator';
import { useAuth } from '@/hooks/useAuth';
import { VitalHealthDashboard } from '@/components/vital-health-dashboard/VitalHealthDashboard';
import { Filter, Download, Info } from 'lucide-react';

export default function HealthMetrics() {
  const [metricType, setMetricType] = useState<string>('overview');
  const { isDemo } = useAuth();
  
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <ArtDecoPageHeader 
          title="Health Metrics Dashboard" 
          subtitle="Comprehensive analysis of public health indicators" 
        />
        {isDemo && <DemoModeIndicator />}
      </div>

      <Card className="art-deco-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-gold-400">
            Health Metrics Analysis
          </CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex gap-1 items-center">
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
            </Button>
            <Button variant="outline" size="sm" className="flex gap-1 items-center">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={metricType} onValueChange={setMetricType} className="space-y-4">
            <TabsList className="art-deco-tabs">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="comparisons">Comparisons</TabsTrigger>
              <TabsTrigger value="predictions">Predictions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <VitalHealthDashboard />
            </TabsContent>
            
            <TabsContent value="trends">
              <div className="p-6 bg-midnight-900/50 border border-gold-500/30 rounded-lg text-center">
                <Info className="w-10 h-10 text-gold-400 mx-auto mb-2" />
                <h3 className="text-gold-400 text-lg mb-2">Trends Analysis</h3>
                <p className="text-gold-300/70 max-w-md mx-auto">
                  The trends analysis view allows you to explore temporal patterns in health metrics
                  across multiple years and identify seasonal variations.
                </p>
                <Button className="mt-4">Explore Trends</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="comparisons">
              <div className="p-6 bg-midnight-900/50 border border-gold-500/30 rounded-lg text-center">
                <Info className="w-10 h-10 text-gold-400 mx-auto mb-2" />
                <h3 className="text-gold-400 text-lg mb-2">Comparative Analysis</h3>
                <p className="text-gold-300/70 max-w-md mx-auto">
                  Compare health metrics across different regions, demographics, or time periods
                  to identify disparities and opportunities for targeted interventions.
                </p>
                <Button className="mt-4">Start Comparison</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="predictions">
              <div className="p-6 bg-midnight-900/50 border border-gold-500/30 rounded-lg text-center">
                <Info className="w-10 h-10 text-gold-400 mx-auto mb-2" />
                <h3 className="text-gold-400 text-lg mb-2">Predictive Modeling</h3>
                <p className="text-gold-300/70 max-w-md mx-auto">
                  Leverage machine learning algorithms to project future health trends and
                  evaluate the potential impact of different intervention strategies.
                </p>
                <Button className="mt-4">Generate Predictions</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="art-deco-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-gold-400">
              Health Metrics Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-midnight-900/50 border border-gold-500/30 rounded-lg">
                <h3 className="text-gold-400 mb-2">Key Findings</h3>
                <ul className="space-y-2 text-gold-300">
                  <li>• <strong>Obesity Patterns:</strong> Southern states show 23% higher obesity rates compared to western states with strong correlation to socioeconomic factors.</li>
                  <li>• <strong>Mental Health Trends:</strong> Urban areas report higher rates of mental health conditions with 22% seasonal variation peaking in winter months.</li>
                  <li>• <strong>Healthcare Disparities:</strong> Significant geographic variation in healthcare access, with up to 31% difference between highest and lowest regions.</li>
                </ul>
              </div>
              
              <div className="p-4 bg-midnight-900/50 border border-gold-500/30 rounded-lg">
                <h3 className="text-gold-400 mb-2">Recommendations</h3>
                <ul className="space-y-2 text-gold-300">
                  <li>• <strong>Targeted Interventions:</strong> Allocate resources to regions with persistently poor health outcomes.</li>
                  <li>• <strong>Seasonal Planning:</strong> Increase mental health resource allocation during peak seasonal periods.</li>
                  <li>• <strong>Demographic Focus:</strong> Develop specialized programs for most affected demographic groups.</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="art-deco-border">
          <CardHeader>
            <CardTitle className="text-gold-400">
              Data Quality Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gold-300">CDC Data</span>
                    <span className="text-sm text-gold-300/70">95%</span>
                  </div>
                  <div className="w-full bg-midnight-800 rounded-full h-2">
                    <div className="bg-gold-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gold-300">BRFSS Data</span>
                    <span className="text-sm text-gold-300/70">87%</span>
                  </div>
                  <div className="w-full bg-midnight-800 rounded-full h-2">
                    <div className="bg-gold-600 h-2 rounded-full" style={{ width: '87%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gold-300">NHANES Data</span>
                    <span className="text-sm text-gold-300/70">91%</span>
                  </div>
                  <div className="w-full bg-midnight-800 rounded-full h-2">
                    <div className="bg-gold-600 h-2 rounded-full" style={{ width: '91%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gold-300">WHO Data</span>
                    <span className="text-sm text-gold-300/70">92%</span>
                  </div>
                  <div className="w-full bg-midnight-800 rounded-full h-2">
                    <div className="bg-gold-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-gold-300/70 p-3 bg-midnight-900/50 border border-gold-500/20 rounded">
                <p>Data quality is assessed based on completeness, reliability, documentation quality, and validation against multiple sources.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
