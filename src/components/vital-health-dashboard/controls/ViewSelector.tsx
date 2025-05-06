
import React from 'react';

interface ViewSelectorProps {
  dataView: string;
  setDataView: (view: string) => void;
}

export const ViewSelector: React.FC<ViewSelectorProps> = ({ dataView, setDataView }) => {
  return (
    <div className="mb-6 flex space-x-2">
      <button
        className={`px-4 py-2 rounded-md text-sm transition-colors ${
          dataView === 'comparison' 
            ? 'bg-yellow-500 bg-opacity-20 text-yellow-500' 
            : 'bg-transparent text-gray-400 hover:text-yellow-500'
        }`}
        onClick={() => setDataView('comparison')}
      >
        Compared View
      </button>
      <button
        className={`px-4 py-2 rounded-md text-sm transition-colors ${
          dataView === 'nhanes' 
            ? 'bg-yellow-500 bg-opacity-20 text-yellow-500' 
            : 'bg-transparent text-gray-400 hover:text-yellow-500'
        }`}
        onClick={() => setDataView('nhanes')}
      >
        NHANES (Measured)
      </button>
      <button
        className={`px-4 py-2 rounded-md text-sm transition-colors ${
          dataView === 'brfss' 
            ? 'bg-yellow-500 bg-opacity-20 text-yellow-500' 
            : 'bg-transparent text-gray-400 hover:text-yellow-500'
        }`}
        onClick={() => setDataView('brfss')}
      >
        BRFSS (Self-Reported)
      </button>
    </div>
  );
};
