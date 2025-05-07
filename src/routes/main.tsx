import React from 'react';
import { Route } from 'react-router-dom';
import { AppLayoutWrapper } from '@/components/layout';
import Home from "../pages/Home";
import About from "../pages/About";
import Auth from "../pages/Auth";
import Dashboard from "@/pages/Dashboard";
import DatasetExplorer from "@/pages/DatasetExplorer";

// Define the main routes for the application
export const MainRoutes = [
  <Route key="home" path="/" element={<Home />} />,
  <Route key="about" path="/about" element={<About />} />,
  <Route key="auth" path="/auth" element={<Auth />} />,
  <Route key="dashboard" path="/dashboard" element={<Dashboard />} />,
  <Route key="dataset-explorer" path="/dataset-explorer" element={<DatasetExplorer />} />,
];
