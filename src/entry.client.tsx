import * as Sentry from '@sentry/react';
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { HydratedRouter } from 'react-router/dom';

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: 'https://1f7858d2a382fee6d4b16e64c36555ff@o308818.ingest.us.sentry.io/4508704906412032',
    integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
  });
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>,
  );
});
