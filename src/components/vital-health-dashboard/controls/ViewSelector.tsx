
import React from 'react';
import { Button } from '@/components/ui/button';
import { Layers, TrendingUp, GridIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ViewSelectorProps {
  dataView: string;
  setDataView: (view: string) => void;
}

export const ViewSelector: React.FC<ViewSelectorProps> = ({ dataView, setDataView }) => {
  return (
    <div className="mb-6">
      <div className="p-2 bg-gray-800 rounded-lg inline-flex">
        <ViewButton 
          isActive={dataView === 'comparison'} 
          onClick={() => setDataView('comparison')}
          icon={<Layers className="w-4 h-4 mr-1" />}
          label="Comparison"
        />
        <ViewButton 
          isActive={dataView === 'predictions'} 
          onClick={() => setDataView('predictions')}
          icon={<TrendingUp className="w-4 h-4 mr-1" />}
          label="Predictions"
        />
        <ViewButton 
          isActive={dataView === 'correlations'} 
          onClick={() => setDataView('correlations')}
          icon={<GridIcon className="w-4 h-4 mr-1" />}
          label="Correlations"
        />
      </div>
    </div>
  );
};

interface ViewButtonProps {
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const ViewButton: React.FC<ViewButtonProps> = ({
  isActive,
  onClick,
  icon,
  label
}) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={cn(
        "rounded-md",
        isActive 
          ? "bg-blue-900/30 text-blue-300 hover:bg-blue-900/40 hover:text-blue-200" 
          : "text-gray-300 hover:bg-gray-700 hover:text-gray-200"
      )}
    >
      {icon}
      {label}
    </Button>
  );
};
