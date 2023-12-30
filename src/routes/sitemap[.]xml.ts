import { LoaderFunctionArgs } from '@remix-run/cloudflare';

import { PostRepository } from '~/lib/repositories/post.server';

export const loader = async (args: LoaderFunctionArgs) => {
  const context = args.context as Context;

  const repository = new PostRepository(
    context.env.DATOCMS_API_URL,
    context.env.DATOCMS_API_KEY,
  );

  const posts = await repository.getPosts();

  const paths = [
    '/',
    '/about',
    '/blog',
    '/contact',
    ...posts.map(({ slug }) => `/blog/${slug}`),
  ];

  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  for (const path of paths) {
    sitemap += `<url><loc>${context.url}${path}</loc></url>`;
  }
  sitemap += '</urlset>';

  return new Response(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
