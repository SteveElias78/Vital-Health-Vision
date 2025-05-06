
import React from 'react';
import { HealthDataMetadata } from '@/hooks/useVitalHealthData';

interface SourceInfoPanelProps {
  metadata: HealthDataMetadata;
  formatSourceName: (id: string) => string;
  getConfidenceColor: (score: number) => string;
}

export const SourceInfoPanel: React.FC<SourceInfoPanelProps> = ({ 
  metadata, 
  formatSourceName, 
  getConfidenceColor 
}) => {
  return (
    <div className="p-4 bg-gray-700 bg-opacity-50 border-b border-gray-600">
      <div className="flex justify-between">
        <div>
          <span className="text-gray-400 text-xs">Primary Source:</span>
          <span className="ml-2 text-white text-sm">{formatSourceName(metadata.source)}</span>
          <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-600 text-gray-300">
            {metadata.sourceType === 'government' ? 'Government' : 'Alternative'}
          </span>
        </div>
        
        <div className="text-right">
          <span className="text-gray-400 text-xs">Confidence:</span>
          <span 
            className="ml-2 text-sm font-bold" 
            style={{ color: getConfidenceColor(metadata?.validation?.confidenceScore || metadata?.reliability) }}
          >
            {Math.round((metadata?.validation?.confidenceScore || metadata?.reliability) * 100)}%
          </span>
        </div>
      </div>
      
      {/* Source Switch Information */}
      {metadata?.validation?.sourceSwitch && (
        <div className="mt-3 p-3 bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-30 rounded-md">
          <p className="text-xs text-yellow-200">
            <strong>Note:</strong> Government data from {formatSourceName(metadata.validation.sourceSwitch.from)} showed anomalies and was replaced with data from {formatSourceName(metadata.validation.sourceSwitch.to)}.
          </p>
        </div>
      )}
      
      {/* Discrepancy Details */}
      {metadata?.validation?.discrepancies && metadata.validation.discrepancies.length > 0 && (
        <div className="mt-3">
          <span className="text-gray-400 text-xs">Discrepancies Detected:</span>
          <ul className="mt-1">
            {metadata.validation.discrepancies.map((discrepancy, index) => (
              <li key={index} className="text-xs text-gray-300 mt-1">
                <span className="text-red-400">
                  {formatSourceName(discrepancy.primarySource)}:
                </span> {discrepancy.discrepancies?.[0]?.primary} vs. 
                <span className="text-green-400">
                  {' '}{formatSourceName(discrepancy.comparisonSource)}:
                </span> {discrepancy.discrepancies?.[0]?.comparison} 
                {discrepancy.discrepancies?.[0]?.percentDiff && (
                  <span className="text-gray-400">
                    {' '}({Math.round(discrepancy.discrepancies[0].percentDiff)}% diff)
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
