
// src/components/layout/AppLayoutWrapper.tsx

import React from 'react';
import { ArtDecoLayout } from './ArtDecoLayout';
import { useLocation } from 'react-router-dom';

interface AppLayoutWrapperProps {
  children: React.ReactNode;
  skipLayout?: boolean; // Make it optional with '?' if the layout should be applied by default
}

export const AppLayoutWrapper: React.FC<AppLayoutWrapperProps> = ({ children, skipLayout }) => {
  const location = useLocation();

  // List of paths that should not use the ArtDecoLayout
  const noLayoutPaths = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/auth',
    // Add any other paths that should not use the layout
  ];

  // Check if current path should use layout (using the prop now)
  const shouldUseLayout = skipLayout === undefined ?
    !noLayoutPaths.some(path =>
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    ) :
    !skipLayout;

  return shouldUseLayout ? (
    <ArtDecoLayout>{children}</ArtDecoLayout>
  ) : (
    // For auth pages, just render children without the layout
    <>{children}</>
  );
};

export default AppLayoutWrapper;
