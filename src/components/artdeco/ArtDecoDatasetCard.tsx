
import React from 'react';
import { Database, Calendar, Tag, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ArtDecoDatasetCardProps {
  title: string;
  description: string;
  source: string;
  lastUpdated: string;
  recordCount?: number;
  records?: string; // Added for backward compatibility
  tags?: string[];
  authorName?: string;
  imageUrl?: string;
  onClick?: () => void;
  onAnalyze?: () => void; // Added for compatibility
  className?: string;
}

export const ArtDecoDatasetCard: React.FC<ArtDecoDatasetCardProps> = ({
  title,
  description,
  source,
  lastUpdated,
  recordCount,
  records, // Added for backward compatibility
  tags = [],
  authorName,
  imageUrl,
  onClick,
  onAnalyze,
  className
}) => {
  // Use records string if recordCount is not provided
  const displayRecords = recordCount !== undefined 
    ? recordCount.toLocaleString() 
    : records || 'Unknown';

  return (
    <div 
      className={cn(
        "bg-gradient-to-br from-midnight-900 to-midnight-950 border border-gold-500/30 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:border-gold-500/60 hover:shadow-[0_0_15px_rgba(255,199,0,0.2)]",
        className,
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      {imageUrl && (
        <div className="h-32 w-full bg-midnight-800 overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover opacity-80"
          />
        </div>
      )}
      
      <div className="p-5">
        <h3 className="text-xl font-light text-gold-400 mb-2">{title}</h3>
        <p className="text-sm text-gold-300/70 mb-4 line-clamp-2">{description}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center">
            <Database className="h-4 w-4 text-gold-400/70 mr-2" />
            <span className="text-xs text-gold-300">
              {source}
            </span>
          </div>
          
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-gold-400/70 mr-2" />
            <span className="text-xs text-gold-300">
              {lastUpdated}
            </span>
          </div>
        </div>
        
        <div className="mb-4 bg-midnight-800/50 rounded p-2 text-center">
          <span className="text-sm text-gold-400">{displayRecords}</span>
          <span className="text-xs text-gold-300/70 ml-1">records</span>
        </div>
        
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <div key={index} className="text-xs flex items-center px-2 py-0.5 rounded bg-gold-500/10 border border-gold-500/30 text-gold-300">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </div>
            ))}
          </div>
        )}
        
        {authorName && (
          <div className="flex items-center pt-4 mt-4 border-t border-gold-500/20">
            <div className="h-6 w-6 rounded-full border border-gold-500/30 flex items-center justify-center bg-midnight-800 mr-2">
              <User className="h-3 w-3 text-gold-400/70" />
            </div>
            <span className="text-xs text-gold-300">{authorName}</span>
          </div>
        )}

        {onAnalyze && (
          <div className="pt-4 mt-4 border-t border-gold-500/20">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onAnalyze();
              }}
              className="w-full flex items-center justify-center space-x-2 bg-midnight-800 hover:bg-midnight-700 text-gold-400 border border-gold-500/30 py-2 px-4 rounded transition-colors"
            >
              <Database className="h-4 w-4 mr-1" />
              <span>Analyze Dataset</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtDecoDatasetCard;
