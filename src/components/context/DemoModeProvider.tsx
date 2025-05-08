
import React, { createContext, useContext, ReactNode } from 'react';
import { useDemoMode } from '@/hooks/useDemoMode';

// Create a context for demo mode
interface DemoModeContextType {
  isDemoMode: boolean;
  isLoading: boolean;
}

const DemoModeContext = createContext<DemoModeContextType>({
  isDemoMode: false,
  isLoading: true
});

// Provider component
interface DemoModeProviderProps {
  children: ReactNode;
}

export const DemoModeProvider: React.FC<DemoModeProviderProps> = ({ children }) => {
  const { isDemoMode, isLoading } = useDemoMode();

  return (
    <DemoModeContext.Provider value={{ isDemoMode, isLoading }}>
      {children}
    </DemoModeContext.Provider>
  );
};

// Hook to use the demo mode context
export const useDemoModeContext = () => useContext(DemoModeContext);

export default DemoModeProvider;
