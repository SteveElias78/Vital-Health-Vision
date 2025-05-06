
import React from 'react';
import { ArtDecoThemeProvider } from '@/components/theme';
import { DashboardLayout } from '@/components/layout';

interface AppLayoutWrapperProps {
  children: React.ReactNode;
  skipLayout?: boolean;
}

/**
 * Wrapper component that applies either the full dashboard layout
 * or just the theme provider based on the skipLayout prop
 */
export const AppLayoutWrapper: React.FC<AppLayoutWrapperProps> = ({ 
  children, 
  skipLayout = false 
}) => {
  // For pages that need the theme but not the full dashboard layout
  if (skipLayout) {
    return (
      <ArtDecoThemeProvider>
        {children}
      </ArtDecoThemeProvider>
    );
  }

  // For main application pages with full dashboard layout
  return (
    <ArtDecoThemeProvider>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </ArtDecoThemeProvider>
  );
};
