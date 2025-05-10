
import React from 'react';

const Geography = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gold-400">Geographic Health Mapping</h1>
      <p className="text-gold-300 mt-2">
        Visualize health trends and outcomes across different geographic regions.
      </p>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="art-deco-card p-4">
          <h2 className="art-deco-title mb-4">Regional Analysis</h2>
          <p className="art-deco-subtitle">Compare health metrics across different regions</p>
        </div>
        <div className="art-deco-card p-4">
          <h2 className="art-deco-title mb-4">Geographic Trends</h2>
          <p className="art-deco-subtitle">Explore how location impacts health outcomes</p>
        </div>
      </div>
    </div>
  );
};

export default Geography;
