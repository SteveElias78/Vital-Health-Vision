import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from '@/components/ui/button';
import { ArtDecoPageHeader } from '@/components/artdeco/ArtDecoPageHeader';
import { DemoModeIndicator } from '@/components/demo/DemoModeIndicator';
import { useAuth } from '@/hooks/useAuth';
import { demoDataService, HealthDataCategory } from '@/data/demo/DemoDataService';
import { HealthMap } from '@/components/HealthMap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Map, BarChart4, Download, Filter } from 'lucide-react';

export default function Geography() {
  const [dataCategory, setDataCategory] = useState<HealthDataCategory>('obesity');
  const [regionData, setRegionData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<string>('map');
  const { isDemo } = useAuth();
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await demoDataService.getHealthData(dataCategory);
        // Access regional data from updated structure
        setRegionData(result.data.regional || []);
      } catch (err) {
        console.error('Error fetching geographic data:', err);
        setError('Failed to load geographic data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [dataCategory]);
  
  const renderBarChart = () => {
    // Sort the data by value in descending order
    const sortedData = [...regionData].sort((a, b) => b.value - a.value).slice(0, 10);
    
    return (
      <ResponsiveContainer width="100%" height={500}>
        <BarChart
          data={sortedData}
          margin={{ top: 20, right: 30, left: 40, bottom: 70 }}
          layout="vertical"
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis 
            type="number"
            tick={{ fill: '#e4c389' }} 
            axisLine={{ stroke: '#e4c389', strokeWidth: 1 }}
            tickLine={{ stroke: '#e4c389' }}
          />
          <YAxis 
            dataKey="locationdesc"
            type="category"
            tick={{ fill: '#e4c389' }} 
            axisLine={{ stroke: '#e4c389', strokeWidth: 1 }}
            tickLine={{ stroke: '#e4c389' }}
            width={120}
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
            dataKey="value" 
            name={getCategoryLabel(dataCategory)} 
            fill="#FFC700"
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  };
  
  const getCategoryLabel = (category: HealthDataCategory): string => {
    switch (category) {
      case 'obesity': 
        return 'Obesity Rate (%)';
      case 'mental-health': 
        return 'Mental Health Condition Rate (%)';
      case 'lgbtq-health': 
        return 'Healthcare Access Rate (%)';
      case 'chronic-disease': 
        return 'Chronic Disease Rate (%)';
      default: 
        return 'Rate (%)';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <ArtDecoPageHeader 
          title="Geographic Health Analysis" 
          subtitle="Exploring health metrics across different regions" 
        />
        {isDemo && <DemoModeIndicator />}
      </div>

      <Card className="art-deco-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-gold-400">
            Regional Health Analysis
          </CardTitle>
          <div className="flex space-x-2">
            <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value)}>
              <ToggleGroupItem value="map" aria-label="Map View">
                <Map className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Map</span>
              </ToggleGroupItem>
              <ToggleGroupItem value="chart" aria-label="Chart View">
                <BarChart4 className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Chart</span>
              </ToggleGroupItem>
            </ToggleGroup>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue="obesity" 
            value={dataCategory}
            onValueChange={(value) => setDataCategory(value as HealthDataCategory)}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <TabsList className="art-deco-tabs">
                <TabsTrigger value="obesity">Obesity</TabsTrigger>
                <TabsTrigger value="mental-health">Mental Health</TabsTrigger>
                <TabsTrigger value="chronic-disease">Chronic Disease</TabsTrigger>
              </TabsList>
              
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filter</span>
              </Button>
            </div>
            
            <TabsContent value="obesity" className="space-y-6">
              {loading ? (
                <div className="h-[500px] flex items-center justify-center">
                  <div className="text-gold-400">Loading data...</div>
                </div>
              ) : error ? (
                <div className="h-[500px] flex items-center justify-center">
                  <div className="text-red-400">{error}</div>
                </div>
              ) : (
                <div className="h-[500px]">
                  {viewMode === 'map' ? (
                    <HealthMap />
                  ) : (
                    renderBarChart()
                  )}
                </div>
              )}
              <div className="p-4 bg-midnight-900/50 border border-gold-500/30 rounded-lg">
                <h3 className="text-gold-400 mb-2 text-lg">Key Insights - Obesity</h3>
                <ul className="space-y-2 text-gold-300">
                  <li>• Southern states show 23% higher obesity rates compared to western states</li>
                  <li>• Strong correlation between obesity and socioeconomic factors across regions</li>
                  <li>• Rural areas consistently show higher rates than urban centers in the same state</li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="mental-health" className="space-y-6">
              {loading ? (
                <div className="h-[500px] flex items-center justify-center">
                  <div className="text-gold-400">Loading data...</div>
                </div>
              ) : error ? (
                <div className="h-[500px] flex items-center justify-center">
                  <div className="text-red-400">{error}</div>
                </div>
              ) : (
                <div className="h-[500px]">
                  {viewMode === 'map' ? (
                    <HealthMap />
                  ) : (
                    renderBarChart()
                  )}
                </div>
              )}
              <div className="p-4 bg-midnight-900/50 border border-gold-500/30 rounded-lg">
                <h3 className="text-gold-400 mb-2 text-lg">Key Insights - Mental Health</h3>
                <ul className="space-y-2 text-gold-300">
                  <li>• Urban areas show 18.7% higher prevalence of reported mental health conditions</li>
                  <li>• Northeastern states lead in mental health service accessibility</li>
                  <li>• Strong regional variations in anxiety disorders follow seasonal patterns</li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="chronic-disease" className="space-y-6">
              {loading ? (
                <div className="h-[500px] flex items-center justify-center">
                  <div className="text-gold-400">Loading data...</div>
                </div>
              ) : error ? (
                <div className="h-[500px] flex items-center justify-center">
                  <div className="text-red-400">{error}</div>
                </div>
              ) : (
                <div className="h-[500px]">
                  {viewMode === 'map' ? (
                    <HealthMap />
                  ) : (
                    renderBarChart()
                  )}
                </div>
              )}
              <div className="p-4 bg-midnight-900/50 border border-gold-500/30 rounded-lg">
                <h3 className="text-gold-400 mb-2 text-lg">Key Insights - Chronic Disease</h3>
                <ul className="space-y-2 text-gold-300">
                  <li>• Diabetes rates 32% higher in southern states compared to western states</li>
                  <li>• Hypertension shows less regional variation but strong correlation with demographics</li>
                  <li>• Heart disease prevalence patterns differ significantly from other chronic conditions</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="art-deco-border">
          <CardHeader>
            <CardTitle className="text-gold-400">
              Regional Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-midnight-900/50 border border-gold-500/30 rounded-lg p-4">
                  <h3 className="text-gold-400 mb-2">Northeast</h3>
                  <p className="text-2xl font-light text-gold-300">27.4%</p>
                  <p className="text-sm text-gold-300/70">Obesity Rate</p>
                  <div className="mt-2 flex items-center text-xs">
                    <span className="text-emerald-400">▼ 2.3% below national average</span>
                  </div>
                </div>
                <div className="bg-midnight-900/50 border border-gold-500/30 rounded-lg p-4">
                  <h3 className="text-gold-400 mb-2">Midwest</h3>
                  <p className="text-2xl font-light text-gold-300">32.8%</p>
                  <p className="text-sm text-gold-300/70">Obesity Rate</p>
                  <div className="mt-2 flex items-center text-xs">
                    <span className="text-amber-400">▲ 3.1% above national average</span>
                  </div>
                </div>
                <div className="bg-midnight-900/50 border border-gold-500/30 rounded-lg p-4">
                  <h3 className="text-gold-400 mb-2">South</h3>
                  <p className="text-2xl font-light text-gold-300">35.9%</p>
                  <p className="text-sm text-gold-300/70">Obesity Rate</p>
                  <div className="mt-2 flex items-center text-xs">
                    <span className="text-red-400">▲ 6.2% above national average</span>
                  </div>
                </div>
                <div className="bg-midnight-900/50 border border-gold-500/30 rounded-lg p-4">
                  <h3 className="text-gold-400 mb-2">West</h3>
                  <p className="text-2xl font-light text-gold-300">25.3%</p>
                  <p className="text-sm text-gold-300/70">Obesity Rate</p>
                  <div className="mt-2 flex items-center text-xs">
                    <span className="text-emerald-400">▼ 4.4% below national average</span>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-midnight-900/50 border border-gold-500/30 rounded-lg">
                <h3 className="text-gold-400 mb-2">Regional Factors</h3>
                <ul className="text-sm text-gold-300 space-y-1">
                  <li>• Food environment quality varies significantly by region</li>
                  <li>• Built environment and urban planning impact physical activity</li>
                  <li>• Cultural and socioeconomic factors influence dietary patterns</li>
                  <li>• Healthcare access shows 28% variation between regions</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="art-deco-border">
          <CardHeader>
            <CardTitle className="text-gold-400">
              Urban vs Rural Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex h-48">
                <div className="flex-1 flex flex-col justify-between p-4 bg-midnight-900/50 border border-gold-500/30 rounded-l-lg">
                  <div>
                    <h3 className="text-gold-400 mb-1">Urban</h3>
                    <p className="text-3xl font-light text-gold-300">28.4%</p>
                    <p className="text-sm text-gold-300/70">Obesity Rate</p>
                  </div>
                  <div className="text-sm text-gold-300/70">
                    <div>Higher walkability</div>
                    <div>Better healthcare access</div>
                    <div>More food options</div>
                  </div>
                </div>
                <div className="w-0.5 bg-gold-500/30"></div>
                <div className="flex-1 flex flex-col justify-between p-4 bg-midnight-900/50 border border-gold-500/30 rounded-r-lg">
                  <div>
                    <h3 className="text-gold-400 mb-1">Rural</h3>
                    <p className="text-3xl font-light text-gold-300">35.6%</p>
                    <p className="text-sm text-gold-300/70">Obesity Rate</p>
                  </div>
                  <div className="text-sm text-gold-300/70">
                    <div>Limited food access</div>
                    <div>Fewer healthcare options</div>
                    <div>Car-dependent communities</div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-midnight-900/50 border border-gold-500/30 rounded-lg">
                <h3 className="text-gold-400 mb-2">Contributing Factors</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-gold-300 w-32">Food Deserts</div>
                    <div className="flex-1 h-3 rounded-full bg-midnight-800 overflow-hidden">
                      <div className="h-full bg-gold-600 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <div className="text-sm text-gold-300 ml-2">65%</div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-gold-300 w-32">Healthcare Access</div>
                    <div className="flex-1 h-3 rounded-full bg-midnight-800 overflow-hidden">
                      <div className="h-full bg-gold-600 rounded-full" style={{ width: '52%' }}></div>
                    </div>
                    <div className="text-sm text-gold-300 ml-2">52%</div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-gold-300 w-32">Economic Factors</div>
                    <div className="flex-1 h-3 rounded-full bg-midnight-800 overflow-hidden">
                      <div className="h-full bg-gold-600 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                    <div className="text-sm text-gold-300 ml-2">78%</div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-gold-300 w-32">Physical Activity</div>
                    <div className="flex-1 h-3 rounded-full bg-midnight-800 overflow-hidden">
                      <div className="h-full bg-gold-600 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                    <div className="text-sm text-gold-300 ml-2">70%</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
