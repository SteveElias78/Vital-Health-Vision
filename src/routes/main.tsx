import React from 'react';
import { RouteObject } from 'react-router-dom';
import Home from "../pages/Home";
import About from "../pages/About";
import Auth from "../pages/Auth";
import Dashboard from "@/pages/Dashboard";
import DatasetExplorer from "@/pages/DatasetExplorer";
import Datasets from "@/pages/Datasets";

// Define the main routes for the application
export const MainRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/about",
    element: <About />
  },
  {
    path: "/auth",
    element: <Auth />
  },
  {
    path: "/dashboard",
    element: <Dashboard />
  },
  {
    path: "/dataset-explorer",
    element: <DatasetExplorer />
  },
  {
    path: "/datasets",
    element: <Datasets />
  }
];
