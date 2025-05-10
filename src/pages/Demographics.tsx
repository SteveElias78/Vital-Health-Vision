
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DemographicsBreakdown } from '@/components/DemographicsBreakdown';
import { demographicsData, chartConfig } from '@/components/demographics/data';
import { DemographicDataPoint } from '@/components/demographics/types';
import { ArtDecoPageHeader } from '@/components/artdeco/ArtDecoPageHeader';
import { useAuth } from '@/hooks/useAuth';
import { DemoModeIndicator } from '@/components/demo/DemoModeIndicator';

export default function Demographics() {
  const [demographicCategory, setDemographicCategory] = useState<string>('age');
  const [viewMode, setViewMode] = useState<string>('percentage');
  const { isDemo } = useAuth();
  
  const renderBarChart = (data: DemographicDataPoint[], dataKey: string, name: string, fill: string) => {
    return (
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis 
            dataKey="age" 
            tick={{ fill: '#e4c389' }} 
            axisLine={{ stroke: '#e4c389', strokeWidth: 1 }}
            tickLine={{ stroke: '#e4c389' }}
            angle={-45}
            textAnchor="end"
            height={70}
          />
          <YAxis 
            tick={{ fill: '#e4c389' }} 
            axisLine={{ stroke: '#e4c389', strokeWidth: 1 }}
            tickLine={{ stroke: '#e4c389' }}
            unit={viewMode === 'percentage' ? '%' : ''}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#192339', 
              border: '1px solid #e4c389',
              color: '#e4c389'
            }} 
          />
          <Legend 
            wrapperStyle={{ color: '#e4c389', paddingTop: 20 }}
          />
          <Bar 
            dataKey={dataKey} 
            name={name} 
            fill={fill} 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <ArtDecoPageHeader 
          title="Demographics Analysis" 
          subtitle="Exploring health metrics across different population segments" 
        />
        {isDemo && <DemoModeIndicator />}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 art-deco-border">
          <CardHeader>
            <CardTitle className="text-gold-400">
              Health Metrics by Age Group
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="percentage" className="space-y-6" onValueChange={setViewMode}>
              <TabsList className="art-deco-tabs justify-start">
                <TabsTrigger value="percentage">Percentage</TabsTrigger>
                <TabsTrigger value="absolute">Absolute Numbers</TabsTrigger>
              </TabsList>
              
              <TabsContent value="percentage" className="space-y-6">
                <div className="flex flex-wrap gap-6">
                  <div className="w-full">
                    {renderBarChart(
                      demographicsData, 
                      'malePercent', 
                      'Male', 
                      chartConfig.male.theme.dark
                    )}
                  </div>
                  <div className="w-full">
                    {renderBarChart(
                      demographicsData, 
                      'femalePercent', 
                      'Female', 
                      chartConfig.female.theme.dark
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="absolute" className="space-y-6">
                <div className="flex flex-wrap gap-6">
                  <div className="w-full">
                    {renderBarChart(
                      demographicsData, 
                      'male', 
                      'Male', 
                      chartConfig.male.theme.dark
                    )}
                  </div>
                  <div className="w-full">
                    {renderBarChart(
                      demographicsData, 
                      'female', 
                      'Female', 
                      chartConfig.female.theme.dark
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card className="art-deco-border">
          <CardHeader>
            <CardTitle className="text-gold-400">
              Demographics Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DemographicsBreakdown />
          </CardContent>
        </Card>
      </div>

      <Card className="art-deco-border">
        <CardHeader>
          <CardTitle className="text-gold-400">
            Health Disparity Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-6 text-center">
            <p className="text-gold-300">
              Health disparities across demographic groups show significant variations. 
              Factors such as income level, education, geographic location, and age all 
              contribute to differences in health outcomes. The data highlights important 
              opportunities for targeted interventions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="border border-gold-500/30 p-4 rounded-lg">
                <h3 className="text-gold-400 text-lg font-medium mb-2">Access to Care</h3>
                <p className="text-gold-300/80 text-sm">32% variation in healthcare access across demographic groups</p>
              </div>
              <div className="border border-gold-500/30 p-4 rounded-lg">
                <h3 className="text-gold-400 text-lg font-medium mb-2">Health Outcomes</h3>
                <p className="text-gold-300/80 text-sm">28.5% difference in chronic disease prevalence based on socioeconomic factors</p>
              </div>
              <div className="border border-gold-500/30 p-4 rounded-lg">
                <h3 className="text-gold-400 text-lg font-medium mb-2">Preventative Care</h3>
                <p className="text-gold-300/80 text-sm">47% gap in preventative care utilization between highest and lowest groups</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
