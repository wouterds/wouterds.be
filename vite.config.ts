import {
  cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
  vitePlugin as remix,
} from '@remix-run/dev';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  server: { port: 3000 },
  build: { sourcemap: true },
  plugins: [
    remixCloudflareDevProxy(),
    remix({
      ignoredRouteFiles: ['**/*.css'],
      appDirectory: 'src',
      future: { unstable_singleFetch: true },
    }),
    tsconfigPaths(),
    sentryVitePlugin({ org: 'wouterds', project: 'website', silent: true }),
    visualizer({ emitFile: true }),
  ],
});
