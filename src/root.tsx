import type {
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/cloudflare';
import { cssBundleHref } from '@remix-run/css-bundle';
import {
  isRouteErrorResponse,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import { ExternalScripts } from 'remix-utils/external-scripts';

import stylesheet from '~/tailwind.css';

import Footer from './components/Footer';
import Header from './components/Header';

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
  { rel: 'stylesheet', href: stylesheet },
];

export const loader = (args: LoaderFunctionArgs) => {
  const context = args.context as Context;

  return { url: context.url, ray: context.ray };
};

export const meta: MetaFunction<typeof loader> = ({ error, data }) => {
  if (error) {
    return [
      {
        title: 'Oops, something went wrong!',
      },
    ];
  }

  const title = 'Wouter De Schuyter';
  const description =
    "Hi, I'm Wouter and I like to call myself a Digital Creative & Developer. I build digital products and experiences that are simple, beautiful and easy to use.";

  return [
    { title },
    { name: 'description', content: description },
    { name: 'og:title', content: title },
    { name: 'og:description', content: description },
    {
      name: 'og:image',
      content: `${data?.url}/images/og.jpg`,
    },
    {
      name: 'og:url',
      content: `${data?.url}`,
    },
    {
      name: 'twitter:title',
      content: title,
    },
    {
      name: 'twitter:description',
      content: description,
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      name: 'twitter:image',
      content: `${data?.url}/images/og.jpg`,
    },
  ];
};

export default function App() {
  const { ray } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="icon" type="image/x-icon" href="favicon.ico" />
        <meta property="og:site_name" content="Wouter De Schuyter" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="mx-auto" style={{ maxWidth: '768px' }}>
          <Header />

          <main className="my-8 sm:my-12">
            <Outlet />
          </main>

          <Footer ray={ray} />
        </div>

        <ScrollRestoration />
        <Scripts />
        <ExternalScripts />
        <LiveReload />

        <div id="modal-portal" />
      </body>
    </html>
  );
}

export const ErrorBoundary = () => {
  const { ray } = useLoaderData<typeof loader>();
  const error = useRouteError();

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
            {isRouteErrorResponse(error) ? (
              <h1 className="text-xl font-medium">
                {error.status} {error.statusText}
              </h1>
            ) : error instanceof Error ? (
              <>
                <h1 className="text-xl font-medium mb-2">Error</h1>
                <p>{error.message}</p>
              </>
            ) : (
              <h1 className="text-xl font-medium">Unknown error</h1>
            )}
          </main>

          <Footer ray={ray} />
        </div>

        <Scripts />
      </body>
    </html>
  );
};
