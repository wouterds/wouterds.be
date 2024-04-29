import { LoaderFunctionArgs } from '@remix-run/cloudflare';

import { PostRepository } from '~/lib/repositories/post.server';

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const repository = new PostRepository(context.env.DATOCMS_API_KEY);

  const posts = await repository.getPosts();

  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  sitemap += `<url><loc>${context.url}</loc></url>`;
  sitemap += `<url><loc>${context.url}/about</loc></url>`;
  sitemap += `<url><loc>${context.url}/blog</loc></url>`;
  sitemap += `<url><loc>${context.url}/contact</loc></url>`;
  sitemap += `<url><loc>${context.url}/experiments</loc></url>`;
  for (const { slug } of posts) {
    sitemap += `<url><loc>${context.url}/blog/${slug}</loc></url>`;
  }
  sitemap += '</urlset>';

  return new Response(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, must-revalidate',
    },
  });
};
