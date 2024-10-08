import { LoaderFunctionArgs } from '@remix-run/node';
import { StatusCodes } from 'http-status-codes';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  let robots = '';
  robots += 'User-agent: *\n';
  if (process.env.NODE_ENV === 'development' || url.host?.includes('pages.dev')) {
    robots += 'Disallow: /\n';
  } else {
    robots += 'Allow: /\n';
  }
  robots += 'Disallow: /cdn-cgi/\n';
  robots += '\n';
  robots += `Host: ${baseUrl}\n`;
  robots += `Sitemap: ${new URL('/sitemap.xml', baseUrl)}\n`;

  return new Response(robots, {
    status: StatusCodes.OK,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, must-revalidate',
    },
  });
};
