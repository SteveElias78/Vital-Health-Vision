
import React from 'react';
import { DashboardLayout } from '@/components/layout';

interface AppLayoutWrapperProps {
  children: React.ReactNode;
  skipLayout?: boolean;
}

/**
 * Wrapper component that applies the dashboard layout
 * based on the skipLayout prop
 */
export const AppLayoutWrapper: React.FC<AppLayoutWrapperProps> = ({ 
  children, 
  skipLayout = false 
}) => {
  // For pages that need no layout (like authentication pages)
  if (skipLayout) {
    return <>{children}</>;
  }

  // For main application pages with full dashboard layout
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
};
