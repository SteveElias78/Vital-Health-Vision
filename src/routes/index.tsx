
import React from 'react';
import { createBrowserRouter, RouteObject } from 'react-router-dom';

import { MainRoutes } from './main';
import { AuthRoutes } from './auth';
import { NotFoundRoute } from './notFound';
import { DatasetRoutes } from './datasets';
import { AuthProvider } from '@/hooks/useAuth';
import AuthGuard from '@/components/layout/AuthGuard';
import { AppLayoutWrapper } from '@/components/layout';

// Combine all routes into a single array to export
export const AppRoutes: RouteObject[] = [
  {
    path: '/',
    element: <AuthProvider><AuthGuard requireAuth={false}><AppLayoutWrapper>{MainRoutes}</AppLayoutWrapper></AuthGuard></AuthProvider>,
    children: MainRoutes.map(route => ({
      path: route.path === "" ? undefined : route.path,
      element: route.element
    }))
  },
  {
    path: '/',
    element: <AuthProvider><AppLayoutWrapper skipLayout>{null}</AppLayoutWrapper></AuthProvider>,
    children: AuthRoutes
  },
  {
    path: '/datasets',
    element: <AuthProvider><AuthGuard><AppLayoutWrapper>{null}</AppLayoutWrapper></AuthGuard></AuthProvider>,
    children: DatasetRoutes.map(route => ({
      // Remove the 'datasets/' prefix from each path since we're already under /datasets
      path: route.path?.replace('datasets', '').replace(/^\//, ''),
      element: route.element
    }))
  },
  NotFoundRoute,
];

const router = createBrowserRouter(AppRoutes);

export default router;
