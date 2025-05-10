
import React from "react";

interface SourceInfoDisplayProps {
  showSourceInfo: boolean;
  displayMetadata: any;
  getConfidenceColor: (score: number) => string;
  formatSourceName: (id: string) => string;
}

export const SourceInfoDisplay: React.FC<SourceInfoDisplayProps> = ({
  showSourceInfo,
  displayMetadata,
  getConfidenceColor,
  formatSourceName
}) => {
  if (!showSourceInfo || !displayMetadata) return null;
  
  return (
    <div className="mb-4 p-4 bg-gray-800 border border-gray-700 rounded-lg">
      <h3 className="text-sm font-medium mb-2 flex items-center">
        <span>Data Source: {formatSourceName(displayMetadata.source)}</span>
        <div 
          className="ml-2 w-2 h-2 rounded-full" 
          style={{ backgroundColor: getConfidenceColor(displayMetadata.reliability || 0.8) }}
        ></div>
      </h3>
      
      <p className="text-xs text-gray-400">{displayMetadata.description}</p>
      
      <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-gray-300">
        <div>
          <span className="text-gray-400">Reliability:</span>{' '}
          {displayMetadata.reliability ? `${(displayMetadata.reliability * 100).toFixed(0)}%` : 'N/A'}
        </div>
        <div>
          <span className="text-gray-400">Updated:</span>{' '}
          {displayMetadata.updated || 'N/A'}
        </div>
        <div>
          <span className="text-gray-400">Category:</span>{' '}
          {displayMetadata.category || 'N/A'}
        </div>
      </div>
    </div>
  );
};
