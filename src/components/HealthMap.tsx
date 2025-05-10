
import React from 'react';

export const HealthMap: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full p-6 bg-gray-100 rounded-lg">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Geographic Health Data Map</h3>
        <p className="text-sm text-gray-600">
          This is a placeholder for the interactive health map.
          In the full implementation, this would display regional health data.
        </p>
      </div>
    </div>
  );
};
