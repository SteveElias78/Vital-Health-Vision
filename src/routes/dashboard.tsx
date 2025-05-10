
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
          <ErrorBoundary>
            <Trends />
          </ErrorBoundary>
        </DashboardLayout>
      </AuthGuard>
    ),
  },
  {
    path: "geographic",
    element: (
      <AuthGuard requireAuth={true}>
        <DashboardLayout>
          <ErrorBoundary>
            <Geographic />
          </ErrorBoundary>
        </DashboardLayout>
      </AuthGuard>
    ),
  },
  {
    path: "reports",
    element: (
      <AuthGuard requireAuth={true} adminOnly={true}>
        <DashboardLayout>
          <ErrorBoundary>
            <Reports />
          </ErrorBoundary>
        </DashboardLayout>
      </AuthGuard>
    ),
  },
  {
    path: "analytics",
    element: (
      <AuthGuard requireAuth={true} adminOnly={true}>
        <DashboardLayout>
          <ErrorBoundary>
            <Analytics />
          </ErrorBoundary>
        </DashboardLayout>
      </AuthGuard>
    ),
  }
];
