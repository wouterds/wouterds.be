import {
  cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
  vitePlugin as remix,
} from '@remix-run/dev';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import { getLoadContext } from './load-context';

export default defineConfig({
  server: { port: 3000 },
  build: { sourcemap: true },
  plugins: [
    remixCloudflareDevProxy({ getLoadContext }),
    remix({
      ignoredRouteFiles: ['**/*.css'],
      appDirectory: 'src',
      future: { unstable_singleFetch: true },
    }),
    tsconfigPaths(),
    sentryVitePlugin({
      org: 'wouterds',
      project: 'website',
      silent: true,
      sourcemaps: { filesToDeleteAfterUpload: ['**/*.map'] },
    }),
  ],
});
