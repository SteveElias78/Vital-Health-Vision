
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataDisplay } from "./DataDisplay";
import { SourcesPanel } from "./SourcesPanel";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader } from "lucide-react";
import { useHealthData, HealthDataCategory } from "@/hooks/useHealthData";

export const HealthDataDashboard = () => {
  const { 
    loading, 
    error, 
    data, 
    metadata, 
    sources, 
    dataCategory, 
    setDataCategory 
  } = useHealthData();

  // Handle category change with proper type casting
  const handleCategoryChange = (value: string) => {
    setDataCategory(value as HealthDataCategory);
  };

  // Ensure sources has the correct structure
  const formattedSources = {
    government: sources?.government || [],
    alternative: sources?.alternative || [],
    compromisedCategories: sources?.compromisedCategories || []
  };

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Health Data Dashboard</h1>
        <p className="text-muted-foreground">
          Visualizing public health trends with verified data sources
        </p>
      </div>

      <Tabs value={dataCategory} onValueChange={handleCategoryChange}>
        <TabsList className="grid w-full md:w-auto grid-cols-3 mb-4">
          <TabsTrigger value="obesity">Obesity Data</TabsTrigger>
          <TabsTrigger value="mental-health">Mental Health</TabsTrigger>
          <TabsTrigger value="lgbtq-health">LGBTQ+ Health</TabsTrigger>
        </TabsList>

        {loading && (
          <div className="flex justify-center items-center h-40">
            <Loader className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading data...</span>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!loading && !error && data && (
          <>
            <TabsContent value="obesity">
              <DataDisplay 
                categoryName="Obesity Data" 
                data={data} 
                metadata={metadata} 
                category="obesity" 
              />
            </TabsContent>
            
            <TabsContent value="mental-health">
              <DataDisplay 
                categoryName="Mental Health" 
                data={data} 
                metadata={metadata} 
                category="mental-health" 
              />
            </TabsContent>
            
            <TabsContent value="lgbtq-health">
              <DataDisplay 
                categoryName="LGBTQ+ Health" 
                data={data} 
                metadata={metadata} 
                category="lgbtq-health" 
              />
            </TabsContent>
          </>
        )}
      </Tabs>

      {!loading && !error && formattedSources && (
        <SourcesPanel sources={formattedSources} />
      )}
    </div>
  );
};
