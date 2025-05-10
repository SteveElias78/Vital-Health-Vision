
import React from 'react';
import { RouteObject } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import Reports from '@/pages/Reports';
import Analytics from '@/pages/Analytics';
import Geographic from '@/pages/Geographic';
import Trends from '@/pages/Trends';
import AuthGuard from '@/components/layout/AuthGuard';

export const DashboardRoutes: RouteObject[] = [
  {
    path: "trends",
    element: (
      <AuthGuard requireAuth={true}>
        <DashboardLayout>
          <Trends />
        </DashboardLayout>
      </AuthGuard>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "geographic",
    element: (
      <AuthGuard requireAuth={true}>
        <DashboardLayout>
          <Geographic />
        </DashboardLayout>
      </AuthGuard>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "reports",
    element: (
      <AuthGuard requireAuth={true} adminOnly={true}>
        <DashboardLayout>
          <Reports />
        </DashboardLayout>
      </AuthGuard>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "analytics",
    element: (
      <AuthGuard requireAuth={true} adminOnly={true}>
        <DashboardLayout>
          <Analytics />
        </DashboardLayout>
      </AuthGuard>
    ),
    errorElement: <ErrorBoundary />,
  }
];
