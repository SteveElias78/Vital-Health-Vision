
import React from 'react';

const Demographics = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gold-400">Demographics Analysis</h1>
      <p className="text-gold-300 mt-2">
        Analyze health outcomes across different demographic segments and populations.
      </p>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="art-deco-card p-4">
          <h2 className="art-deco-title mb-4">Population Segments</h2>
          <p className="art-deco-subtitle">Breakdown of health metrics by demographic categories</p>
        </div>
        <div className="art-deco-card p-4">
          <h2 className="art-deco-title mb-4">Equity Analysis</h2>
          <p className="art-deco-subtitle">Insights on health disparities across populations</p>
        </div>
      </div>
    </div>
  );
};

export default Demographics;
