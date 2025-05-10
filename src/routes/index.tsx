
import { createBrowserRouter, RouteObject } from "react-router-dom";
import { AppLayoutWrapper } from "@/components/layout";
import { AuthRoutes } from "./auth";
import { DashboardRoutes } from "./dashboard";
import { SettingsRoutes } from "./settings";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Pages
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Demographics from "@/pages/Demographics";
import AuthGuard from "@/components/layout/AuthGuard";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <AppLayoutWrapper><Index /></AppLayoutWrapper>,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/dashboard",
    element: (
      <AuthGuard requireAuth={true}>
        <Dashboard />
      </AuthGuard>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/demographics",
    element: (
      <AuthGuard requireAuth={true}>
        <Demographics />
      </AuthGuard>
    ),
    errorElement: <ErrorBoundary />,
  },
  ...AuthRoutes,
  ...DashboardRoutes,
  ...SettingsRoutes,
];

export const router = createBrowserRouter(routes);
