
import React from 'react';
import { Route } from 'react-router-dom';
import { AppLayoutWrapper } from '@/components/layout';
import NotFound from "../pages/NotFound";

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
