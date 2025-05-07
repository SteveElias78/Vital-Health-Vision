
import React from 'react';

export const DashboardFooter: React.FC = () => {
  return (
    <footer className="art-deco-footer">
      <div className="container mx-auto text-center py-3">
        <p className="text-gold-300/70 text-sm">Vital Health Vision • The Art of Health Analytics</p>
        
        <div className="flex justify-center mt-3 space-x-3">
          {['About', 'Documentation', 'Privacy', 'Terms'].map(item => (
            <a 
              key={item}
              href="#" 
              className="text-xs text-gold-400/70 hover:text-gold-400 transition-colors duration-200"
            >
              {item}
            </a>
          ))}
        </div>
        
        <div className="art-deco-divider max-w-xs mx-auto my-3"></div>
        
        <p className="text-gold-300/50 text-xs">
          © 2025 Vital Health Vision. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
