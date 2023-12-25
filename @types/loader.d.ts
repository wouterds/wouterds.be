import { LoaderFunctionArgs as OGLoaderFunctionArgs } from '@remix-run/cloudflare';

declare global {
  type LoaderFunctionArgs = OGLoaderFunctionArgs & {
    context: {
      env: {
        DATOCMS_API_URL: string;
        DATOCMS_API_KEY: string;
      };
    };
  };
}
