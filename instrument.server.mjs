import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

Sentry.init({
  dsn: 'https://71a4e4ffb36594c1dbbd8d6332b2bec3@o308818.ingest.us.sentry.io/4508697599475712',
  integrations: [nodeProfilingIntegration()],
});
