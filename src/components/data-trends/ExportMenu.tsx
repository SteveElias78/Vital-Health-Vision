
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Download } from 'lucide-react';
import { exportChartAsImage, exportChartDataAsCSV } from '@/components/charts/chartUtils';
import { RefObject } from 'react';
import { TrendDataPoint } from './types';

interface ExportMenuProps {
  chartRef: RefObject<HTMLDivElement>;
  visibleData: TrendDataPoint[];
}

export function ExportMenu({ chartRef, visibleData }: ExportMenuProps) {
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
            onClick={() => exportChartAsImage(chartRef, 'health-trends')}
          >
            Export as PNG
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="justify-start"
            onClick={() => exportChartDataAsCSV(visibleData, 'health-trends-data')}
          >
            Export as CSV
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
