
// Type definitions for Recharts
import { CurveType } from 'recharts';

declare module 'recharts' {
  export type LegendType = 'line' | 'plainline' | 'square' | 'rect' | 'circle' | 'cross' | 'diamond' | 'star' | 'triangle' | 'wye' | 'none';

  export interface Payload {
    value: any;
    type?: LegendType;
    id?: string;
    color?: string;
    payload?: any;
    formatter?: any;
    inactive?: boolean;
    dot?: any;
  }

  export interface Props {
    content?: React.ReactElement | React.FC | any;
    iconType?: LegendType;
    iconSize?: number;
    layout?: 'horizontal' | 'vertical';
    align?: 'left' | 'center' | 'right';
    verticalAlign?: 'top' | 'middle' | 'bottom';
    payload?: Payload[];
    chartWidth?: number;
    chartHeight?: number;
    width?: number;
    height?: number;
    margin?: object;
    wrapperStyle?: object;
    onClick?: any;
    onMouseDown?: any;
    onMouseUp?: any;
    onMouseMove?: any;
    onMouseOut?: any;
    onMouseOver?: any;
    formatter?: any;
    reversed?: boolean;
    inactiveColor?: string;
  }
}
