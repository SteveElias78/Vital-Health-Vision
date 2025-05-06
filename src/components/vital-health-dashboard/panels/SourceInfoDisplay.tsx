
import React from 'react';
import { HealthDataMetadata } from '@/hooks/useVitalHealthData';
import { SourceInfoPanel } from '../SourceInfoPanel';

interface SourceInfoDisplayProps {
  showSourceInfo: boolean;
  displayMetadata: HealthDataMetadata | null;
  getConfidenceColor: (score: number) => string;
  formatSourceName: (id: string) => string;
}

export const SourceInfoDisplay: React.FC<SourceInfoDisplayProps> = ({
  showSourceInfo,
  displayMetadata,
  getConfidenceColor,
  formatSourceName
}) => {
  if (!showSourceInfo || !displayMetadata) {
    return null;
  }

  return (
    <div className="p-4 bg-gray-700 bg-opacity-50 border-b border-gray-600">
      <div className="flex justify-between">
        <div>
          <span className="text-gray-400 text-xs">Primary Source:</span>
          <span className="ml-2 text-white text-sm">
            {displayMetadata.source ? displayMetadata.source : 'Multiple Sources'}
          </span>
        </div>
        
        <div className="text-right">
          <span className="text-gray-400 text-xs">Confidence:</span>
          <span 
            className="ml-2 text-sm font-bold" 
            style={{ color: getConfidenceColor(displayMetadata?.reliability) }}
          >
            {Math.round((displayMetadata?.reliability || 0) * 100)}%
          </span>
        </div>
      </div>
      
      {/* Data Integrity Information */}
      <div className="mt-3">
        <div className="flex items-center">
          <div 
            className={`w-3 h-3 rounded-full mr-2 ${
              displayMetadata.integrityVerified 
                ? 'bg-green-500' 
                : 'bg-yellow-500'
            }`}
          ></div>
          <span className="text-xs text-gray-300">
            {displayMetadata.integrityVerified 
              ? 'Data integrity verified - no corruption detected' 
              : 'Data may have been altered - using alternative sources'}
          </span>
        </div>
      </div>
      
      {/* Key Info */}
      <div className="mt-3 text-xs text-gray-400">
        <p>
          NHANES data comes from physical examinations and laboratory tests, 
          while BRFSS data is self-reported through telephone surveys.
        </p>
        <p className="mt-1">
          Last updated: {displayMetadata.validation?.timestamp || 'Unknown'}
        </p>
      </div>
    </div>
  );
};
