import { vitePlugin as remix } from '@remix-run/dev';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

declare module '@remix-run/node' {
  interface Future {
    unstable_singleFetch: true;
  }
}

export default defineConfig({
  build: {
    target: 'esnext',
    sourcemap: true,
  },
  define: {
    'process.env.COMMIT_SHA': JSON.stringify(process.env.COMMIT_SHA),
  },
  plugins: [
    remix({
      appDirectory: 'src',
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        unstable_optimizeDeps: true,
        unstable_singleFetch: true,
      },
    }),
    tsconfigPaths(),
    sentryVitePlugin({
      org: 'wouterds',
      project: 'website',
      release: {
        name: process.env.COMMIT_SHA,
      },
      sourcemaps: {
        filesToDeleteAfterUpload: ['build/**/*.map'],
      },
    }),
  ],
});
