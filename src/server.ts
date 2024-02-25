import { logDevReady } from '@remix-run/cloudflare';
import { createPagesFunctionHandler } from '@remix-run/cloudflare-pages';
import * as build from '@remix-run/dev/server-build';

if (process.env.NODE_ENV === 'development') {
  logDevReady(build);
}

export const onRequest = createPagesFunctionHandler({
  build,
  getLoadContext: ({ context: { cloudflare }, request }) => {
    const { protocol, host } = new URL(request.url);
    const url = `${protocol}//${host}`;
    const rayId = request.headers.get('cf-ray');
    const colo = (request as unknown as { cf: { colo: string } })?.cf?.colo;
    const ray = rayId ? `${rayId}-${colo}` : rayId || colo;

    return { env: cloudflare.env, url, ray };
  },
});
