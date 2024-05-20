import { LoaderFunctionArgs } from '@remix-run/cloudflare';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { pathname } = new URL(request.url);

  if (pathname?.startsWith('/images/768/')) {
    const { body, headers } = await fetch(
      `https://www.datocms-assets.com/${new URL(request.url).pathname
        ?.replace('/images', '')
        ?.replace('/768', '')}?w=768`,
    );

    return new Response(body, {
      status: 200,
      headers: {
        'Content-Type': headers.get('Content-Type') as string,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  }

  if (pathname?.startsWith('/images/1024/')) {
    const { body, headers } = await fetch(
      `https://www.datocms-assets.com/${new URL(request.url).pathname
        ?.replace('/images', '')
        ?.replace('/1024', '')}?w=1024`,
    );

    return new Response(body, {
      status: 200,
      headers: {
        'Content-Type': headers.get('Content-Type') as string,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  }

  const { body, headers } = await fetch(
    `https://www.datocms-assets.com/${new URL(request.url).pathname?.replace('/images/', '')}`,
  );

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': headers.get('Content-Type') as string,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
