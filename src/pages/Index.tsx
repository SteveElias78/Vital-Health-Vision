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
        {/* Video banner section - full width */}
        <section className="bg-gradient-to-r from-health-purple to-health-teal py-12 text-white">
          <div className="container-fluid px-0 w-full">
            <div className="relative w-full" style={{ 
              paddingTop: "18.6158%",
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
                src="https://www.canva.com/design/DAGmWYZhYDE/bXxksLIOveyqp2iRDUj5Eg/watch?embed&loop=true&autoplay=1" 
                allowFullScreen
                title="Vital Health Vision Video"
              />
            </div>
            <div className="container mx-auto mt-6 flex items-center justify-center gap-x-6 animate-fade-in">
              <Button className="bg-white text-health-purple hover:bg-gray-100">
                Explore Data
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                Learn more
              </Button>
            </div>
          </div>
        </section>
        
        {/* Stats Overview */}
        <section className="container px-4 -mt-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DashboardCard title="Key Statistics" className="bg-white shadow-md">
              <div className="grid grid-cols-2 gap-4 p-4">
                <AnalyticsSummary
                  title="Active Data Sources"
                  value="24"
                  change={{ value: "+3 this month", trend: "up" }}
                />
                <AnalyticsSummary
                  title="Health Metrics"
                  value="156"
                  change={{ value: "Complete", trend: "neutral" }}
                />
                <AnalyticsSummary
                  title="Prediction Accuracy"
                  value="93.4%"
                  change={{ value: "+2.1%", trend: "up" }}
                />
                <AnalyticsSummary
                  title="Coverage"
                  value="92%"
                  change={{ value: "-0.5%", trend: "down" }}
                />
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
