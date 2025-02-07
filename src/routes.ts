/* eslint-disable */
import { index, prefix, route, type RouteConfig } from '@react-router/dev/routes';

export default [
  index('routes/pages/home.tsx'),
  ...prefix('/blog', [
    index('routes/pages/blog/index.tsx'),
    route('/:slug', 'routes/pages/blog/slug/index.tsx'),
  ]),
  route('/contact', 'routes/pages/contact.tsx'),

  ...prefix('/api', [
    route('/spotify/auth', 'routes/api/spotify/auth.ts'),
    route('/nuc', 'routes/api/nuc.ts'),
    route('/aranet', 'routes/api/aranet.ts'),
    route('/experiments', 'routes/api/experiments.ts'),
    route('/p1', 'routes/api/p1.ts'),
    route('/tesla', 'routes/api/tesla.ts'),
  ]),

  route('/images/*', 'routes/images.$.ts'),
  route('/sitemap.xml', 'routes/sitemap.ts'),
  route('/feed.xml', 'routes/feed.ts'),
  route('/robots.txt', 'routes/robots.ts'),
] satisfies RouteConfig;
