import type { LinksFunction, LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import { captureRemixErrorBoundaryError, withSentry } from '@sentry/remix';

import stylesheet from '~/tailwind.css?url';

import Footer from './components/footer';
import Header from './components/header';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: stylesheet }];

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  if (url.pathname.endsWith('/') && url.pathname !== '/') {
    if (url.pathname === '//') {
      throw new Response(null, { status: 301, headers: { Location: `/` } });
    }

    throw new Response(null, {
      status: 301,
      headers: { Location: `${url.pathname.slice(0, -1)}${url.search}` },
    });
  }

  const cfRayId = request.headers.get('cf-ray') || '';

  return {
    inPreviewMode: context.inPreviewMode,
    url,
    ray: `${cfRayId}${cfRayId && '-'}${context.cloudflare.cf.colo}`,
    canonical: new URL(url.pathname, baseUrl).href,
  };
};

export const meta: MetaFunction<typeof loader> = ({ error, data }) => {
  if (error) {
    return [{ title: 'Oops, something went wrong!' }];
  }

  const title = 'Wouter De Schuyter';
  const description =
    "Hi, I'm Wouter and I like to call myself a Digital Creative & Developer. I build digital products and experiences that are simple, beautiful and easy to use.";

  return [
    { title },
    { name: 'description', content: description },
    { name: 'og:title', content: title },
    { name: 'og:description', content: description },
    { name: 'og:image', content: `${data?.url}/images/og.jpg` },
    { name: 'og:url', content: `${data?.url}` },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:image', content: `${data?.url}/images/og.jpg` },
  ];
};

const App = () => {
  const data = useLoaderData<typeof loader>();
  const includeTrackers = data?.url?.toString()?.includes?.('wouterds.be');

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Blog RSS feed for wouterds.be"
          href={new URL('/feed.xml', data?.url).toString()}
        />
        <meta property="og:site_name" content="Wouter De Schuyter" />
        <Meta />
        <Links />
        {data?.canonical && <link rel="canonical" href={data?.canonical} />}
        {includeTrackers && (
          <script
            defer
            src="https://analytics.eu.umami.is/script.js"
            data-website-id="d504a83c-bc7e-49a6-b643-74c90cd77d01"
          />
        )}
      </head>
      <body suppressHydrationWarning className="relative">
        <div className="mx-auto" style={{ maxWidth: '768px' }}>
          <Header />
          <main className="my-8 sm:my-12">
            <Outlet />
          </main>
          <Footer ray={data?.ray} />
        </div>
        <div id="modal-portal" />

        {data.inPreviewMode && (
          <div className="fixed bottom-2 left-2 z-50 group">
            <p className="flex items-center text-white font-semibold py-2 px-2.5 rounded bg-rose-500 transition w-fit pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                width="1em"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-base relative"
                style={{ bottom: -1 }}>
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M12 1.67c.955 0 1.845 .467 2.39 1.247l.105 .16l8.114 13.548a2.914 2.914 0 0 1 -2.307 4.363l-.195 .008h-16.225a2.914 2.914 0 0 1 -2.582 -4.2l.099 -.185l8.11 -13.538a2.914 2.914 0 0 1 2.491 -1.403zm.01 13.33l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007zm-.01 -7a1 1 0 0 0 -.993 .883l-.007 .117v4l.007 .117a1 1 0 0 0 1.986 0l.007 -.117v-4l-.007 -.117a1 1 0 0 0 -.993 -.883z" />
              </svg>
              <span className="text-xs transition w-0 opacity-0 group-hover:w-auto group-hover:opacity-100 block whitespace-nowrap">
                <span className="pl-2 block">preview mode</span>
              </span>
            </p>
          </div>
        )}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
};

export default withSentry(App, { wrapWithErrorBoundary: false });

export const ErrorBoundary = () => {
  const error = useRouteError();
  captureRemixErrorBoundaryError(error);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="mx-auto" style={{ maxWidth: '768px' }}>
          <Header />
          <main className="my-8 sm:my-12">
            <h1 className="text-xl font-medium mb-4">
              {(isRouteErrorResponse(error) && `${error.status} ${error.statusText}`) ||
                'Oops, something went wrong!'}
            </h1>
            <p>
              {isRouteErrorResponse(error) && error.status === 404
                ? 'The page you were looking for could not be found.'
                : error instanceof Error
                  ? error.message
                  : 'Unknown error occured'}
            </p>
            {error instanceof Error && <code>{error.stack}</code>}
          </main>
          <Footer />
        </div>
        <Scripts />
      </body>
    </html>
  );
};
