
import React from 'react';

export const DashboardHeader: React.FC = () => {
  return (
    <header className="bg-gray-900 border-b border-yellow-500 border-opacity-30 py-4 px-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-yellow-500">Vital Health Vision</h1>
            <p className="text-xs text-yellow-500 opacity-70">Hybrid Data Dashboard</p>
          </div>
        </div>
      </div>
    </header>
  );
};
