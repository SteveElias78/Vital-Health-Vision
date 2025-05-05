
export interface DemographicDataPoint {
  age: string;
  male: number;
  female: number;
  malePercent: number;
  femalePercent: number;
}

export interface DrilldownData {
  age: string;
  gender: string;
  data: {
    condition: string;
    value: number;
  }[];
}

export interface ChartTheme {
  light: string;
  dark: string;
}

export interface ChartConfigItem {
  label: string;
  theme: {
    light: string;
    dark: string;
  };
}

export interface ChartConfig {
  [key: string]: ChartConfigItem;
}
