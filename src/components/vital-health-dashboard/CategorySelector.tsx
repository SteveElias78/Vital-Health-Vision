
import React from 'react';
import { HealthDataCategory } from '@/data/demo/DemoDataService';

interface CategorySelectorProps {
  category: HealthDataCategory;
  onCategoryChange: (category: string) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({ category, onCategoryChange }) => {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <button 
        className={`py-2 px-4 rounded-full text-sm font-medium ${category === 'obesity' 
          ? 'bg-yellow-500 text-gray-900' 
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
        onClick={() => onCategoryChange('obesity')}
      >
        Obesity
      </button>
      
      <button 
        className={`py-2 px-4 rounded-full text-sm font-medium ${category === 'mental-health' 
          ? 'bg-yellow-500 text-gray-900' 
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
        onClick={() => onCategoryChange('mental-health')}
      >
        Mental Health
      </button>
      
      <button 
        className={`py-2 px-4 rounded-full text-sm font-medium ${category === 'lgbtq-health' 
          ? 'bg-yellow-500 text-gray-900' 
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
        onClick={() => onCategoryChange('lgbtq-health')}
      >
        LGBTQ+ Health
      </button>
    </div>
  );
};
