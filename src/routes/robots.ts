import process from 'node:process';

import { StatusCodes } from 'http-status-codes';

import { config } from '~/config';

export const loader = async () => {
  let robots = '';
  robots += 'User-agent: *\n';
  if (process.env.NODE_ENV === 'development') {
    robots += 'Disallow: /\n';
  } else {
    robots += 'Allow: /\n';
  }
  robots += 'Disallow: /cdn-cgi/\n';
  robots += '\n';
  robots += `Host: ${config.baseUrl}\n`;
  robots += `Sitemap: ${new URL('/sitemap.xml', config.baseUrl)}\n`;

  return new Response(robots, {
    status: StatusCodes.OK,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, must-revalidate',
    },
  });
};
