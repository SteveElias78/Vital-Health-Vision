
import React from 'react';
import { FileChartLine } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ArtDecoDatasetCardProps {
  title: string;
  description: string;
  source: string;
  lastUpdated: string;
  records: string;
  className?: string;
  onAnalyze: () => void;
}

const ArtDecoDatasetCard: React.FC<ArtDecoDatasetCardProps> = ({
  title,
  description,
  source,
  lastUpdated,
  records,
  className,
  onAnalyze
}) => {
  return (
    <div className={cn(
      "border border-gold-500/30 rounded-lg overflow-hidden bg-gradient-to-br from-midnight-900 to-midnight-950 h-full flex flex-col",
      className
    )}>
      <div className="p-4 border-b border-gold-500/20">
        <h3 className="text-xl font-light text-gold-400 mb-1">{title}</h3>
        <p className="text-gold-300/70 text-sm">{description}</p>
      </div>
      
      <div className="p-4 space-y-2 flex-grow">
        <div className="flex justify-between">
          <span className="text-gold-300/70 text-sm">Source:</span>
          <span className="text-gold-300 text-sm">{source}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gold-300/70 text-sm">Last Updated:</span>
          <span className="text-gold-300 text-sm">{lastUpdated}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gold-300/70 text-sm">Records:</span>
          <span className="text-gold-300 text-sm">{records}</span>
        </div>
      </div>
      
      <div className="p-4 border-t border-gold-500/20 mt-auto">
        <button 
          onClick={onAnalyze}
          className="w-full flex items-center justify-center space-x-2 bg-midnight-800 hover:bg-midnight-700 text-gold-400 border border-gold-500/30 py-2 px-4 rounded transition-colors"
        >
          <FileChartLine className="h-4 w-4" />
          <span>Analyze Dataset</span>
        </button>
      </div>
    </div>
  );
};

export default ArtDecoDatasetCard;
