
import React from 'react';
import { RouteObject } from 'react-router-dom';
import { AppLayoutWrapper } from '@/components/layout';
import Datasets from "../pages/Datasets";
import NewDataset from "../pages/NewDataset";
import EditDataset from "../pages/EditDataset";
import DatasetView from "../pages/DatasetView";
import DatasetFields from "../pages/DatasetFields";
import DatasetDataView from "../pages/DatasetDataView";

export const DatasetRoutes: RouteObject[] = [
  {
    path: "datasets",
    element: <Datasets />
  },
  {
    path: "datasets/new",
    element: <NewDataset />
  },
  {
    path: "datasets/edit/:id",
    element: <EditDataset />
  },
  {
    path: "datasets/:id",
    element: <DatasetView />
  },
  {
    path: "datasets/:id/fields",
    element: <DatasetFields />
  },
  {
    path: "datasets/:id/data",
    element: <DatasetDataView />
  }
];
