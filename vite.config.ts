import {
  cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
  vitePlugin as remix,
} from '@remix-run/dev';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import { getLoadContext } from './load-context';

declare module '@remix-run/server-runtime' {
  interface Future {
    unstable_singleFetch: true;
  }
}

export default defineConfig({
  server: { port: 3000 },
  plugins: [
    remixCloudflareDevProxy({ getLoadContext }),
    remix({
      ignoredRouteFiles: ['**/*.css'],
      appDirectory: 'src',
      future: {
        unstable_singleFetch: true,
        unstable_lazyRouteDiscovery: true,
        unstable_optimizeDeps: true,
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    tsconfigPaths(),
  ],
});
