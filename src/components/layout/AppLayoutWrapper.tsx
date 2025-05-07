
import React from 'react';
import { DashboardLayout } from './DashboardLayout';

interface AppLayoutWrapperProps {
  children: React.ReactNode;
  skipLayout?: boolean;
}

export const AppLayoutWrapper: React.FC<AppLayoutWrapperProps> = ({ children, skipLayout = false }) => {
  if (skipLayout) {
    return <div className="art-deco-theme bg-gradient-to-br from-midnight-900 to-midnight-950 min-h-screen">{children}</div>;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};
