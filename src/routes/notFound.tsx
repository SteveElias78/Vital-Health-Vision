
import React from 'react';
import { RouteObject } from 'react-router-dom';
import { AppLayoutWrapper } from '@/components/layout';
import NotFound from "../pages/NotFound";

export const NotFoundRoute: RouteObject = {
  path: "*",
  element: <AppLayoutWrapper><NotFound /></AppLayoutWrapper>
};
