import * as Sentry from '@sentry/react';
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { HydratedRouter } from 'react-router/dom';

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: 'https://cd3892c9f369b8a89a6c912bdf7397ee@o308818.ingest.us.sentry.io/4508709322162176',
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        maskAllInputs: false,
      }),
    ],
    replaysOnErrorSampleRate: 1,
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
