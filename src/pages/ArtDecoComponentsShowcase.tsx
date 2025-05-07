import React from 'react';
import {
  ArtDecoButton,
  ArtDecoCard,
  ArtDecoStatsCard,
  ArtDecoPageHeader,
  ArtDecoInput,
  ArtDecoRadialChart,
  ArtDecoGradientDivider,
  ArtDecoNavItem,
  ArtDecoFooter,
  RadialChartDataPoint
} from '@/components/artdeco';
import { 
  Users, 
  Activity, 
  BarChart3, 
  Calendar, 
  ArrowRight 
} from 'lucide-react';

const ArtDecoComponentsShowcase: React.FC = () => {
  // Sample data for the stats cards
  const totalUsers = 4523;
  const activeUsers = 3876;
  const avgSessionDuration = '47m 32s';
  const lastUpdated = 'October 1, 2024';
  
  // Radial chart data
  const healthOutcomesByDemographic: RadialChartDataPoint[] = [
    { category: 'Age 18-24', value: 24.5, color: '#FFDD66' },
    { category: 'Age 25-34', value: 32.1, color: '#FFD233' },
    { category: 'Age 35-44', value: 18.7, color: '#FFC700' },
    { category: 'Age 45+', value: 24.7, color: '#CCA000' }
  ];
  
  const healthRiskFactors: RadialChartDataPoint[] = [
    { category: 'Physical Inactivity', value: 35.2, color: '#FFDD66' },
    { category: 'Poor Diet', value: 28.4, color: '#FFD233' },
    { category: 'Smoking', value: 15.3, color: '#FFC700' },
    { category: 'Excessive Alcohol', value: 12.6, color: '#CCA000' },
    { category: 'Poor Sleep', value: 8.5, color: '#997800' }
  ];
  
  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <ArtDecoPageHeader
        title="Art Deco Components Showcase"
        subtitle="Explore the various Art Deco styled components"
      />
      
      {/* Stats Cards */}
      <ArtDecoGradientDivider text="Key Metrics" pattern="diamonds" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ArtDecoStatsCard
          title="Total Users"
          value={totalUsers}
          trend="up"
          trendValue="+12%"
          status="positive"
          icon={<Users />}
        />
        <ArtDecoStatsCard
          title="Active Users"
          value={activeUsers}
          trend="down"
          trendValue="-5%"
          status="negative"
          icon={<Activity />}
        />
        <ArtDecoStatsCard
          title="Avg. Session Duration"
          value={avgSessionDuration}
          icon={<BarChart3 />}
        />
        <ArtDecoStatsCard
          title="Last Updated"
          value={lastUpdated}
          icon={<Calendar />}
        />
      </div>
      
      {/* Radial Charts */}
      <ArtDecoGradientDivider text="Health Insights" pattern="zigzag" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ArtDecoCard>
          <ArtDecoRadialChart
            data={healthOutcomesByDemographic}
            centerText="Outcomes by Age"
            unit="%"
          />
        </ArtDecoCard>
        <ArtDecoCard>
          <ArtDecoRadialChart
            data={healthRiskFactors}
            centerText="Risk Factors"
            unit="%"
          />
        </ArtDecoCard>
      </div>
      
      {/* Buttons and Inputs */}
      <ArtDecoGradientDivider text="Interactive Elements" pattern="dots" />
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
        <ArtDecoButton>Get Started <ArrowRight className="w-4 h-4 ml-2" /></ArtDecoButton>
        <ArtDecoInput placeholder="Enter your email" className="w-full md:w-64" />
      </div>
      
      {/* Navigation Items */}
      <ArtDecoGradientDivider text="Navigation" />
      <div className="flex space-x-4">
        <ArtDecoNavItem href="#" label="Dashboard" />
        <ArtDecoNavItem href="#" label="Settings" variant="subtle" />
        <ArtDecoNavItem href="#" label="Profile" variant="bordered" />
        <ArtDecoNavItem href="#" label="Help" variant="underlined" />
      </div>
      
      {/* Footer */}
      <ArtDecoGradientDivider text="End of Showcase" />
      <ArtDecoFooter />
    </div>
  );
};

export default ArtDecoComponentsShowcase;
