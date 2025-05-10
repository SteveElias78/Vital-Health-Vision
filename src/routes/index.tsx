
import React from 'react';
import { createBrowserRouter, RouteObject } from 'react-router-dom';

import { MainRoutes } from './main';
import { AuthRoutes } from './auth';
import { NotFoundRoute } from './notFound';
import { DatasetRoutes } from './datasets';
import { AuthProvider } from '@/hooks/useAuth';
import AuthGuard from '@/components/layout/AuthGuard';

// Combine all routes into a single array to export
export const AppRoutes: RouteObject[] = [
  {
    path: '/',
    element: (
      <AuthProvider>
        <AuthGuard requireAuth={false}>
          {MainRoutes}
        </AuthGuard>
      </AuthProvider>
    ),
  },
  {
    path: '/',
    element: (
      <AuthProvider>
        {AuthRoutes}
      </AuthProvider>
    ),
  },
  {
    path: '/',
    element: (
      <AuthProvider>
        <AuthGuard>
          {DatasetRoutes}
        </AuthGuard>
      </AuthProvider>
    ),
  },
  NotFoundRoute,
];

const router = createBrowserRouter(AppRoutes);

export default router;
