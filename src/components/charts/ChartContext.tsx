
import React, { createContext, useContext, useState } from 'react';

// Types
export type FilterState = {
  condition?: string;
  timeRange?: string;
  gender?: string;
  age?: string[];
};

type ChartContextType = {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  selectedPoint: any | null;
  setSelectedPoint: React.Dispatch<React.SetStateAction<any | null>>;
  selectedDataset: string | null;
  setSelectedDataset: React.Dispatch<React.SetStateAction<string | null>>;
  isAnimating: boolean;
  setIsAnimating: React.Dispatch<React.SetStateAction<boolean>>;
  zoomDomain: { x: [number, number] | null; y: [number, number] | null } | null;
  setZoomDomain: React.Dispatch<React.SetStateAction<{ x: [number, number] | null; y: [number, number] | null } | null>>;
};

const ChartContext = createContext<ChartContextType | undefined>(undefined);

export const ChartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<FilterState>({});
  const [selectedPoint, setSelectedPoint] = useState<any | null>(null);
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [zoomDomain, setZoomDomain] = useState<{ x: [number, number] | null; y: [number, number] | null } | null>(null);

  return (
    <ChartContext.Provider
      value={{
        filters,
        setFilters,
        selectedPoint,
        setSelectedPoint,
        selectedDataset,
        setSelectedDataset,
        isAnimating,
        setIsAnimating,
        zoomDomain,
        setZoomDomain,
      }}
    >
      {children}
    </ChartContext.Provider>
  );
};

export const useChartContext = () => {
  const context = useContext(ChartContext);
  if (context === undefined) {
    throw new Error('useChartContext must be used within a ChartProvider');
  }
  return context;
};
