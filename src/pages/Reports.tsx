
import React from 'react';

const Reports = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gold-400">Health Reports</h1>
      <p className="text-gold-300 mt-2">
        Generate comprehensive reports and export data for further analysis.
      </p>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="art-deco-card p-4">
          <h2 className="art-deco-title mb-4">Report Generation</h2>
          <p className="art-deco-subtitle">Create custom reports from available health data</p>
        </div>
        <div className="art-deco-card p-4">
          <h2 className="art-deco-title mb-4">Export Options</h2>
          <p className="art-deco-subtitle">Download data in various formats for external use</p>
        </div>
      </div>
    </div>
  );
};

export default Reports;
