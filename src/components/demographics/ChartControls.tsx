
import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Download } from 'lucide-react';
import { exportChartAsImage, exportChartDataAsCSV } from '@/components/charts/chartUtils';
import { DrilldownData, DemographicDataPoint } from './types';

interface ChartControlsProps {
  chartRef: React.RefObject<HTMLDivElement>;
  selectedBars: string[];
  onClearFilters: () => void;
  drilldownData: DrilldownData | null;
  getFilteredData: () => DemographicDataPoint[];
}

export function ChartControls({ 
  chartRef, 
  selectedBars, 
  onClearFilters, 
  drilldownData,
  getFilteredData 
}: ChartControlsProps) {
  return (
    <div className="flex justify-between">
      <div className="flex items-center">
        {selectedBars.length > 0 && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onClearFilters}
          >
            Clear Filters
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <div className="flex flex-col">
              <Button 
                variant="ghost" 
                size="sm" 
                className="justify-start"
                onClick={() => exportChartAsImage(chartRef, 'demographics-breakdown')}
              >
                Export as PNG
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="justify-start"
                onClick={() => drilldownData 
                  ? exportChartDataAsCSV(drilldownData.data, 'demographics-drilldown-data')
                  : exportChartDataAsCSV(getFilteredData(), 'demographics-data')
                }
              >
                Export as CSV
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
