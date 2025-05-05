
import { useState, useEffect } from 'react';
import { useChartContext } from '@/components/charts/ChartContext';
import { DemographicDataPoint, DrilldownData } from './types';
import { demographicsData } from './data';

export function useDemographicsData() {
  const [condition, setCondition] = useState("diabetes");
  const [drilldownData, setDrilldownData] = useState<DrilldownData | null>(null);
  const [selectedBars, setSelectedBars] = useState<string[]>([]);
  
  const { filters, setFilters } = useChartContext();

  // Apply cross-filtering based on ChartContext filters
  useEffect(() => {
    if (filters.condition) {
      setCondition(filters.condition.toLowerCase());
    }
    if (filters.age) {
      setSelectedBars(filters.age);
    }
  }, [filters]);

  // Custom click handler for bars to drill down
  const handleBarClick = (data: any, barIndex: number, barKey: string) => {
    // If already in drill-down mode, go back to main view
    if (drilldownData) {
      setDrilldownData(null);
      return;
    }
    
    // Set up drill-down data
    const drilldown: DrilldownData = {
      age: data.age,
      gender: barKey === 'male' ? 'Male' : 'Female',
      data: [
        { condition: 'Diabetes', value: Math.round(data[barKey] * 0.3) },
        { condition: 'Heart Disease', value: Math.round(data[barKey] * 0.25) },
        { condition: 'Obesity', value: Math.round(data[barKey] * 0.35) },
        { condition: 'Hypertension', value: Math.round(data[barKey] * 0.2) },
      ]
    };
    
    setDrilldownData(drilldown);
    
    // Update global filters
    setFilters({
      ...filters,
      age: [data.age]
    });
  };

  // Toggle bar selection for filtering
  const handleBarSelect = (data: any) => {
    const age = data.age;
    
    if (selectedBars.includes(age)) {
      const newSelectedBars = selectedBars.filter(b => b !== age);
      setSelectedBars(newSelectedBars);
      
      // Update global filters
      setFilters({
        ...filters,
        age: newSelectedBars.length > 0 ? newSelectedBars : undefined
      });
    } else {
      const newSelectedBars = [...selectedBars, age];
      setSelectedBars(newSelectedBars);
      
      // Update global filters
      setFilters({
        ...filters,
        age: newSelectedBars
      });
    }
  };

  // Filter data based on selections
  const getFilteredData = (): DemographicDataPoint[] => {
    if (selectedBars.length === 0) return demographicsData;
    return demographicsData.filter(item => selectedBars.includes(item.age));
  };

  return {
    condition,
    setCondition,
    drilldownData,
    setDrilldownData,
    selectedBars,
    setSelectedBars,
    handleBarClick,
    handleBarSelect,
    getFilteredData
  };
}
