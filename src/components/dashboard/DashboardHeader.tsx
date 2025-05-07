
import React from 'react';

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="border-b border-gold-500/30 pb-4">
      <h1 className="text-3xl font-light text-gold-400">
        {title}
      </h1>
      <p className="mt-2 text-gold-300/70">
        {subtitle}
      </p>
    </div>
  );
};
