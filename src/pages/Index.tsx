
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Navbar } from "@/components/Navbar";
import { HeroBanner } from "@/components/HeroBanner";
import { KeyMetricsSection } from "@/components/KeyMetricsSection";
import { DashboardFeaturesSection } from "@/components/DashboardFeaturesSection";
import { DataSourcesSection } from "@/components/DataSourcesSection";
import { Footer } from "@/components/Footer";

const Index: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Banner section */}
        <HeroBanner />
        
        {/* Demo Access Banner */}
        <div className="bg-blue-600 text-white py-4">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <h3 className="text-xl font-bold mb-1">Try the Interactive Demo</h3>
              <p className="text-blue-100">Experience the platform with pre-configured demo accounts</p>
            </div>
            <Link to="/demo">
              <Button className="bg-white text-blue-600 hover:bg-blue-50">
                Access Demo Version
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Stats Overview */}
        <KeyMetricsSection />

        {/* Dashboard Features */}
        <DashboardFeaturesSection />
        
        {/* Data Sources */}
        <DataSourcesSection />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
