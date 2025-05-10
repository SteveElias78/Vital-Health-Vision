
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
    element: (
      <AppLayoutWrapper>
        <Datasets />
      </AppLayoutWrapper>
    )
  },
  {
    path: "datasets/new",
    element: (
      <AppLayoutWrapper>
        <NewDataset />
      </AppLayoutWrapper>
    )
  },
  {
    path: "datasets/edit/:id",
    element: (
      <AppLayoutWrapper>
        <EditDataset />
      </AppLayoutWrapper>
    )
  },
  {
    path: "datasets/:id",
    element: (
      <AppLayoutWrapper>
        <DatasetView />
      </AppLayoutWrapper>
    )
  },
  {
    path: "datasets/:id/fields",
    element: (
      <AppLayoutWrapper>
        <DatasetFields />
      </AppLayoutWrapper>
    )
  },
  {
    path: "datasets/:id/data",
    element: (
      <AppLayoutWrapper>
        <DatasetDataView />
      </AppLayoutWrapper>
    )
  }
];
