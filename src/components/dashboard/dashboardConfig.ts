
import { Layout } from "react-grid-layout";
import { DataTrends } from "@/components/DataTrends";
import { DemographicsBreakdown } from "@/components/DemographicsBreakdown";
import { CorrelationMatrix } from "@/components/CorrelationMatrix";
import { HealthMap } from "@/components/HealthMap";
import { PredictionModel } from "@/components/PredictionModel";

// Define the available widgets
export const AVAILABLE_WIDGETS = [
  { id: 'trends', name: 'Data Trends', component: DataTrends },
  { id: 'demographics', name: 'Demographics Breakdown', component: DemographicsBreakdown },
  { id: 'correlation', name: 'Correlation Matrix', component: CorrelationMatrix },
  { id: 'map', name: 'Health Map', component: HealthMap },
  { id: 'prediction', name: 'Prediction Model', component: PredictionModel }
];

// Define layout templates
export const LAYOUT_TEMPLATES: Record<string, Layout[]> = {
  standard: [
    { i: 'trends', x: 0, y: 0, w: 8, h: 6 },
    { i: 'demographics', x: 8, y: 0, w: 4, h: 6 },
    { i: 'correlation', x: 0, y: 6, w: 6, h: 6 },
    { i: 'map', x: 6, y: 6, w: 6, h: 6 },
    { i: 'prediction', x: 0, y: 12, w: 12, h: 6 }
  ],
  compact: [
    { i: 'trends', x: 0, y: 0, w: 12, h: 6 },
    { i: 'demographics', x: 0, y: 6, w: 6, h: 6 },
    { i: 'correlation', x: 6, y: 6, w: 6, h: 6 },
    { i: 'map', x: 0, y: 12, w: 6, h: 6 },
    { i: 'prediction', x: 6, y: 12, w: 6, h: 6 }
  ],
  focus: [
    { i: 'trends', x: 0, y: 0, w: 12, h: 9 },
    { i: 'demographics', x: 0, y: 9, w: 4, h: 6 },
    { i: 'correlation', x: 4, y: 9, w: 4, h: 6 },
    { i: 'map', x: 8, y: 9, w: 4, h: 6 },
  ]
};

// Available color themes
export const COLOR_THEMES = [
  { id: 'default', name: 'Default', primary: 'bg-indigo-600', secondary: 'bg-pink-500' },
  { id: 'dark', name: 'Dark', primary: 'bg-gray-800', secondary: 'bg-gray-700' },
  { id: 'light', name: 'Light', primary: 'bg-gray-100', secondary: 'bg-white' },
  { id: 'health', name: 'Health', primary: 'bg-emerald-600', secondary: 'bg-teal-500' },
  { id: 'vibrant', name: 'Vibrant', primary: 'bg-purple-600', secondary: 'bg-indigo-500' }
];
