
import { RouteObject } from 'react-router-dom';
import FormShowcase from '@/pages/FormShowcase';
import ArtDecoComponentsShowcase from '@/pages/ArtDecoComponentsShowcase';
import Explore from '@/pages/Explore';
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';
import About from '@/pages/About';
import Datasets from '@/pages/Datasets';
import Geography from '@/pages/Geography';
import HealthMetrics from '@/pages/HealthMetrics';
import Predict from '@/pages/Predict';
import Settings from '@/pages/Settings';

// Import other routes as needed

export const AppRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Dashboard />,
  },
  {
    path: '/components',
    element: <ArtDecoComponentsShowcase />,
  },
  {
    path: '/forms',
    element: <FormShowcase />,
  },
  {
    path: '/explore',
    element: <Explore />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '/datasets',
    element: <Datasets />,
  },
  {
    path: '/geography',
    element: <Geography />,
  },
  {
    path: '/metrics',
    element: <HealthMetrics />,
  },
  {
    path: '/predict',
    element: <Predict />,
  },
  {
    path: '/settings',
    element: <Settings />,
  },
  // Add other routes here
];
