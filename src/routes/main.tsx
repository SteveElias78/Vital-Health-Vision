
import React from 'react';
import { RouteObject } from 'react-router-dom';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Datasets from '@/pages/Datasets';
import DatasetView from '@/pages/DatasetView';
import NewDataset from '@/pages/NewDataset';
import Auth from '@/pages/Auth';
import FormShowcase from "@/pages/FormShowcase";
import Explore from "@/pages/Explore";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/datasets",
    element: <Datasets />,
  },
  {
    path: "/datasets/:id",
    element: <DatasetView />,
  },
  {
    path: "/datasets/new",
    element: <NewDataset />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/form-showcase",
    element: <FormShowcase />,
  },
  {
    path: "/explore",
    element: <Explore />,
  },
];

export default routes;
