
import React from 'react';
import { MockDataCategory } from '@/data/connectors/MockHybridHealthDataConnector';

interface CategorySelectorProps {
  category: MockDataCategory;
  onCategoryChange: (category: MockDataCategory) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({ category, onCategoryChange }) => {
  return (
    <div className="mb-6">
      <div className="flex space-x-4">
        <button
          className={`px-4 py-2 rounded-md text-sm transition-colors ${
            category === 'lgbtq-health' 
              ? 'bg-yellow-500 bg-opacity-20 text-yellow-500' 
              : 'bg-transparent text-gray-400 hover:text-yellow-500'
          }`}
          onClick={() => onCategoryChange('lgbtq-health')}
        >
          LGBTQ+ Health
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm transition-colors ${
            category === 'minority-health' 
              ? 'bg-yellow-500 bg-opacity-20 text-yellow-500' 
              : 'bg-transparent text-gray-400 hover:text-yellow-500'
          }`}
          onClick={() => onCategoryChange('minority-health')}
        >
          Minority Health
        </button>
      </div>
    </div>
  );
};
