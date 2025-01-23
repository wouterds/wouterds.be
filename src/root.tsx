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
import stylesheet from './main.css?url';

export const links: Route.LinksFunction = () => [{ rel: 'stylesheet', href: stylesheet }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  return {
    url,
    canonical: new URL(url.pathname, url),
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
    { name: 'og:image', content: `${data?.url}/images/og.jpg` },
    { name: 'og:url', content: `${data?.url}` },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:image', content: `${data?.url}/images/og.jpg` },
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
        {data?.url && (
          <link
            rel="alternate"
            type="application/rss+xml"
            title="Blog RSS feed for wouterds.be"
            href={new URL('/feed.xml', data?.url).toString()}
          />
        )}
        <meta property="og:site_name" content="Wouter De Schuyter" />
        <Meta />
        <Links />
        {data?.canonical && <link rel="canonical" href={data?.canonical.toString()} />}
        {data?.url?.hostname === 'wouterds.be' && (
          <script
            defer
            src="https://analytics.eu.umami.is/script.js"
            data-website-id="d504a83c-bc7e-49a6-b643-74c90cd77d01"
          />
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
