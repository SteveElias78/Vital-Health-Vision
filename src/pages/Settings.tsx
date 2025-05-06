
import React from 'react';

const Settings = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gold-400">Application Settings</h1>
      <p className="text-gold-300 mt-2">
        Customize your experience and configure application preferences.
      </p>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="art-deco-card p-4">
          <h2 className="art-deco-title mb-4">User Preferences</h2>
          <p className="art-deco-subtitle">Personalize your dashboard and visualization settings</p>
        </div>
        <div className="art-deco-card p-4">
          <h2 className="art-deco-title mb-4">Data Sources</h2>
          <p className="art-deco-subtitle">Configure connections to health data repositories</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
