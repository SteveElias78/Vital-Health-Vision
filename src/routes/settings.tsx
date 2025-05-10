
import React from 'react';
import { RouteObject } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import Settings from '@/pages/Settings';
import AuthGuard from '@/components/layout/AuthGuard';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export const SettingsRoutes: RouteObject[] = [
  {
    path: "settings",
    element: (
      <AuthGuard requireAuth={true}>
        <DashboardLayout>
          <ErrorBoundary>
            <Settings />
          </ErrorBoundary>
        </DashboardLayout>
      </AuthGuard>
    ),
  }
];
