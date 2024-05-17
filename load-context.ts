import { AppLoadContext } from '@remix-run/cloudflare';
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
    inPreviewMode?: boolean;
  }
}

type GetLoadContext = (args: {
  request: Request;
  context: { cloudflare: Cloudflare }; // load context _before_ augmentation
}) => AppLoadContext;

// Shared implementation compatible with Vite, Wrangler, and Cloudflare Pages
export const getLoadContext: GetLoadContext = ({ context, request }) => {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  return {
    ...context,
    inPreviewMode: searchParams.get('preview') !== null,
  };
};
