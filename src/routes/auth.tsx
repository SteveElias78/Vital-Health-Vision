
import React from 'react';
import { RouteObject } from 'react-router-dom';
import { AppLayoutWrapper } from '@/components/layout';
import Login from "../pages/Login";
import Register from "../pages/Register";
import Auth from "../pages/Auth";
import DemoLogin from "@/components/demo/DemoLogin";

export const AuthRoutes: RouteObject[] = [
  {
    path: "login",
    element: <AppLayoutWrapper skipLayout><Login /></AppLayoutWrapper>
  },
  {
    path: "register",
    element: <AppLayoutWrapper skipLayout><Register /></AppLayoutWrapper>
  },
  {
    path: "auth",
    element: <AppLayoutWrapper skipLayout><Auth /></AppLayoutWrapper>
  },
  {
    path: "demo-login",
    element: <AppLayoutWrapper skipLayout><DemoLogin /></AppLayoutWrapper>
  }
];
