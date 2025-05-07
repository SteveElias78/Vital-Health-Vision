
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Edit, Eye, Globe, Lock, FileChartLine } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface DatasetCardProps {
  id: string;
  name: string;
  description: string | null;
  source: string;
  tags: string[];
  isPublic: boolean;
  onDelete: (id: string) => Promise<void>;
  onTogglePublic: (id: string, currentStatus: boolean) => Promise<void>;
}

export const DatasetCard: React.FC<DatasetCardProps> = ({
  id,
  name,
  description,
  source,
  tags,
  isPublic,
  onDelete,
  onTogglePublic
}) => {
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this dataset?")) {
      try {
        await onDelete(id);
      } catch (error) {
        console.error("Error deleting dataset:", error);
        toast.error("Failed to delete dataset");
      }
    }
  };
  
  const handleTogglePublic = async () => {
    try {
      await onTogglePublic(id, isPublic);
    } catch (error) {
      console.error("Error toggling dataset visibility:", error);
      toast.error("Failed to update dataset visibility");
    }
  };

  return (
    <motion.div 
      className="art-deco-card relative group overflow-hidden"
      whileHover={{ boxShadow: '0 0 15px rgba(255, 199, 0, 0.3)' }}
      transition={{ duration: 0.3 }}
    >
      {/* Decorative corner elements */}
      <div className="art-deco-corner art-deco-corner-tl"></div>
      <div className="art-deco-corner art-deco-corner-tr"></div>
      <div className="art-deco-corner art-deco-corner-bl"></div>
      <div className="art-deco-corner art-deco-corner-br"></div>
      
      {/* Art Deco pattern background (very subtle) */}
      <div className="absolute inset-0 opacity-5 pointer-events-none art-deco-pattern"></div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-light text-xl tracking-wider text-gold-400 line-clamp-1">{name}</h3>
          <Badge variant={isPublic ? "default" : "outline"} className="art-deco-badge">
            {isPublic ? <Globe className="h-3 w-3 mr-1" /> : <Lock className="h-3 w-3 mr-1" />}
            {isPublic ? 'Public' : 'Private'}
          </Badge>
        </div>
        
        <p className="text-sm text-gold-300/80 mb-3 line-clamp-2">
          {description || 'No description'}
        </p>
        
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tags && tags.map((tag, i) => (
            <Badge key={i} variant="secondary" className="text-xs bg-midnight-800 text-gold-300 border border-gold-500/30">
              {tag}
            </Badge>
          ))}
          {(!tags || tags.length === 0) && (
            <span className="text-xs text-gold-400/50">No tags</span>
          )}
        </div>
        
        <div className="text-xs text-gold-400/70 mb-4">
          Source: {source}
        </div>
        
        <div className="border-t border-gold-500/30 pt-3 mt-auto">
          <div className="flex justify-between">
            <div className="flex space-x-2">
              <Button size="sm" variant="ghost" asChild>
                <a href={`/datasets/${id}`}>
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </a>
              </Button>
              <Button size="sm" variant="ghost" asChild>
                <a href={`/datasets/edit/${id}`}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </a>
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={handleTogglePublic}
              >
                {isPublic ? 'Make Private' : 'Make Public'}
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="hover:text-red-400"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Button 
            variant="secondary" 
            className="w-full mt-3 group-hover:bg-gold-500/20 transition-colors"
          >
            <FileChartLine className="h-4 w-4 mr-2" />
            Analyze Dataset
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
