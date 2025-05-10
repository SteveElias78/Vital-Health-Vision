
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import HeroBanner from '@/components/HeroBanner';
import KeyMetricsSection from '@/components/KeyMetricsSection';
import DashboardFeaturesSection from '@/components/DashboardFeaturesSection';
import DataSourcesSection from '@/components/DataSourcesSection';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <HeroBanner />

      {/* Main Content */}
      <main className="flex-grow">
        {/* CTA Section for Demo Login */}
        {!isAuthenticated && (
          <section className="py-12 bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border-t border-b border-indigo-500/20">
            <div className="container mx-auto text-center px-4">
              <h2 className="text-2xl font-bold text-gold-400 mb-4">
                Experience the Demo Version
              </h2>
              <p className="text-gold-300/90 max-w-2xl mx-auto mb-8">
                Access all platform features with pre-configured demo accounts. Explore interactive visualizations, AI-powered analytics, and comprehensive health data dashboards.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/demo-login">
                  <Button size="lg" className="bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-midnight-900">
                    Try the Demo
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}
  
        {/* Key Metrics Section */}
        <KeyMetricsSection />

        {/* Dashboard Features Section */}
        <DashboardFeaturesSection />

        {/* Data Sources Section */}
        <DataSourcesSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
