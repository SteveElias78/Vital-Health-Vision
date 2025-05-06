
import React from 'react';
import { formatValue } from './utils';

interface ActiveSegmentDetailsProps {
  segment: Record<string, any>;
  metricField: string;
  categoryField: string;
}

export const ActiveSegmentDetails: React.FC<ActiveSegmentDetailsProps> = ({ 
  segment, 
  metricField, 
  categoryField 
}) => {
  return (
    <div className="active-segment-details">
      <h4>{segment[categoryField]}</h4>
      <div className="detail-value">
        <span className="detail-label">Value:</span>
        <span>{formatValue(segment[metricField])}</span>
      </div>
      {segment.percentChange !== undefined && (
        <div className={`detail-change ${parseFloat(segment.percentChange) >= 0 ? 'positive' : 'negative'}`}>
          <span className="detail-label">Change:</span>
          <span>
            {parseFloat(segment.percentChange) >= 0 ? '▲' : '▼'} 
            {Math.abs(parseFloat(segment.percentChange))}%
          </span>
        </div>
      )}
    </div>
  );
};
