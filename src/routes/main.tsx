
import React from 'react';
import { Route } from 'react-router-dom';
import { AppLayoutWrapper } from '@/components/layout';
import Index from "../pages/Index";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import HealthMetrics from "../pages/HealthMetrics";
import Demographics from "../pages/Demographics";
import Geography from "../pages/Geography";
import Reports from "../pages/Reports";
import Explore from "../pages/Explore";
import Predict from "../pages/Predict";
import Settings from "../pages/Settings";
import About from "../pages/About";

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
