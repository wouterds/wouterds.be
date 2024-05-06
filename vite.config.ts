import {
  cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
  vitePlugin as remix,
} from '@remix-run/dev';
import { installGlobals } from '@remix-run/node';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

installGlobals();

export default defineConfig({
  server: {
    port: 3000,
  },
  ssr: {
    noExternal: ['react-use'],
  },
  build: {
    sourcemap: true,
  },
  plugins: [
    remixCloudflareDevProxy(),
    remix({
      ignoredRouteFiles: ['**/*.css'],
      appDirectory: 'src',
      future: {
        unstable_singleFetch: true,
      },
    }),
    sentryVitePlugin({
      org: 'wouterds',
      project: 'website',
      silent: true,
    }),
    tsconfigPaths(),
  ],
});
