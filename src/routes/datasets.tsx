
import React from 'react';
import { Route } from 'react-router-dom';
import { AppLayoutWrapper } from '@/components/layout';
import Datasets from "../pages/Datasets";
import NewDataset from "../pages/NewDataset";
import EditDataset from "../pages/EditDataset";
import DatasetView from "../pages/DatasetView";
import DatasetFields from "../pages/DatasetFields";
import DatasetDataView from "../pages/DatasetDataView";

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
