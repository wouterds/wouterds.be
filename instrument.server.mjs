import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

Sentry.init({
  dsn: 'https://cd3892c9f369b8a89a6c912bdf7397ee@o308818.ingest.us.sentry.io/4508709322162176',
  integrations: [nodeProfilingIntegration()],
});
