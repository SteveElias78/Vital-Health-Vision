
import { RouteObject } from 'react-router-dom';
import FormShowcase from '@/pages/FormShowcase';
import ArtDecoComponentsShowcase from '@/pages/ArtDecoComponentsShowcase';

// Import other routes as needed

export const AppRoutes: RouteObject[] = [
  {
    path: '/',
    element: <ArtDecoComponentsShowcase />,
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
    element: <ArtDecoComponentsShowcase />,
  },
  // Add other routes here
];
