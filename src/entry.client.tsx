import * as Sentry from '@sentry/react';
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { HydratedRouter } from 'react-router/dom';

Sentry.init({
  dsn: 'https://71a4e4ffb36594c1dbbd8d6332b2bec3@o308818.ingest.us.sentry.io/4508697599475712',
  integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
});

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>,
  );
});
