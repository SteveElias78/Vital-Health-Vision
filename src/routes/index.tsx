
import routes from './main';
import { AuthRoutes } from './auth';
import { DatasetRoutes } from './datasets';
import { NotFoundRoute } from './notFound';

export { AuthRoutes } from './auth';
export { DatasetRoutes } from './datasets';
export { NotFoundRoute } from './notFound';

export const AppRoutes = [
  ...routes,
  ...AuthRoutes,
  ...DatasetRoutes,
  NotFoundRoute
];
