import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Download, FileChartLine } from "lucide-react";
import { motion } from "framer-motion";
import { FormDivider } from "@/components/decorative/FormDivider";

const Explore = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-midnight-900 to-midnight-950">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container px-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-light tracking-wider text-gold-400">Data Explorer</h1>
              <p className="text-gold-300/80">Explore and analyze public health datasets</p>
            </div>
            <div className="mt-4 flex items-center gap-3 md:mt-0">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-400" />
                <input
                  type="text"
                  placeholder="Search datasets..."
                  className="art-deco-input pl-8"
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
          
          <Tabs defaultValue="datasets" className="mt-8">
            <TabsList className="mb-6 art-deco-tabs bg-midnight-800 border border-gold-500/30">
              <TabsTrigger value="datasets" className="data-[state=active]:bg-gold-500/20 data-[state=active]:text-gold-300">Datasets</TabsTrigger>
              <TabsTrigger value="visualizations" className="data-[state=active]:bg-gold-500/20 data-[state=active]:text-gold-300">Visualizations</TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-gold-500/20 data-[state=active]:text-gold-300">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="datasets">
              <FormDivider pattern="diamonds" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {datasetsCards.map((dataset, index) => (
                  <motion.div
                    key={index}
                    className="art-deco-card relative group"
                    whileHover={{ 
                      boxShadow: '0 0 15px rgba(255, 199, 0, 0.3)',
                      y: -5 
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    {/* Decorative corner elements */}
                    <div className="art-deco-corner art-deco-corner-tl"></div>
                    <div className="art-deco-corner art-deco-corner-tr"></div>
                    <div className="art-deco-corner art-deco-corner-bl"></div>
                    <div className="art-deco-corner art-deco-corner-br"></div>
                    
                    {/* Art Deco pattern background */}
                    <div className="absolute inset-0 opacity-5 pointer-events-none art-deco-pattern"></div>
                    
                    <CardHeader className="pb-2 border-b border-gold-500/20">
                      <CardTitle className="text-gold-400 font-light tracking-wider">{dataset.title}</CardTitle>
                      <CardDescription className="text-gold-300/80">{dataset.description}</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pt-4">
                      <div className="flex flex-col">
                        <div className="flex items-center justify-between text-sm text-gold-400/70 mb-1">
                          <span>Source:</span>
                          <span className="font-medium">{dataset.source}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gold-400/70 mb-1">
                          <span>Last Updated:</span>
                          <span className="font-medium">{dataset.updated}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gold-400/70 mb-4">
                          <span>Records:</span>
                          <span className="font-medium">{dataset.records}</span>
                        </div>
                        
                        <Button 
                          className="w-full group-hover:bg-gold-500/20 transition-colors duration-300"
                          variant="secondary"
                        >
                          <FileChartLine className="mr-2 h-4 w-4" />
                          Analyze Dataset
                        </Button>
                      </div>
                    </CardContent>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="visualizations">
              <div className="art-deco-card p-16 text-center">
                <h3 className="text-xl font-light tracking-wider text-gold-400 mb-2">Visualization Builder</h3>
                <p className="text-gold-300/80 mb-4">Create custom visualizations by selecting datasets and chart types.</p>
                <Button>Create New Visualization</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="analytics">
              <div className="art-deco-card p-16 text-center">
                <h3 className="text-xl font-light tracking-wider text-gold-400 mb-2">Analytics Tools</h3>
                <p className="text-gold-300/80 mb-4">Access advanced analytics and statistical tools to analyze health data.</p>
                <Button>Explore Analytics Tools</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <footer className="py-6 border-t border-gold-500/20">
        <div className="container px-4 text-center text-sm text-gold-300/70">
          © 2025 Vital Health Vision. All data provided for educational purposes only.
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
