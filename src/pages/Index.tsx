
import { Navbar } from "@/components/Navbar";
import { HeroBanner } from "@/components/HeroBanner";
import { KeyMetricsSection } from "@/components/KeyMetricsSection";
import { DashboardFeaturesSection } from "@/components/DashboardFeaturesSection";
import { DataSourcesSection } from "@/components/DataSourcesSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Banner section */}
        <HeroBanner />
        
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
