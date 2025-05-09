
import { Outlet, RouteObject } from 'react-router-dom';
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import SemanticDataDashboard from '../pages/SemanticDataDashboard';
import Geography from '../pages/Geography';
import Demographics from '../pages/Demographics';
import HealthMetrics from '../pages/HealthMetrics';
import Explore from '../pages/Explore';
import Reports from '../pages/Reports';
import Settings from '../pages/Settings';
import About from '../pages/About';
import Predict from '../pages/Predict';

const mainRoutes: RouteObject = {
  path: '/',
  element: <Outlet />,
  children: [
    {
      index: true,
      element: <Home />,
    },
    {
      path: 'dashboard',
      element: <Dashboard />,
    },
    {
      path: 'semantic-dashboard',
      element: <SemanticDataDashboard />,
    },
    {
      path: 'geography',
      element: <Geography />,
    },
    {
      path: 'demographics',
      element: <Demographics />,
    },
    {
      path: 'health-metrics',
      element: <HealthMetrics />,
    },
    {
      path: 'predict',
      element: <Predict />,
    },
    {
      path: 'explore',
      element: <Explore />,
    },
    {
      path: 'reports',
      element: <Reports />,
    },
    {
      path: 'settings',
      element: <Settings />,
    },
    {
      path: 'about',
      element: <About />,
    },
  ],
};

export default mainRoutes;
