import * as Sentry from '@sentry/react';
import type { ReactNode } from 'react';
import {
  isRouteErrorResponse,
  Links,
  type LoaderFunctionArgs,
  Meta,
  type MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from 'react-router';

import type { Route } from './+types/root';
import { Code } from './components/code';
import Footer from './components/footer';
import Header from './components/header';
import { config } from './config';
import stylesheet from './main.css?url';

export const links: Route.LinksFunction = () => [{ rel: 'stylesheet', href: stylesheet }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  return {
    canonical: new URL(url.pathname, config.baseUrl).toString().replace(/\/$/, ''),
  };
};

export const meta: MetaFunction<typeof loader> = ({ error, data }) => {
  if (error) {
    return [{ title: 'Oops, something went wrong!' }];
  }

  const title = 'Wouter De Schuyter';
  const description =
    "Hi, I'm Wouter and I like to call myself a Digital Creative & Developer. I build digital products and experiences that are beautiful and easy to use.";

  return [
    { title },
    { name: 'description', content: description },
    { name: 'og:title', content: title },
    { name: 'og:description', content: description },
    { name: 'og:image', content: new URL('/images/og.jpg', config.baseUrl).toString() },
    { name: 'og:url', content: data?.canonical.toString() },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:image', content: new URL('/images/og.jpg', config.baseUrl).toString() },
  ];
};

export function Layout({ children }: { children: ReactNode }) {
  const data = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1" />
        <meta name="robots" content="index,follow" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Blog RSS feed for wouterds.com"
          href={new URL('/feed.xml', config.baseUrl).toString()}
        />
        <meta property="og:site_name" content="Wouter De Schuyter" />
        <Meta />
        <Links />
        {data?.canonical && <link rel="canonical" href={data?.canonical.toString()} />}
        {import.meta.env.PROD && (
          <>
            <script
              defer
              async
              src="https://analytics.eu.umami.is/script.js"
              data-website-id="d504a83c-bc7e-49a6-b643-74c90cd77d01"
            />
            <script
              defer
              async
              src="https://analytics.ahrefs.com/analytics.js"
              data-key="Owr/uCSPdf5IKCNDeu9yDg"
            />
            <script
              defer
              async
              src="https://static.cloudflareinsights.com/beacon.min.js"
              data-cf-beacon='{"token": "07f72723f78e4631ae9d5b78947516d4"}'
            />
          </>
        )}
      </head>
      <body className="relative">
        <Header />
        <main className="max-w-screen-md mx-auto px-6 sm:px-8">{children}</main>
        <Footer />
        <ScrollRestoration />
        <Scripts />
        <div id="modal-portal" />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (error instanceof Error && import.meta.env.PROD) {
    Sentry.captureException(error);
  }

  return (
    <>
      <h1 className="text-xl font-medium mb-4">
        {(isRouteErrorResponse(error) && `${error.status} ${error.statusText}`) ||
          'Oops, something went wrong!'}
      </h1>
      <p>
        {isRouteErrorResponse(error) && error.status === 404
          ? 'The page you were looking for could not be found.'
          : (error instanceof Error && error.message) || 'Unknown error occured'}
      </p>
      {error instanceof Error && error.stack && (
        <Code className="mt-1" lang="log">
          {error.stack}
        </Code>
      )}
    </>
  );
}
