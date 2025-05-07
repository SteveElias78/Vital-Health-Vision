
import React from 'react';
import { DataPoint } from './index';

interface RadialTooltipProps {
  segment: DataPoint;
  labelField: string;
  valueField: string;
}

export const RadialTooltip: React.FC<RadialTooltipProps> = ({ 
  segment, 
  labelField,
  valueField
}) => {
  // Use mouse position for tooltip positioning
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      className="radial-tooltip"
      style={{
        left: position.x,
        top: position.y - 20
      }}
    >
      <div className="radial-tooltip-title">
        {segment[labelField]}
      </div>
      <div className="radial-tooltip-value">
        {segment[valueField]}{segment.units || ''}
      </div>
      {segment.percentChange && (
        <div className="radial-tooltip-subtitle">
          {segment.percentChange} from previous
        </div>
      )}
    </div>
  );
};
