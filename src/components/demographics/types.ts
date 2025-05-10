
export interface DemographicDataPoint {
  age: string;
  male: number;
  female: number;
  malePercent: number;
  femalePercent: number;
}

export interface DrilldownData {
  id: string;
  title: string;
  data: any[];
}

export interface ChartConfig {
  male: {
    theme: {
      light: string;
      dark: string;
    };
  };
  female: {
    theme: {
      light: string;
      dark: string;
    };
  };
}
