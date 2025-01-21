import { render, type StructuredTextDocument } from 'datocms-structured-text-to-html-string';
import { isStructuredText } from 'datocms-structured-text-utils';
import { Feed } from 'feed';
import { StatusCodes } from 'http-status-codes';
import type { LoaderFunctionArgs } from 'react-router';

import type { GalleryRecord, VideoRecord } from '~/graphql';
import { PostRepository } from '~/graphql/posts/repository.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  const posts = await new PostRepository().getPosts();

  const feed = new Feed({
    title: "Wouter's blog",
    description:
      'My personal blog where I write about software development, side projects, travel, and other random stuff that I find interesting.',
    id: baseUrl,
    link: baseUrl,
    copyright: `© ${new Date().getFullYear()} Wouter De Schuyter`,
    image: `${baseUrl}/favicon.svg`,
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
      id: `${baseUrl}/blog/${slug}`,
      link: `${baseUrl}/blog/${slug}`,
      image: `${baseUrl}/images${new URL(poster.url).pathname}`,
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
                      src: `${baseUrl}/images${new URL(image.url).pathname}`,
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
    status: StatusCodes.OK,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, must-revalidate',
    },
  });
};
