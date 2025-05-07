
import React from 'react';
import { UnifiedDashboard } from './UnifiedDashboard';
import { GeometricDivider } from '@/components/decorative/GeometricDivider';

/**
 * Dashboard Home Page component - main landing page with Art Deco styled visualizations
 */
export const DashboardHome: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-midnight-900 to-midnight-950 min-h-screen">
      <div className="container mx-auto px-6 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-light tracking-wider text-gold-400">
            Vital Health <span className="font-medium">Dashboard</span>
          </h1>
          <p className="text-gold-300/80 mt-2">
            Explore health trends with our Art Deco styled data visualization platform
          </p>
        </header>
        
        <GeometricDivider pattern="diamonds" />
        
        <UnifiedDashboard />
        
        <footer className="mt-12 pt-6 border-t border-gold-500/20 text-center">
          <p className="text-sm text-gold-300/70">
            © 2025 Vital Health Vision. All data provided for educational purposes only.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default DashboardHome;
