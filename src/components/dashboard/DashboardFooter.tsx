
import React from 'react';

export const DashboardFooter: React.FC = () => {
  return (
    <div className="mt-8 flex justify-center items-center">
      <div className="h-px w-24 bg-gradient-to-r from-transparent via-gold-500/30 to-transparent"></div>
      <div className="mx-4 w-8 h-8 rounded-full border border-gold-500/50 flex items-center justify-center">
        <div className="w-6 h-6 rounded-full bg-gold-500/20"></div>
      </div>
      <div className="h-px w-24 bg-gradient-to-r from-transparent via-gold-500/30 to-transparent"></div>
    </div>
  );
};
