
import React from 'react';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  subtitle
}) => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-light text-gold-400">{title}</h1>
      {subtitle && (
        <p className="text-gold-300/70 mt-2">{subtitle}</p>
      )}
    </div>
  );
};
