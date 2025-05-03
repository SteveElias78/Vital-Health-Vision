
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { AnalyticsSummary } from "@/components/AnalyticsSummary";
import { DashboardCard } from "@/components/DashboardCard";
import { DataTrends } from "@/components/DataTrends";
import { DemographicsBreakdown } from "@/components/DemographicsBreakdown";
import { HealthMap } from "@/components/HealthMap";
import { CorrelationMatrix } from "@/components/CorrelationMatrix";
import { PredictionModel } from "@/components/PredictionModel";
import { Database, FileChartLine, Filter } from "lucide-react";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Banner section - full width */}
        <section className="w-full">
          <div className="relative w-full" style={{ 
            paddingTop: "50.0000%",
            backgroundColor: "#1A1F2C"
          }}>
            <iframe 
              loading="lazy" 
              style={{ 
                position: "absolute", 
                width: "100%", 
                height: "100%", 
                top: "0", 
                left: "0", 
                border: "none", 
                padding: "0",
                margin: "0" 
              }}
              src="https://www.canva.com/design/DAGmWnfOB8M/XxVkdBWOj1VwBz2W6L4ZvA/view?embed&autoplay=1&loop=1" 
              allowFullScreen
              title="Vital Health Vision Banner"
              allow="autoplay; loop"
            />
          </div>
          <div className="container mx-auto -mt-20 flex items-center justify-center gap-x-12 relative z-10 animate-fade-in">
            <Button 
              className="bg-black text-amber-400 hover:bg-black/90 hover:shadow-[0_0_15px_rgba(251,191,36,0.7)] transition-all duration-300 px-8 py-6 text-lg font-medium"
            >
              Explore Data
            </Button>
            <Button 
              variant="outline" 
              className="border-black bg-black text-amber-400 hover:bg-black/90 hover:border-amber-400 hover:shadow-[0_0_15px_rgba(251,191,36,0.7)] transition-all duration-300 px-8 py-6 text-lg font-medium"
            >
              Learn more
            </Button>
          </div>
        </section>
        
        {/* Stats Overview */}
        <section className="w-full mt-12">
          <div className="w-full">
            <DashboardCard title="KEY METRICS" className="bg-transparent shadow-lg border-0">
              <div className="relative w-full overflow-hidden" style={{ 
                backgroundImage: "url('/lovable-uploads/d3a0d9d1-3e91-453e-b887-9249a2dfc7b3.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: "0.5rem",
                minHeight: "220px"
              }}>
                <div className="absolute inset-0 bg-gradient-to-r from-health-dark/90 via-health-dark/70 to-transparent"></div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 relative z-10">
                  <div className="backdrop-blur-sm bg-black/30 rounded-lg p-4 border border-amber-400/30 hover:shadow-[0_0_10px_rgba(251,191,36,0.4)] transition-all duration-300">
                    <AnalyticsSummary
                      title="Neural Networks"
                      value="24"
                      change={{ value: "ACTIVE", trend: "up" }}
                    />
                  </div>
                  <div className="backdrop-blur-sm bg-black/30 rounded-lg p-4 border border-amber-400/30 hover:shadow-[0_0_10px_rgba(251,191,36,0.4)] transition-all duration-300">
                    <AnalyticsSummary
                      title="Quantum Analysis"
                      value="99.8%"
                      change={{ value: "OPTIMAL", trend: "up" }}
                    />
                  </div>
                  <div className="backdrop-blur-sm bg-black/30 rounded-lg p-4 border border-amber-400/30 hover:shadow-[0_0_10px_rgba(251,191,36,0.4)] transition-all duration-300">
                    <AnalyticsSummary
                      title="Predictive Score"
                      value="A+"
                      change={{ value: "+2.4%", trend: "up" }}
                    />
                  </div>
                  <div className="backdrop-blur-sm bg-black/30 rounded-lg p-4 border border-amber-400/30 hover:shadow-[0_0_10px_rgba(251,191,36,0.4)] transition-all duration-300">
                    <AnalyticsSummary
                      title="Global Reach"
                      value="192"
                      change={{ value: "NATIONS", trend: "neutral" }}
                    />
                  </div>
                </div>
              </div>
            </DashboardCard>
          </div>
        </section>

        {/* Dashboard Features */}
        <section className="container px-4 py-8">
          <h2 className="mb-6 text-2xl font-bold">Analysis Dashboard</h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
            <DataTrends />
            <DemographicsBreakdown />
            <CorrelationMatrix />
            <HealthMap />
            <PredictionModel />
          </div>
        </section>
        
        {/* Data Sources */}
        <section className="bg-white py-12">
          <div className="container px-4">
            <h2 className="mb-8 text-2xl font-bold text-center">Data Sources & Analysis Methods</h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-health-purple/10">
                  <Database className="h-6 w-6 text-health-purple" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">Public Health Datasets</h3>
                <p className="mt-2 text-gray-600">
                  Leveraging CDC, WHO, and other public health data sources to provide comprehensive insights.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-health-teal/10">
                  <FileChartLine className="h-6 w-6 text-health-teal" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">Statistical Analysis</h3>
                <p className="mt-2 text-gray-600">
                  Advanced statistical methods to identify patterns, correlations, and trends in health data.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-health-orange/10">
                  <Filter className="h-6 w-6 text-health-orange" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">Predictive Modeling</h3>
                <p className="mt-2 text-gray-600">
                  Machine learning models to forecast health trends and identify at-risk populations.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-health-dark py-8 text-gray-300">
        <div className="container px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Vital Health Vision</h3>
              <p className="mt-2 text-sm">
                A public health data analysis platform for research and decision making.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-white">Features</h4>
              <ul className="mt-2 space-y-2 text-sm">
                <li>Data Exploration</li>
                <li>Demographic Analysis</li>
                <li>Geographic Visualization</li>
                <li>Predictive Modeling</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white">Resources</h4>
              <ul className="mt-2 space-y-2 text-sm">
                <li>Documentation</li>
                <li>API Reference</li>
                <li>Data Sources</li>
                <li>Research Papers</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white">Legal</h4>
              <ul className="mt-2 space-y-2 text-sm">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Data Usage</li>
                <li>Accessibility</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm">
            <p>© 2025 Vital Health Vision. For educational purposes only.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
