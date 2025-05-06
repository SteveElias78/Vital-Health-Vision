
import React from 'react';
import { SourcesInfo } from '@/hooks/useVitalHealthData';

interface SourcesPanelProps {
  sources: SourcesInfo;
  currentSourceId: string | undefined;
}

export const SourcesPanel: React.FC<SourcesPanelProps> = ({ sources, currentSourceId }) => {
  // Get reliability badge variant
  const getConfidenceColor = (score: number) => {
    if (score >= 0.85) return '#4cd137'; // High confidence
    if (score >= 0.7) return '#fbc531';  // Medium confidence
    return '#e84118';                   // Low confidence
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
      <h3 className="text-lg font-medium text-yellow-500 mb-4">Data Source Information</h3>
      
      {/* Government Sources */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-300 mb-2">Government Sources</h4>
        <div className="space-y-2">
          {sources.government.map((source) => (
            <div 
              key={source.id} 
              className={`p-3 rounded-md text-sm ${
                currentSourceId === source.id 
                  ? 'bg-yellow-500 bg-opacity-20 border border-yellow-500 border-opacity-30' 
                  : 'bg-gray-700 bg-opacity-50'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{source.name}</span>
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: getConfidenceColor(source.reliability) }}
                ></div>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Reliability: {Math.round(source.reliability * 100)}%
              </div>
              <div className="text-xs text-gray-400 mt-1 flex flex-wrap">
                {source.categories.map((cat) => (
                  <span 
                    key={cat} 
                    className="mr-1 mb-1 px-1.5 py-0.5 bg-gray-600 bg-opacity-50 rounded-sm"
                  >
                    {cat}
                  </span>
                ))}
              </div>
              
              {/* Integrity Warning */}
              {source.status && source.status.integrityVerified === false && (
                <div className="mt-2 text-xs text-red-300">
                  ⚠️ Some data from this source may have been altered
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Alternative Sources */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-300 mb-2">Alternative Sources</h4>
        <div className="space-y-2">
          {sources.alternative.map((source) => (
            <div 
              key={source.id} 
              className={`p-3 rounded-md text-sm ${
                currentSourceId === source.id 
                  ? 'bg-yellow-500 bg-opacity-20 border border-yellow-500 border-opacity-30' 
                  : 'bg-gray-700 bg-opacity-50'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{source.name}</span>
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: getConfidenceColor(source.reliability) }}
                ></div>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Reliability: {Math.round(source.reliability * 100)}%
              </div>
              <div className="text-xs text-gray-400 mt-1 flex flex-wrap">
                {source.categories.map((cat) => (
                  <span 
                    key={cat} 
                    className="mr-1 mb-1 px-1.5 py-0.5 bg-gray-600 bg-opacity-50 rounded-sm"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Compromised Categories */}
      <div className="mt-4 p-3 bg-gray-700 bg-opacity-30 rounded-md">
        <h4 className="text-sm font-medium text-gray-300 mb-2">Data Categories Requiring Alternative Sources</h4>
        <div className="flex flex-wrap">
          {sources.compromisedCategories.map((category) => (
            <span 
              key={category}
              className="mr-1 mb-1 px-2 py-1 bg-red-900 bg-opacity-30 border border-red-800 border-opacity-30 rounded-md text-xs text-red-200"
            >
              {category}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">
          These categories may have been corrupted in government sources and are fetched from alternative trusted sources.
        </p>
      </div>
    </div>
  );
};
