
import { Button } from '@/components/ui/button';
import { TrendDataPoint } from './types';

interface SelectedPointInfoProps {
  selectedPoint: TrendDataPoint | null;
  setSelectedPoint: (point: TrendDataPoint | null) => void;
}

export function SelectedPointInfo({ selectedPoint, setSelectedPoint }: SelectedPointInfoProps) {
  if (!selectedPoint) return null;
  
  return (
    <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 border rounded-md p-2 text-xs shadow-md">
      <p className="font-bold">Selected Point: {selectedPoint.month}</p>
      <p>Heart Disease: {selectedPoint['Heart Disease']}</p>
      <p>Diabetes: {selectedPoint['Diabetes']}</p>
      <p>Obesity: {selectedPoint['Obesity']}</p>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={() => setSelectedPoint(null)}
        className="mt-2"
      >
        Clear
      </Button>
    </div>
  );
}
