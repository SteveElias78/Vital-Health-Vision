
import React from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description }) => {
  return (
    <div className="bg-midnight-800 border border-gold-500/20 rounded-lg p-6">
      <div className="flex justify-center items-center mb-4">
        <div className="w-16 h-16 rounded-full border border-gold-500/50 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-gold-500/20"></div>
        </div>
      </div>
      <h3 className="text-lg font-medium text-gold-400 text-center mb-2">{title}</h3>
      <p className="text-gold-300/70 text-center">{description}</p>
    </div>
  );
};

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      title: 'Data Visualization',
      description: 'Interactive charts, maps, and dashboards for exploring health data across demographics, time periods, and geographic regions.'
    },
    {
      title: 'Statistical Analysis',
      description: 'Comprehensive statistical tools for correlation analysis, trend identification, and pattern recognition in health datasets.'
    },
    {
      title: 'Predictive Models',
      description: 'Machine learning models that forecast health outcomes based on historical trends and demographic factors.'
    }
  ];

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-light text-gold-400 mb-6 text-center">
        Data Science <span className="font-medium">& Analysis Methods</span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <FeatureCard 
            key={index} 
            title={feature.title} 
            description={feature.description} 
          />
        ))}
      </div>
    </div>
  );
};
