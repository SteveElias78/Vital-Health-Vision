
import React from 'react';
import { RadialHealthVizComponent } from './RadialHealthVizComponent';

export interface DataPoint {
  [key: string]: any;
}

export interface RadialHealthVizProps {
  data: DataPoint[];
  valueField?: string;
  labelField?: string;
  title?: string;
  subtitle?: string;
  colorRange?: string[];
  innerRadius?: number;
  showLabels?: boolean;
  animate?: boolean;
  onSegmentClick?: (data: DataPoint) => void;
}

const RadialHealthViz: React.FC<RadialHealthVizProps> = (props) => {
  return <RadialHealthVizComponent {...props} />;
};

export default RadialHealthViz;
