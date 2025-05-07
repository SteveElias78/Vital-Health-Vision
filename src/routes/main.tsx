import React from 'react';
import { RouteObject } from 'react-router-dom';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Datasets from '@/pages/Datasets';
import DatasetDetails from '@/pages/DatasetDetails';
import NewDataset from '@/pages/NewDataset';
import ApiKeys from '@/pages/ApiKeys';
import Auth from '@/pages/Auth';
import FormShowcase from "@/pages/FormShowcase";

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
    element: <DatasetDetails />,
  },
  {
    path: "/datasets/new",
    element: <NewDataset />,
  },
  {
    path: "/api-keys",
    element: <ApiKeys />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "form-showcase",
    element: <FormShowcase />,
  },
];

export default routes;
