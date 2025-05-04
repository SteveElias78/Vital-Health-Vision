
export interface TimeseriesDataPoint {
  date: string | number;
  value: number;
  [key: string]: any;
}

export interface ZoomDomain {
  x: [number, number] | null;
  y: [number, number] | null;
}

export interface TrendDataPoint {
  month: string;
  date: string;
  'Heart Disease': number;
  'Diabetes': number;
  'Obesity': number;
  [key: string]: string | number;
}

export interface ChartConfigEntry {
  label: string;
  theme: {
    light: string;
    dark: string;
  };
}

export interface ChartConfig {
  [key: string]: ChartConfigEntry;
}
