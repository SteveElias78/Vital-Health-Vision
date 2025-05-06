
import React, { useState, useRef } from 'react';
import { DataPoint, RadialHealthVizProps } from './index';
import { useRadialVisualization } from './useRadialVisualization';
import { RadialTooltip } from './RadialTooltip';
import { useResizeObserver } from './useResizeObserver';
import "./styles.css";

export const RadialHealthVizComponent: React.FC<RadialHealthVizProps> = ({
  data = [],
  valueField = 'value',
  labelField = 'label',
  title = 'Health Insights',
  subtitle = '',
  colorRange = ['#f9ca24', '#f0932b', '#d4a010', '#c48c0c', '#a37707', '#826006'],
  innerRadius = 0.3,
  showLabels = true,
  animate = true,
  onSegmentClick = () => {}
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredSegment, setHoveredSegment] = useState<DataPoint | null>(null);
  const size = useResizeObserver(svgRef);

  // Create and update the visualization
  useRadialVisualization({
    svgRef,
    data,
    size,
    innerRadius,
    valueField,
    labelField,
    title,
    subtitle,
    colorRange,
    showLabels,
    animate,
    onSegmentClick,
    setHoveredSegment
  });

  return (
    <div className="radial-health-viz-container">
      <svg ref={svgRef} />
      {hoveredSegment && <RadialTooltip segment={hoveredSegment} labelField={labelField} valueField={valueField} />}
    </div>
  );
};
