import {
  cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
  vitePlugin as remix,
} from '@remix-run/dev';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  ssr: {
    noExternal: ['react-use'],
  },
  plugins: [
    remixCloudflareDevProxy(),
    remix({
      appDirectory: 'src',
      future: {
        unstable_singleFetch: true,
      },
    }),
    tsconfigPaths(),
  ],
});
