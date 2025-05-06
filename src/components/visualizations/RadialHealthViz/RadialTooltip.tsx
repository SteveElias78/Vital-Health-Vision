
import React from 'react';
import { DataPoint } from './index';
import { formatNumber } from './utils';

interface RadialTooltipProps {
  segment: DataPoint;
  labelField: string;
  valueField: string;
}

export const RadialTooltip: React.FC<RadialTooltipProps> = ({ segment, labelField, valueField }) => {
  return (
    <div className="radial-viz-tooltip">
      <div className="tooltip-label">{segment[labelField]}</div>
      <div className="tooltip-value">
        <span className="value-number">{formatNumber(segment[valueField])}</span>
        {segment.units && <span className="value-units">{segment.units}</span>}
      </div>
      {segment.percentChange && (
        <div className={`tooltip-change ${parseFloat(segment.percentChange) >= 0 ? 'positive' : 'negative'}`}>
          {parseFloat(segment.percentChange) >= 0 ? '↑' : '↓'} {Math.abs(parseFloat(segment.percentChange))}%
        </div>
      )}
    </div>
  );
};
