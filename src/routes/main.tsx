
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { AppLayoutWrapper } from '@/components/layout';

import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import SemanticDataDashboard from '../pages/SemanticDataDashboard';
import Explore from '../pages/Explore';
import Reports from '../pages/Reports';
import About from '../pages/About';
import Settings from '../pages/Settings';
import Predict from '../pages/Predict';
import Demographics from '../pages/Demographics';
import Geography from '../pages/Geography';
import HealthMetrics from '../pages/HealthMetrics';
import ModelConfiguration from '../pages/predict/ModelConfiguration';
import PredictionResults from '../pages/predict/PredictionResults';
import DataSourceConfig from '../pages/DataSourceConfig';
import FormShowcase from '../pages/FormShowcase';
import ArtDecoComponentsShowcase from '../pages/ArtDecoComponentsShowcase';
import AuthGuard from '@/components/layout/AuthGuard';

export const MainRoutes = (
  <>
    <Route
      path="/"
      element={
        <AppLayoutWrapper>
          <Home />
        </AppLayoutWrapper>
      }
    />
    <Route
      path="/dashboard"
      element={
        <AuthGuard>
          <AppLayoutWrapper>
            <Dashboard />
          </AppLayoutWrapper>
        </AuthGuard>
      }
    />
    <Route
      path="/semantic-dashboard"
      element={
        <AuthGuard>
          <AppLayoutWrapper>
            <SemanticDataDashboard />
          </AppLayoutWrapper>
        </AuthGuard>
      }
    />
    <Route
      path="/explore"
      element={
        <AuthGuard>
          <AppLayoutWrapper>
            <Explore />
          </AppLayoutWrapper>
        </AuthGuard>
      }
    />
    <Route
      path="/reports"
      element={
        <AuthGuard>
          <AppLayoutWrapper>
            <Reports />
          </AppLayoutWrapper>
        </AuthGuard>
      }
    />
    <Route
      path="/about"
      element={
        <AppLayoutWrapper>
          <About />
        </AppLayoutWrapper>
      }
    />
    <Route
      path="/settings"
      element={
        <AuthGuard>
          <AppLayoutWrapper>
            <Settings />
          </AppLayoutWrapper>
        </AuthGuard>
      }
    />
    <Route
      path="/predict"
      element={
        <AuthGuard>
          <AppLayoutWrapper>
            <Predict />
          </AppLayoutWrapper>
        </AuthGuard>
      }
    />
    <Route
      path="/demographics"
      element={
        <AuthGuard>
          <AppLayoutWrapper>
            <Demographics />
          </AppLayoutWrapper>
        </AuthGuard>
      }
    />
    <Route
      path="/geography"
      element={
        <AuthGuard>
          <AppLayoutWrapper>
            <Geography />
          </AppLayoutWrapper>
        </AuthGuard>
      }
    />
    <Route
      path="/health-metrics"
      element={
        <AuthGuard>
          <AppLayoutWrapper>
            <HealthMetrics />
          </AppLayoutWrapper>
        </AuthGuard>
      }
    />
    <Route
      path="/predict/model-config"
      element={
        <AuthGuard>
          <AppLayoutWrapper>
            <ModelConfiguration />
          </AppLayoutWrapper>
        </AuthGuard>
      }
    />
    <Route
      path="/predict/results"
      element={
        <AuthGuard>
          <AppLayoutWrapper>
            <PredictionResults />
          </AppLayoutWrapper>
        </AuthGuard>
      }
    />
    <Route
      path="/data-source-config"
      element={
        <AuthGuard adminOnly>
          <AppLayoutWrapper>
            <DataSourceConfig />
          </AppLayoutWrapper>
        </AuthGuard>
      }
    />
    <Route
      path="/form-showcase"
      element={
        <AppLayoutWrapper>
          <FormShowcase />
        </AppLayoutWrapper>
      }
    />
    <Route
      path="/art-deco-showcase"
      element={
        <AppLayoutWrapper>
          <ArtDecoComponentsShowcase />
        </AppLayoutWrapper>
      }
    />
  </>
);
