import process from 'node:process';

import * as Sentry from '@sentry/remix';

Sentry.init({
  release: process.env.COMMIT_SHA,
  dsn: 'https://8807cc909fa73f02688d068b02808d71@o308818.ingest.us.sentry.io/4508076558843904',
  tracesSampleRate: 1,
  autoInstrumentRemix: true,
});
