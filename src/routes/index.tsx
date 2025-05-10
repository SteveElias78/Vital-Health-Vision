
import React from 'react';
import { createBrowserRouter, RouteObject } from 'react-router-dom';

import { MainRoutes } from './main';
import { AuthRoutes } from './auth';
import { NotFoundRoute } from './notFound';
import { DatasetRoutes } from './datasets';
import { AuthProvider } from '@/hooks/useAuth';
import AuthGuard from '@/components/layout/AuthGuard';
import { AppLayoutWrapper } from '@/components/layout';

// Create main route with children
const mainRoute: RouteObject = {
  path: '/',
  element: (
    <AuthProvider>
      <AuthGuard requireAuth={false}>
        <AppLayoutWrapper>
          {/* AppLayoutWrapper expects ReactNode, not RouteObject[] */}
          <></>
        </AppLayoutWrapper>
      </AuthGuard>
    </AuthProvider>
  ),
  children: MainRoutes
};

// Create auth route with children
const authRoute: RouteObject = {
  path: '/',
  element: (
    <AuthProvider>
      <AppLayoutWrapper skipLayout>
        {/* AppLayoutWrapper expects ReactNode, not RouteObject[] */}
        <></>
      </AppLayoutWrapper>
    </AuthProvider>
  ),
  children: AuthRoutes
};

// Create datasets route with children
const datasetsRoute: RouteObject = {
  path: '/datasets',
  element: (
    <AuthProvider>
      <AuthGuard>
        <AppLayoutWrapper>
          {/* AppLayoutWrapper expects ReactNode, not RouteObject[] */}
          <></>
        </AppLayoutWrapper>
      </AuthGuard>
    </AuthProvider>
  ),
  children: DatasetRoutes.map(route => ({
    // Remove the 'datasets/' prefix from each path since we're already under /datasets
    path: route.path?.replace('datasets', '').replace(/^\//, ''),
    element: route.element
  }))
};

// Combine all routes into a single array to export
export const AppRoutes: RouteObject[] = [
  mainRoute,
  authRoute,
  datasetsRoute,
  NotFoundRoute,
];

const router = createBrowserRouter(AppRoutes);

export default router;
