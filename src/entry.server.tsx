/**
 * By default, Remix will handle generating the HTTP Response for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.server
 */

import type { AppLoadContext, EntryContext } from '@remix-run/cloudflare';
import { RemixServer } from '@remix-run/react';
import * as Sentry from '@sentry/remix';
import { isbot } from 'isbot';
import { renderToReadableStream } from 'react-dom/server';

Sentry.init({
  enabled: process.env.NODE_ENV === 'production',
  allowUrls: ['wouterds.be'],
  dsn: 'https://a6eed70f937626c2b795ca09c2c43cb5@o308818.ingest.us.sentry.io/4507262144348160',
});

export const handleError = Sentry.wrapRemixHandleError;

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  loadContext: AppLoadContext,
) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  loadContext.inPreviewMode = searchParams.get('preview') !== null;
  if (url.host.includes('.pages.dev') || loadContext.inPreviewMode) {
    responseHeaders.set('X-Robots-Tag', 'noindex');
  }

  const body = await renderToReadableStream(
    <RemixServer context={remixContext} url={request.url} />,
    {
      signal: request.signal,
      onError(error: unknown) {
        // Log streaming rendering errors from inside the shell
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent') || '')) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
