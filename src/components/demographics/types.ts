
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
  age?: string;
  gender?: string;
}

export interface ChartConfig {
  [key: string]: any; // Add index signature
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
