
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useAuth } from '@/hooks/useAuth';
import { DemoModeIndicator } from '@/components/demo/DemoModeIndicator';

// Advanced analytics page - available only for admin users
const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>('3y');
  const [category, setCategory] = useState<string>('obesity');
  const [analysisTab, setAnalysisTab] = useState<string>('correlations');
  const { isDemo, demoRole } = useAuth();

  const factorsData = [
    { name: 'Education', correlation: category === 'obesity' ? 0.72 : category === 'mental-health' ? 0.64 : 0.58 },
    { name: 'Income', correlation: category === 'obesity' ? 0.68 : category === 'mental-health' ? 0.59 : 0.62 },
    { name: 'Physical Activity', correlation: category === 'obesity' ? 0.76 : category === 'mental-health' ? 0.42 : 0.48 },
    { name: 'Food Environment', correlation: category === 'obesity' ? 0.65 : category === 'mental-health' ? 0.38 : 0.52 },
    { name: 'Healthcare Access', correlation: category === 'obesity' ? 0.58 : category === 'mental-health' ? 0.72 : 0.64 }
  ];

  const riskGroupData = [
    { name: 'Low Risk', value: category === 'obesity' ? 35 : category === 'mental-health' ? 40 : 42 },
    { name: 'Moderate Risk', value: category === 'obesity' ? 42 : category === 'mental-health' ? 35 : 38 },
    { name: 'High Risk', value: category === 'obesity' ? 23 : category === 'mental-health' ? 25 : 20 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Advanced Analytics</h1>
          <p className="text-gray-500">Administrator access to detailed analysis tools</p>
        </div>
        <div className="flex items-center gap-4">
          {isDemo && <DemoModeIndicator />}
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Health Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="obesity">Obesity</SelectItem>
              <SelectItem value="mental-health">Mental Health</SelectItem>
              <SelectItem value="lgbtq-health">LGBTQ+ Health</SelectItem>
              <SelectItem value="chronic-disease">Chronic Disease</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1y">Last Year</SelectItem>
              <SelectItem value="3y">Last 3 Years</SelectItem>
              <SelectItem value="5y">Last 5 Years</SelectItem>
              <SelectItem value="10y">Last 10 Years</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs value={analysisTab} onValueChange={setAnalysisTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="correlations">Factor Correlations</TabsTrigger>
          <TabsTrigger value="riskprofile">Risk Profiling</TabsTrigger>
          <TabsTrigger value="predictive">Predictive Models</TabsTrigger>
        </TabsList>
        
        <TabsContent value="correlations">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>Key Factor Correlations</CardTitle>
                <CardDescription>Correlation strength with {category.replace('-', ' ')} outcomes</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={factorsData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 1]} />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip 
                      formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'Correlation']}
                    />
                    <Legend />
                    <Bar dataKey="correlation" name="Correlation Factor" fill="#8884d8">
                      {factorsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Analysis Summary</CardTitle>
                <CardDescription>Key insights from correlation analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-lg mb-1">Primary Factors</h3>
                    <p className="text-sm text-gray-500">
                      {category === 'obesity' && "Physical activity levels show the strongest correlation (0.76), followed by education level (0.72)."}
                      {category === 'mental-health' && "Healthcare access is the primary correlating factor (0.72), followed by education level (0.64)."}
                      {category === 'lgbtq-health' && "Income shows the strongest correlation (0.62), with education level close behind (0.58)."}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg mb-1">Policy Implications</h3>
                    <p className="text-sm text-gray-500">
                      {category === 'obesity' && "Interventions focused on increasing physical activity opportunities and nutritional education are likely to have the highest impact."}
                      {category === 'mental-health' && "Expanding mental healthcare access and reducing barriers to services should be prioritized based on correlation strength."}
                      {category === 'lgbtq-health' && "Addressing economic inequalities and educational opportunities would address the strongest correlated factors."}
                    </p>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="font-medium text-lg mb-1">Regional Variations</h3>
                    <p className="text-sm text-gray-500">
                      Correlation patterns vary significantly by region, with urban areas showing stronger correlation with healthcare access while rural areas show stronger correlation with food environment factors.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="riskprofile">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Population Risk Segmentation</CardTitle>
                <CardDescription>Distribution across risk categories</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskGroupData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {riskGroupData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#4ade80' : index === 1 ? '#facc15' : '#ef4444'} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Population']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>Risk Profile Analysis</CardTitle>
                <CardDescription>Characteristics of identified risk groups</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border-l-4 border-green-500 pl-4 py-2">
                    <h3 className="font-medium text-lg">Low Risk Profile ({riskGroupData[0].value}%)</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {category === 'obesity' && "Higher education (college or advanced degree), regular physical activity (>150 min/week), access to quality healthcare, annual income >$75,000, high nutritional literacy."}
                      {category === 'mental-health' && "Strong social connections, regular physical exercise, access to mental health services, stable employment, health insurance with mental health coverage, stress management practices."}
                      {category === 'lgbtq-health' && "Access to LGBTQ+ competent healthcare, strong community support, living in regions with comprehensive non-discrimination protections, higher income, established support networks."}
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-amber-500 pl-4 py-2">
                    <h3 className="font-medium text-lg">Moderate Risk Profile ({riskGroupData[1].value}%)</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {category === 'obesity' && "Some college education, moderate physical activity (60-150 min/week), inconsistent healthcare utilization, annual income $35,000-$75,000, moderate nutritional awareness."}
                      {category === 'mental-health' && "Moderate social connections, occasional physical activity, limited access to mental health services, employment instability, partial mental health coverage, inconsistent stress management."}
                      {category === 'lgbtq-health' && "Limited access to LGBTQ+ knowledgeable providers, some community connection, living in regions with partial protections, middle income, smaller support networks."}
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-red-500 pl-4 py-2">
                    <h3 className="font-medium text-lg">High Risk Profile ({riskGroupData[2].value}%)</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {category === 'obesity' && "High school education or less, minimal physical activity (<60 min/week), limited healthcare access, annual income <$35,000, low nutritional literacy, high density of fast food outlets."}
                      {category === 'mental-health' && "Social isolation, sedentary lifestyle, no access to mental health services, unemployment or precarious employment, no insurance or mental health coverage, chronic exposure to stressors."}
                      {category === 'lgbtq-health' && "No access to LGBTQ+ competent healthcare, isolation from community, living in regions without protective policies, lower income, minimal support networks, exposure to discrimination."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="predictive">
          <Card>
            <CardHeader>
              <CardTitle>Predictive Modeling Tools</CardTitle>
              <CardDescription>Build and test predictive models (Administrator Only)</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-500 mb-4">This advanced feature is under development for the full version</p>
                <p className="text-sm text-gray-400">Will include machine learning model selection, training data preparation, feature selection, and prediction visualization</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
