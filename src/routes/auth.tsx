
import React from 'react';
import { Route } from 'react-router-dom';
import { AppLayoutWrapper } from '@/components/layout';
import Login from "../pages/Login";
import Register from "../pages/Register";
import Auth from "../pages/Auth";
import DemoLogin from "@/components/demo/DemoLogin";
import AuthGuard from "@/components/layout/AuthGuard";

export const AuthRoutes = [
  <Route 
    key="login"
    path="/login" 
    element={
      <AppLayoutWrapper skipLayout>
        <Login />
      </AppLayoutWrapper>
    } 
  />,
  <Route 
    key="register"
    path="/register" 
    element={
      <AppLayoutWrapper skipLayout>
        <Register />
      </AppLayoutWrapper>
    } 
  />,
  <Route 
    key="auth"
    path="/auth" 
    element={
      <AppLayoutWrapper skipLayout>
        <Auth />
      </AppLayoutWrapper>
    } 
  />,
  <Route
    key="demo-login"
    path="/demo-login"
    element={
      <AppLayoutWrapper skipLayout>
        <DemoLogin />
      </AppLayoutWrapper>
    }
  />
];
