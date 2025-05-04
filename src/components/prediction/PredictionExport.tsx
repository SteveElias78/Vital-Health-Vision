
import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Download } from 'lucide-react';
import { exportChartAsImage, exportChartDataAsCSV } from '@/components/charts/chartUtils';

interface PredictionExportProps {
  chartRef: React.RefObject<HTMLDivElement>;
  visibleData: any[];
}

export const PredictionExport: React.FC<PredictionExportProps> = ({ chartRef, visibleData }) => {
  return (
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
            onClick={() => exportChartAsImage(chartRef, 'prediction-model')}
          >
            Export as PNG
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="justify-start"
            onClick={() => exportChartDataAsCSV(visibleData, 'prediction-data')}
          >
            Export as CSV
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
