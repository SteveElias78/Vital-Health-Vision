
import { AuthRoutes } from './auth';
import { MainRoutes } from './main';
import { DatasetRoutes } from './datasets';
import { NotFoundRoute } from './notFound';

export { AuthRoutes } from './auth';
export { MainRoutes } from './main';
export { DatasetRoutes } from './datasets';
export { NotFoundRoute } from './notFound';

export const AppRoutes = [
  ...AuthRoutes,
  ...MainRoutes,
  ...DatasetRoutes,
  NotFoundRoute
];
