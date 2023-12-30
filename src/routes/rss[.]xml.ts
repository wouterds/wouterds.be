import { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { Feed } from 'feed';

import { PostRepository } from '~/lib/repositories/post.server';

export const loader = async (args: LoaderFunctionArgs) => {
  const context = args.context as Context;
  const repository = new PostRepository(
    context.env.DATOCMS_API_URL,
    context.env.DATOCMS_API_KEY,
  );

  const posts = await repository.getPosts();

  const feed = new Feed({
    title: 'Blog - Wouter De Schuyter',
    description:
      'My personal blog where I write about software development, fun/side projects, travel, and other random stuff that I find interesting.',
    id: context.url,
    link: context.url,
    copyright: `&copy; ${new Date().getFullYear()} Wouter De Schuyter`,
    image: `${context.url}/images/og.jpg`,
    favicon: `${context.url}/favicon.ico`,
    updated: new Date(posts[0].date),
    generator: 'https://github.com/wouterds/wouterds.be',
    author: { name: 'Wouter De Schuyter' },
  });

  for (const { slug, title, excerpt, date } of posts) {
    feed.addItem({
      title,
      id: `${context.url}/blog/${slug}`,
      link: `${context.url}/blog/${slug}`,
      description: excerpt,
      content: excerpt,
      date: new Date(date),
    });
  }

  feed.addCategory('Software Development');
  feed.addCategory('Web Development');
  feed.addCategory('Web3');
  feed.addCategory('Travel');
  feed.addCategory('Photography');
  feed.addCategory('Personal');

  return new Response(feed.rss2(), {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
