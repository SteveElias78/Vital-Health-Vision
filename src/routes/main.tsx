
import React from 'react';
import { RouteObject } from 'react-router-dom';
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
import { ModelConfiguration } from '../pages/predict/ModelConfiguration';
import { PredictionResults } from '../pages/predict/PredictionResults';
import DataSourceConfig from '../pages/DataSourceConfig';
import FormShowcase from '../pages/FormShowcase';
import ArtDecoComponentsShowcase from '../pages/ArtDecoComponentsShowcase';
import AuthGuard from '@/components/layout/AuthGuard';

// Helper component to pass required props to ModelConfiguration
const ModelConfigurationWrapper = () => {
  const handleRunPrediction = (config: any) => {
    console.log("Prediction running with config:", config);
    // Implement prediction logic or state management
  };

  return <ModelConfiguration onRunPrediction={handleRunPrediction} />;
};

// Helper component to pass required props to PredictionResults
const PredictionResultsWrapper = () => {
  // In a real implementation, this would come from state management
  const predictionResults = false; // Default to no results initially
  
  return <PredictionResults predictionResults={predictionResults} />;
};

export const MainRoutes: RouteObject[] = [
  {
    path: "",
    element: (
      <AppLayoutWrapper>
        <Home />
      </AppLayoutWrapper>
    )
  },
  {
    path: "dashboard",
    element: (
      <AuthGuard>
        <AppLayoutWrapper>
          <Dashboard />
        </AppLayoutWrapper>
      </AuthGuard>
    )
  },
  {
    path: "semantic-dashboard",
    element: (
      <AuthGuard>
        <AppLayoutWrapper>
          <SemanticDataDashboard />
        </AppLayoutWrapper>
      </AuthGuard>
    )
  },
  {
    path: "explore",
    element: (
      <AuthGuard>
        <AppLayoutWrapper>
          <Explore />
        </AppLayoutWrapper>
      </AuthGuard>
    )
  },
  {
    path: "reports",
    element: (
      <AuthGuard>
        <AppLayoutWrapper>
          <Reports />
        </AppLayoutWrapper>
      </AuthGuard>
    )
  },
  {
    path: "about",
    element: (
      <AppLayoutWrapper>
        <About />
      </AppLayoutWrapper>
    )
  },
  {
    path: "settings",
    element: (
      <AuthGuard>
        <AppLayoutWrapper>
          <Settings />
        </AppLayoutWrapper>
      </AuthGuard>
    )
  },
  {
    path: "predict",
    element: (
      <AuthGuard>
        <AppLayoutWrapper>
          <Predict />
        </AppLayoutWrapper>
      </AuthGuard>
    )
  },
  {
    path: "demographics",
    element: (
      <AuthGuard>
        <AppLayoutWrapper>
          <Demographics />
        </AppLayoutWrapper>
      </AuthGuard>
    )
  },
  {
    path: "geography",
    element: (
      <AuthGuard>
        <AppLayoutWrapper>
          <Geography />
        </AppLayoutWrapper>
      </AuthGuard>
    )
  },
  {
    path: "health-metrics",
    element: (
      <AuthGuard>
        <AppLayoutWrapper>
          <HealthMetrics />
        </AppLayoutWrapper>
      </AuthGuard>
    )
  },
  {
    path: "predict/model-config",
    element: (
      <AuthGuard>
        <AppLayoutWrapper>
          <ModelConfigurationWrapper />
        </AppLayoutWrapper>
      </AuthGuard>
    )
  },
  {
    path: "predict/results",
    element: (
      <AuthGuard>
        <AppLayoutWrapper>
          <PredictionResultsWrapper />
        </AppLayoutWrapper>
      </AuthGuard>
    )
  },
  {
    path: "data-source-config",
    element: (
      <AuthGuard adminOnly>
        <AppLayoutWrapper>
          <DataSourceConfig />
        </AppLayoutWrapper>
      </AuthGuard>
    )
  },
  {
    path: "form-showcase",
    element: (
      <AppLayoutWrapper>
        <FormShowcase />
      </AppLayoutWrapper>
    )
  },
  {
    path: "art-deco-showcase",
    element: (
      <AppLayoutWrapper>
        <ArtDecoComponentsShowcase />
      </AppLayoutWrapper>
    )
  }
];
