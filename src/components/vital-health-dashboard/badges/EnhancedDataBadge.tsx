
import { Badge } from "@/components/ui/badge";

interface EnhancedDataBadgeProps {
  enhancedData: any;
}

export const EnhancedDataBadge: React.FC<EnhancedDataBadgeProps> = ({ enhancedData }) => {
  if (!enhancedData || !enhancedData.metadata || !enhancedData.metadata.enhanced) {
    return null;
  }
  
  return (
    <div className="mt-2">
      <Badge className="bg-blue-900/30 text-blue-300 border border-blue-500/50">
        Enhanced Data
      </Badge>
      {enhancedData.metadata.processingLevel && (
        <Badge className="bg-indigo-900/30 text-indigo-300 border border-indigo-500/50 ml-2">
          {enhancedData.metadata.processingLevel} Analysis
        </Badge>
      )}
    </div>
  );
};
