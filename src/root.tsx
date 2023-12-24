import type { LinksFunction, LoaderFunctionArgs } from '@remix-run/cloudflare';
import { cssBundleHref } from '@remix-run/css-bundle';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';

import stylesheet from '~/tailwind.css';

import Footer from './components/Footer';
import Header from './components/Header';

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
  { rel: 'stylesheet', href: stylesheet },
];

export const loader = ({ context }: LoaderFunctionArgs) => {
  return {
    time: context.time as number,
  };
};

export default function App() {
  const data = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="mx-auto mt-2" style={{ maxWidth: '768px' }}>
          <Header />

          <main className="my-12">
            <Outlet />
          </main>

          <Footer time={data.time} />
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
