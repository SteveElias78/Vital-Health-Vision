
import React from 'react';

export const DashboardFooter: React.FC = () => {
  return (
    <footer className="border-t border-gold-500/30 bg-midnight-900 py-2 text-center text-xs text-gold-300/70">
      <div className="flex items-center justify-center space-x-2">
        <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent"></div>
        <span>Vital Health Vision • The Art of Health Analytics</span>
        <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent"></div>
      </div>
    </footer>
  );
};
