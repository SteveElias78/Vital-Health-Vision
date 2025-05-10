
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getConfidenceColor, formatSourceName } from "./utils/dataVisualizationUtils";

interface SourcesPanelProps {
  sources: any[];
  currentSourceId?: string;
}

export const SourcesPanel: React.FC<SourcesPanelProps> = ({ sources, currentSourceId }) => {
  // If no sources, don't render
  if (!sources || sources.length === 0) return null;
  
  // Find the current source if available
  const currentSource = currentSourceId 
    ? sources.find(s => s.id === currentSourceId) 
    : null;
  
  return (
    <div className="lg:col-span-1">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-2 border-b border-gray-700">
          <CardTitle className="text-gray-200 text-lg">Data Sources</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {/* Current source info if available */}
          {currentSource && (
            <div className="mb-4 pb-4 border-b border-gray-700">
              <h3 className="font-medium mb-1 flex items-center">
                <span>{currentSource.name}</span>
                <div 
                  className="ml-2 w-2 h-2 rounded-full" 
                  style={{ backgroundColor: getConfidenceColor(currentSource.reliability) }}
                ></div>
              </h3>
              <p className="text-sm text-gray-400 mb-2">{currentSource.description}</p>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                <div>
                  <span className="text-gray-400">Reliability:</span>{' '}
                  {currentSource.reliability ? `${(currentSource.reliability * 100).toFixed(0)}%` : 'N/A'}
                </div>
                <div>
                  <span className="text-gray-400">Updated:</span>{' '}
                  {currentSource.lastUpdated || 'N/A'}
                </div>
              </div>
            </div>
          )}
          
          <h3 className="text-sm font-medium mb-2">All Sources</h3>
          <div className="space-y-2">
            {sources.map(source => (
              <div key={source.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div 
                    className="w-2 h-2 rounded-full mr-2" 
                    style={{ backgroundColor: getConfidenceColor(source.reliability) }}
                  ></div>
                  <span>{formatSourceName(source.id)}</span>
                </div>
                <span className="text-xs text-gray-400">
                  {source.reliability ? `${(source.reliability * 100).toFixed(0)}%` : 'N/A'}
                </span>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-700 text-xs text-gray-400">
            <p>
              Source reliability is calculated based on methodology, documentation quality, data completeness,
              and validation against other sources.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
