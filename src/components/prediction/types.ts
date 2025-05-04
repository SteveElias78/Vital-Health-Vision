
export interface ForecastDataPoint {
  year: string;
  period: number;
  actual: number | null;
  predicted: number;
  prediction_lower: number;
  prediction_upper: number;
  [key: string]: string | number | null;
}

export interface PredictionChartConfig {
  [key: string]: {
    label: string;
    theme: {
      light: string;
      dark: string;
    }
  };
}
