
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { 
  ZoomIn, ZoomOut, Play, Pause, RefreshCw,
  MousePointer, Move
} from 'lucide-react';

interface TrendControlsProps {
  timeRange: string;
  setTimeRange: (value: string) => void;
  zoomMode: 'zoom' | 'pan' | 'select';
  setZoomMode: (value: 'zoom' | 'pan' | 'select') => void;
  isPlaying: boolean;
  handlePlayPause: () => void;
  handleReset: () => void;
}

export function TrendControls({
  timeRange,
  setTimeRange,
  zoomMode,
  setZoomMode,
  isPlaying,
  handlePlayPause,
  handleReset
}: TrendControlsProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <ToggleGroup type="single" value={timeRange} onValueChange={(value) => value && setTimeRange(value)}>
          <ToggleGroupItem value="7d" aria-label="Toggle 7 days">
            7d
          </ToggleGroupItem>
          <ToggleGroupItem value="1m" aria-label="Toggle 1 month">
            1m
          </ToggleGroupItem>
          <ToggleGroupItem value="1y" aria-label="Toggle 1 year">
            1y
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      
      <div className="flex items-center gap-2">
        <ToggleGroup type="single" value={zoomMode} onValueChange={(value: any) => value && setZoomMode(value)}>
          <ToggleGroupItem value="select" aria-label="Select mode">
            <MousePointer className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="zoom" aria-label="Zoom mode">
            <ZoomIn className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="pan" aria-label="Pan mode">
            <Move className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handlePlayPause}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {isPlaying ? 'Pause' : 'Animate'}
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleReset}
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Reset
        </Button>
      </div>
    </div>
  );
}
