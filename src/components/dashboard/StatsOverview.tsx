
import React from 'react';
import { ArtDecoStatsCard } from '@/components/artdeco/ArtDecoStatsCard';
import { ArrowUpRight, TrendingUp, Activity, Globe } from 'lucide-react';

export interface StatsCardData {
  title: string;
  value: string;
  status: 'positive' | 'negative' | 'neutral';
  trendValue: string;
  trend?: 'up' | 'down';
  unit?: string;
  icon?: React.ReactNode;
}

interface StatsOverviewProps {
  stats: StatsCardData[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats = [] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((card, index) => (
        <ArtDecoStatsCard 
          key={index}
          title={card.title}
          value={card.value}
          trend={card.trend}
          trendValue={card.trendValue}
          status={card.status}
          unit={card.unit}
        />
      ))}
    </div>
  );
};

export const getDefaultStats = (): StatsCardData[] => {
  return [
    { 
      title: 'Neural Networks', 
      value: '24', 
      status: 'neutral', 
      trendValue: 'ACTIVE',
      icon: <TrendingUp className="h-5 w-5 text-gold-400/70" />
    },
    { 
      title: 'Quantum Analysis', 
      value: '99.8', 
      unit: '%',
      status: 'positive',
      trendValue: 'OPTIMAL',
      icon: <Activity className="h-5 w-5 text-gold-400/70" />
    },
    { 
      title: 'Predictive Score', 
      value: 'A+', 
      trend: 'up',
      trendValue: '+2.4%',
      status: 'positive',
      icon: <ArrowUpRight className="h-5 w-5 text-gold-400/70" />
    },
    { 
      title: 'Global Reach', 
      value: '192', 
      status: 'neutral',
      trendValue: 'NATIONS',
      icon: <Globe className="h-5 w-5 text-gold-400/70" />
    }
  ];
};
