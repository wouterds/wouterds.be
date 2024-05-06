import { type PlatformProxy } from 'wrangler';

import { Env } from './dotenv';

export * from '@remix-run/cloudflare';

type Cloudflare = Omit<PlatformProxy<Env>, 'dispose'>;

declare module '@remix-run/cloudflare' {
  interface AppLoadContext {
    cloudflare: Cloudflare;
  }
}
