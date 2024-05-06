import { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { render, StructuredTextDocument } from 'datocms-structured-text-to-html-string';
import { isStructuredText } from 'datocms-structured-text-utils';
import { Feed } from 'feed';

import { GalleryRecord, VideoRecord } from '~/graphql';
import { PostRepository } from '~/lib/repositories/post.server';

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const repository = new PostRepository(context.cloudflare.env.DATOCMS_API_KEY);

  const posts = await repository.getPosts();

  const feed = new Feed({
    title: "Wouter's blog",
    description:
      'My personal blog where I write about software development, side projects, travel, and other random stuff that I find interesting.',
    id: context.url,
    link: context.url,
    copyright: `© ${new Date().getFullYear()} Wouter De Schuyter`,
    image: `${context.url}/apple-touch-icon.png`,
    updated: new Date(posts[0].date),
    generator: 'https://github.com/wouterds/wouterds.be',
    author: { name: 'Wouter De Schuyter' },
  });

  for (const { poster, slug, title, excerpt, content, date } of posts) {
    if (!isStructuredText(content)) {
      continue;
    }

    feed.addItem({
      title,
      id: `${context.url}/blog/${slug}`,
      link: `${context.url}/blog/${slug}`,
      image: `${context.url}/images${new URL(poster.url).pathname}`,
      description: excerpt,
      content: render(content as unknown as StructuredTextDocument, {
        renderBlock: ({ record, adapter: { renderNode } }) => {
          if (record.__typename === 'GalleryRecord') {
            const { images } = record as GalleryRecord;
            if (images.length) {
              return renderNode(
                'p',
                {},
                images
                  .map((image, index) => [
                    renderNode('img', {
                      src: `${context.url}/images${new URL(image.url).pathname}`,
                      width: '100%',
                    }),
                    index !== images.length - 1 && renderNode('br'),
                  ])
                  .filter(Boolean),
              )?.toString() as string;
            }
          }

          if (record.__typename === 'VideoRecord') {
            const { video } = record as VideoRecord;
            if (video.provider === 'youtube') {
              return renderNode(
                'iframe',
                {
                  src: `https://youtube.com/embed/${video.providerUid}`,
                  width: '100%',
                  style: 'aspect-ratio:16/9',
                },
                [],
              )?.toString() as string;
            }
          }

          return '';
        },
      }) as string,
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
      'Cache-Control': 'public, max-age=86400, must-revalidate',
    },
  });
};
