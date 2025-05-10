import React from 'react';
import { useAuth } from '@/hooks/useAuth';

interface DemoModeIndicatorProps {
  className?: string;
}

export const DemoModeIndicator: React.FC<DemoModeIndicatorProps> = ({ className = '' }) => {
  const { isInDemoMode } = useAuth();
  
  if (!isInDemoMode) return null;
  
  return (
    <div className={`bg-amber-600 text-white px-3 py-1 rounded-md text-sm font-medium ${className}`}>
      DEMO MODE
    </div>
  );
};
