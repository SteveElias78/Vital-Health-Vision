
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Download, FileChartLine } from "lucide-react";

const Explore = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 py-6">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Data Explorer</h1>
              <p className="text-gray-500">Explore and analyze public health datasets</p>
            </div>
            <div className="mt-4 flex items-center gap-3 md:mt-0">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search datasets..."
                  className="pl-8 h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm"
                />
              </div>
              <Button variant="outline" size="icon" title="Filter">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" title="Download">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="datasets">
            <TabsList className="mb-6">
              <TabsTrigger value="datasets">Datasets</TabsTrigger>
              <TabsTrigger value="visualizations">Visualizations</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="datasets">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {datasetsCards.map((dataset, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <CardTitle>{dataset.title}</CardTitle>
                      <CardDescription>{dataset.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col">
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                          <span>Source:</span>
                          <span className="font-medium">{dataset.source}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                          <span>Last Updated:</span>
                          <span className="font-medium">{dataset.updated}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <span>Records:</span>
                          <span className="font-medium">{dataset.records}</span>
                        </div>
                        <Button className="w-full" variant="outline">
                          <FileChartLine className="mr-2 h-4 w-4" />
                          Analyze Dataset
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="visualizations">
              <div className="rounded-md border border-dashed p-16 text-center">
                <h3 className="text-lg font-medium mb-2">Visualization Builder</h3>
                <p className="text-gray-500 mb-4">Create custom visualizations by selecting datasets and chart types.</p>
                <Button>Create New Visualization</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="analytics">
              <div className="rounded-md border border-dashed p-16 text-center">
                <h3 className="text-lg font-medium mb-2">Analytics Tools</h3>
                <p className="text-gray-500 mb-4">Access advanced analytics and statistical tools to analyze health data.</p>
                <Button>Explore Analytics Tools</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <footer className="bg-white py-6 border-t">
        <div className="container px-4 text-center text-sm text-gray-500">
          © 2025 HealthTrendLens. All data provided for educational purposes only.
        </div>
      </footer>
    </div>
  );
};

// Sample data for the datasets cards
const datasetsCards = [
  {
    title: "COVID-19 Cases and Mortality",
    description: "National data on COVID-19 cases, deaths, and recovery rates",
    source: "CDC",
    updated: "May 1, 2025",
    records: "1.2M"
  },
  {
    title: "Diabetes Prevalence",
    description: "State-level diabetes prevalence by demographics",
    source: "NIH",
    updated: "April 15, 2025",
    records: "452K"
  },
  {
    title: "Heart Disease Risk Factors",
    description: "Analysis of risk factors correlated with heart disease",
    source: "American Heart Association",
    updated: "March 28, 2025",
    records: "789K"
  },
  {
    title: "Obesity Trends",
    description: "Historical data on obesity rates across demographics",
    source: "CDC",
    updated: "April 22, 2025",
    records: "845K"
  },
  {
    title: "Vaccine Coverage",
    description: "Geographic and demographic breakdowns of vaccine coverage",
    source: "WHO",
    updated: "May 2, 2025",
    records: "1.5M"
  },
  {
    title: "Environmental Health Indicators",
    description: "Air quality, water safety, and other environmental factors",
    source: "EPA",
    updated: "April 10, 2025",
    records: "678K"
  }
];

export default Explore;
