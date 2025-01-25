import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

Sentry.init({
  dsn: 'https://1f7858d2a382fee6d4b16e64c36555ff@o308818.ingest.us.sentry.io/4508704906412032',
  integrations: [nodeProfilingIntegration()],
});
