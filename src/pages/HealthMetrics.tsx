
import React from 'react';

const HealthMetrics = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gold-400">Health Metrics Dashboard</h1>
      <p className="text-gold-300 mt-2">
        Explore key health indicators and metrics across various demographics and time periods.
      </p>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="art-deco-card p-4">
          <h2 className="art-deco-title mb-4">Health Trends</h2>
          <p className="art-deco-subtitle">Visualize changing health metrics over time</p>
        </div>
        <div className="art-deco-card p-4">
          <h2 className="art-deco-title mb-4">Statistical Analysis</h2>
          <p className="art-deco-subtitle">Comprehensive statistical insights on health data</p>
        </div>
      </div>
    </div>
  );
};

export default HealthMetrics;
