
import React from 'react';

interface EnhancedDataBadgeProps {
  enhancedData: any;
}

export const EnhancedDataBadge: React.FC<EnhancedDataBadgeProps> = ({ enhancedData }) => {
  if (!enhancedData) {
    return null;
  }

  return (
    <div className="mt-2 px-3 py-1 bg-blue-900 inline-block rounded text-sm">
      Enhanced data available for this category
    </div>
  );
};
