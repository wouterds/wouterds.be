import { logDevReady } from '@remix-run/cloudflare';
import { createPagesFunctionHandler } from '@remix-run/cloudflare-pages';
import * as build from '@remix-run/dev/server-build';

if (process.env.NODE_ENV === 'development') {
  logDevReady(build);
}

export const onRequest = createPagesFunctionHandler({
  build,
  getLoadContext: ({ env, request }) => {
    const { protocol, host } = new URL(request.url);
    const url = `${protocol}//${host}`;
    const ray = request.headers.get('cf-ray');

    return { env, url, ray };
  },
  mode: build.mode,
});
