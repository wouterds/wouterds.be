import { type PlatformProxy } from 'wrangler';
export * from '@remix-run/cloudflare';

type Env = {
  DATOCMS_API_KEY: string;
  MAILJET_API_KEY: string;
  MAILJET_API_SECRET: string;
  CLOUDFLARE_TURNSTILE_KEY: string;
  CLOUDFLARE_TURNSTILE_SECRET: string;
  POSTHOG_API_KEY: string;
  API_AUTH_TOKEN: string;
  CACHE: KVNamespace;
};

type Cloudflare = Omit<PlatformProxy<Env>, 'dispose'>;

declare module '@remix-run/cloudflare' {
  interface AppLoadContext {
    cloudflare: Cloudflare;
  }
}
