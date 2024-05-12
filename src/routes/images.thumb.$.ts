import { LoaderFunctionArgs } from '@remix-run/cloudflare';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { body, headers } = await fetch(
    `https://www.datocms-assets.com/${new URL(request.url).pathname
      ?.replace('/images', '')
      ?.replace('/thumb', '')}?w=768`,
  );

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': headers.get('Content-Type') as string,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
