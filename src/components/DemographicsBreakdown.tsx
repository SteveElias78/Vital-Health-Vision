
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export const DemographicsBreakdown: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('age');

  // Sample data for demographic breakdowns
  const demographicData = {
    age: [
      { group: '18-24', value: 26.3 },
      { group: '25-34', value: 33.5 },
      { group: '35-44', value: 38.1 },
      { group: '45-54', value: 40.2 },
      { group: '55-64', value: 42.5 },
      { group: '65+', value: 36.5 }
    ],
    gender: [
      { group: 'Male', value: 35.8 },
      { group: 'Female', value: 33.7 },
      { group: 'Non-binary', value: 29.5 }
    ],
    race: [
      { group: 'White', value: 34.2 },
      { group: 'Black', value: 40.7 },
      { group: 'Hispanic', value: 39.5 },
      { group: 'Asian', value: 21.3 },
      { group: 'Native American', value: 43.4 },
      { group: 'Pacific Islander', value: 38.3 },
      { group: 'Multiple/Other', value: 34.8 }
    ],
    income: [
      { group: 'Less than $25,000', value: 43.2 },
      { group: '$25,000-$49,999', value: 38.5 },
      { group: '$50,000-$74,999', value: 35.7 },
      { group: '$75,000-$99,999', value: 31.5 },
      { group: '$100,000+', value: 28.3 }
    ]
  };

  const getBarColor = (value: number) => {
    if (value > 40) return '#ef4444';
    if (value > 35) return '#f87171';
    if (value > 30) return '#fb923c';
    if (value > 25) return '#fcd34d';
    return '#4ade80';
  };

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Demographic Breakdown</CardTitle>
        <CardDescription>Health metrics across different population groups</CardDescription>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="age">Age</TabsTrigger>
            <TabsTrigger value="gender">Gender</TabsTrigger>
            <TabsTrigger value="race">Race/Ethnicity</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="h-[300px]">
        <TabsContent value="age" className="h-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={demographicData.age}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="group" />
              <YAxis domain={[0, 50]} />
              <Tooltip formatter={(value) => [`${value}%`, 'Prevalence']} />
              <Bar dataKey="value" name="Prevalence" fill="#8884d8">
                {demographicData.age.map((entry, index) => (
                  <rect key={`rect-${index}`} fill={getBarColor(entry.value)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </TabsContent>
        <TabsContent value="gender" className="h-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={demographicData.gender}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="group" />
              <YAxis domain={[0, 50]} />
              <Tooltip formatter={(value) => [`${value}%`, 'Prevalence']} />
              <Bar dataKey="value" name="Prevalence" fill="#8884d8">
                {demographicData.gender.map((entry, index) => (
                  <rect key={`rect-${index}`} fill={getBarColor(entry.value)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </TabsContent>
        <TabsContent value="race" className="h-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={demographicData.race}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="group" />
              <YAxis domain={[0, 50]} />
              <Tooltip formatter={(value) => [`${value}%`, 'Prevalence']} />
              <Bar dataKey="value" name="Prevalence" fill="#8884d8">
                {demographicData.race.map((entry, index) => (
                  <rect key={`rect-${index}`} fill={getBarColor(entry.value)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </TabsContent>
        <TabsContent value="income" className="h-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={demographicData.income}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="group" />
              <YAxis domain={[0, 50]} />
              <Tooltip formatter={(value) => [`${value}%`, 'Prevalence']} />
              <Bar dataKey="value" name="Prevalence" fill="#8884d8">
                {demographicData.income.map((entry, index) => (
                  <rect key={`rect-${index}`} fill={getBarColor(entry.value)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </TabsContent>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-xs text-muted-foreground">
          Source: Demo data based on CDC patterns
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </CardFooter>
    </Card>
  );
};
