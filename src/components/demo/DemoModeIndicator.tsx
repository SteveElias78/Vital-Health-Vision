
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { DemoIndicatorProps } from '@/types/artdeco';

export const DemoModeIndicator: React.FC<DemoIndicatorProps> = ({ 
  className,
}) => {
  const { isDemo, demoRole } = useAuth();
  
  if (!isDemo) return null;
  
  const roleStyles = demoRole === 'administrator' 
    ? 'bg-red-800/50 text-red-300 border-red-500/50 hover:bg-red-700/50' 
    : 'bg-blue-800/50 text-blue-300 border-blue-500/50 hover:bg-blue-700/50';
  
  return (
    <Badge 
      className={cn(
        "uppercase px-2 py-1 text-xs font-medium border animate-pulse",
        roleStyles,
        className
      )}
      variant="outline"
    >
      Demo Mode: {demoRole === 'administrator' ? 'Admin' : 'Researcher'}
    </Badge>
  );
};

export default DemoModeIndicator;
