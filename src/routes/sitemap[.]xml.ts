import { LoaderFunctionArgs } from '@remix-run/cloudflare';

import { PostRepository } from '~/lib/repositories/post-repository';

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  const posts = await PostRepository.create(context).getPosts();

  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  sitemap += `<url><loc>${baseUrl}</loc></url>`;
  sitemap += `<url><loc>${baseUrl}/about</loc></url>`;
  sitemap += `<url><loc>${baseUrl}/blog</loc></url>`;
  sitemap += `<url><loc>${baseUrl}/contact</loc></url>`;
  sitemap += `<url><loc>${baseUrl}/experiments</loc></url>`;
  for (const { slug } of posts) {
    sitemap += `<url><loc>${baseUrl}/blog/${slug}</loc></url>`;
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
