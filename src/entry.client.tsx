/**
 * By default, Remix will handle hydrating your app on the client for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.client
 */

import { RemixBrowser, useLocation, useMatches } from '@remix-run/react';
import * as Sentry from '@sentry/remix';
import { startTransition, StrictMode, useEffect } from 'react';
import { hydrateRoot } from 'react-dom/client';

Sentry.init({
  enabled: process.env.NODE_ENV === 'production',
  allowUrls: ['wouterds.be'],
  dsn: 'https://83c02458f82de750914fc5888601c89d@o308818.ingest.us.sentry.io/4507239462993920',
  integrations: [
    Sentry.browserTracingIntegration({
      useEffect,
      useLocation,
      useMatches,
    }),
  ],
});

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>,
  );
});
