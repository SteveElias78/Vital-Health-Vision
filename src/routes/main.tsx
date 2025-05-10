
import React from 'react';
import { RouteObject } from 'react-router-dom';
import { AppLayoutWrapper } from '@/components/layout';
import AuthGuard from '@/components/layout/AuthGuard';

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
    element: <Home />
  },
  {
    path: "dashboard",
    element: <AuthGuard><Dashboard /></AuthGuard>
  },
  {
    path: "semantic-dashboard",
    element: <AuthGuard><SemanticDataDashboard /></AuthGuard>
  },
  {
    path: "explore",
    element: <AuthGuard><Explore /></AuthGuard>
  },
  {
    path: "reports",
    element: <AuthGuard><Reports /></AuthGuard>
  },
  {
    path: "about",
    element: <About />
  },
  {
    path: "settings",
    element: <AuthGuard><Settings /></AuthGuard>
  },
  {
    path: "predict",
    element: <AuthGuard><Predict /></AuthGuard>
  },
  {
    path: "demographics",
    element: <AuthGuard><Demographics /></AuthGuard>
  },
  {
    path: "geography",
    element: <AuthGuard><Geography /></AuthGuard>
  },
  {
    path: "health-metrics",
    element: <AuthGuard><HealthMetrics /></AuthGuard>
  },
  {
    path: "predict/model-config",
    element: <AuthGuard><ModelConfigurationWrapper /></AuthGuard>
  },
  {
    path: "predict/results",
    element: <AuthGuard><PredictionResultsWrapper /></AuthGuard>
  },
  {
    path: "data-source-config",
    element: <AuthGuard adminOnly><DataSourceConfig /></AuthGuard>
  },
  {
    path: "form-showcase",
    element: <FormShowcase />
  },
  {
    path: "art-deco-showcase",
    element: <ArtDecoComponentsShowcase />
  }
];
