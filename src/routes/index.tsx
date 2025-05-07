
import React from 'react';
import { Route } from 'react-router-dom';
import { AppLayoutWrapper } from '@/components/layout';

// Import pages
import Index from "../pages/Index";
import Home from "../pages/Home";
import Explore from "../pages/Explore";
import Predict from "../pages/Predict";
import About from "../pages/About";
import NotFound from "../pages/NotFound";
import Datasets from "../pages/Datasets";
import NewDataset from "../pages/NewDataset";
import EditDataset from "../pages/EditDataset";
import DatasetView from "../pages/DatasetView";
import DatasetFields from "../pages/DatasetFields";
import DatasetDataView from "../pages/DatasetDataView";
import Auth from "../pages/Auth";

// Dashboard related pages
import Dashboard from "../pages/Dashboard";
import HealthMetrics from "../pages/HealthMetrics";
import Demographics from "../pages/Demographics";
import Geography from "../pages/Geography";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";
import Login from "../pages/Login";
import Register from "../pages/Register";

export const AuthRoutes = [
  <Route 
    key="login"
    path="/login" 
    element={
      <AppLayoutWrapper skipLayout>
        <Login />
      </AppLayoutWrapper>
    } 
  />,
  <Route 
    key="register"
    path="/register" 
    element={
      <AppLayoutWrapper skipLayout>
        <Register />
      </AppLayoutWrapper>
    } 
  />,
  <Route 
    key="auth"
    path="/auth" 
    element={
      <AppLayoutWrapper skipLayout>
        <Auth />
      </AppLayoutWrapper>
    } 
  />
];

export const MainRoutes = [
  <Route 
    key="index"
    path="/" 
    element={
      <AppLayoutWrapper>
        <Index />
      </AppLayoutWrapper>
    } 
  />,
  <Route 
    key="home"
    path="/home" 
    element={
      <AppLayoutWrapper>
        <Home />
      </AppLayoutWrapper>
    } 
  />,
  <Route 
    key="dashboard"
    path="/dashboard" 
    element={
      <AppLayoutWrapper>
        <Dashboard />
      </AppLayoutWrapper>
    } 
  />,
  <Route 
    key="metrics"
    path="/metrics" 
    element={
      <AppLayoutWrapper>
        <HealthMetrics />
      </AppLayoutWrapper>
    } 
  />,
  <Route 
    key="demographics"
    path="/demographics" 
    element={
      <AppLayoutWrapper>
        <Demographics />
      </AppLayoutWrapper>
    } 
  />,
  <Route 
    key="geography"
    path="/geography" 
    element={
      <AppLayoutWrapper>
        <Geography />
      </AppLayoutWrapper>
    } 
  />,
  <Route 
    key="reports"
    path="/reports" 
    element={
      <AppLayoutWrapper>
        <Reports />
      </AppLayoutWrapper>
    } 
  />,
  <Route 
    key="explore"
    path="/explore" 
    element={
      <AppLayoutWrapper>
        <Explore />
      </AppLayoutWrapper>
    } 
  />,
  <Route 
    key="predict"
    path="/predict" 
    element={
      <AppLayoutWrapper>
        <Predict />
      </AppLayoutWrapper>
    } 
  />,
  <Route 
    key="settings"
    path="/settings" 
    element={
      <AppLayoutWrapper>
        <Settings />
      </AppLayoutWrapper>
    } 
  />,
  <Route 
    key="about"
    path="/about" 
    element={
      <AppLayoutWrapper>
        <About />
      </AppLayoutWrapper>
    } 
  />
];

export const DatasetRoutes = [
  <Route 
    key="datasets"
    path="/datasets" 
    element={
      <AppLayoutWrapper>
        <Datasets />
      </AppLayoutWrapper>
    } 
  />,
  <Route 
    key="datasets-new"
    path="/datasets/new" 
    element={
      <AppLayoutWrapper>
        <NewDataset />
      </AppLayoutWrapper>
    } 
  />,
  <Route 
    key="datasets-edit"
    path="/datasets/edit/:id" 
    element={
      <AppLayoutWrapper>
        <EditDataset />
      </AppLayoutWrapper>
    } 
  />,
  <Route 
    key="datasets-view"
    path="/datasets/:id" 
    element={
      <AppLayoutWrapper>
        <DatasetView />
      </AppLayoutWrapper>
    } 
  />,
  <Route 
    key="datasets-fields"
    path="/datasets/:id/fields" 
    element={
      <AppLayoutWrapper>
        <DatasetFields />
      </AppLayoutWrapper>
    } 
  />,
  <Route 
    key="datasets-data"
    path="/datasets/:id/data" 
    element={
      <AppLayoutWrapper>
        <DatasetDataView />
      </AppLayoutWrapper>
    } 
  />
];

export const NotFoundRoute = (
  <Route 
    key="not-found"
    path="*" 
    element={
      <AppLayoutWrapper>
        <NotFound />
      </AppLayoutWrapper>
    } 
  />
);

export const AppRoutes = [
  ...AuthRoutes,
  ...MainRoutes,
  ...DatasetRoutes,
  NotFoundRoute
];
