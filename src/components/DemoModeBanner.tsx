
import React from 'react';
import { useDemoModeContext } from './context/DemoModeProvider';
import { AlertCircle } from 'lucide-react';

const DemoModeBanner: React.FC = () => {
  const { isDemoMode } = useDemoModeContext();

  if (!isDemoMode) return null;

  return (
    <div className="bg-gradient-to-r from-amber-500/90 to-yellow-500/90 text-black p-2 text-center text-sm md:text-base">
      <div className="container mx-auto flex items-center justify-center gap-2">
        <AlertCircle className="h-4 w-4" />
        <span className="font-medium">
          Demo Mode Active — Data shown is for demonstration purposes only
        </span>
      </div>
    </div>
  );
};

export default DemoModeBanner;
