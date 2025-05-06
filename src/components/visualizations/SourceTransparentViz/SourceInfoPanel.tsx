
import React from 'react';
import { SourceInfo } from './SourceTransparentViz';
import { formatSourceName, getConfidenceColor } from './utils';

interface SourceInfoPanelProps {
  sourceInfo: SourceInfo;
  confidenceScore: number;
  onClose: () => void;
}

export const SourceInfoPanel: React.FC<SourceInfoPanelProps> = ({ 
  sourceInfo, 
  confidenceScore, 
  onClose 
}) => {
  return (
    <div className="source-info-panel">
      <div className="source-panel-header">
        <h3>Data Source Information</h3>
        <button 
          className="close-panel-button"
          onClick={onClose}
        >
          ×
        </button>
      </div>
      
      <div className="source-panel-content">
        <div className="source-item">
          <div className="source-label">Primary Source:</div>
          <div className="source-value">
            {formatSourceName(sourceInfo.primary || 'Unknown')}
          </div>
        </div>
        
        <div className="source-item">
          <div className="source-label">Retrieved:</div>
          <div className="source-value">
            {sourceInfo.fetchedAt 
              ? new Date(sourceInfo.fetchedAt).toLocaleString() 
              : 'Unknown'
            }
          </div>
        </div>
        
        <div className="source-item">
          <div className="source-label">Confidence Score:</div>
          <div className="source-value">
            <div className="confidence-bar-container">
              <div 
                className="confidence-bar"
                style={{ 
                  width: `${confidenceScore * 100}%`,
                  backgroundColor: getConfidenceColor(confidenceScore)
                }}
              ></div>
            </div>
            <div className="confidence-value">
              {Math.round(confidenceScore * 100)}%
            </div>
          </div>
        </div>
        
        {sourceInfo.validation && sourceInfo.validation.discrepancies && (
          <div className="source-item">
            <div className="source-label">Source Discrepancies:</div>
            <div className="source-value">
              {sourceInfo.validation.discrepancies.length > 0
                ? `${sourceInfo.validation.discrepancies.length} found`
                : 'None found'
              }
            </div>
          </div>
        )}
        
        {sourceInfo.sources && sourceInfo.sources.length > 0 && (
          <div className="source-item sources-list">
            <div className="source-label">All Sources:</div>
            <ul>
              {sourceInfo.sources.map((source, index) => (
                <li key={index} className={`source-${source.status}`}>
                  {formatSourceName(source.source)}
                  {source.status === 'success' && <span className="source-check">✓</span>}
                  {source.status === 'error' && <span className="source-x">✗</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="source-disclaimer">
          <p>
            This data visualization combines information from multiple trusted health data sources. 
            The CDC may no longer provide this specific data, so alternative sources have been used.
          </p>
        </div>
      </div>
    </div>
  );
};
