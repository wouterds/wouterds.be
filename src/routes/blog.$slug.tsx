import { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import clsx from 'clsx';
import { format } from 'date-fns';
import { isCode } from 'datocms-structured-text-utils';
import { useEffect, useRef } from 'react';
import { RenderBlockContext, StructuredText, StructuredTextDocument } from 'react-datocms';

import { Image } from '~/components/image';
import { GalleryRecord, VideoRecord } from '~/graphql';
import { useIsDarkMode } from '~/hooks/use-is-dark-mode';
import {
  excerptFromContent,
  imagesFromContent,
  plainTextFromContent,
} from '~/lib/datocms/structured-text-utils';
import { PostRepository } from '~/lib/repositories/post.server';

export const loader = async ({ request, context, params }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  const post = await PostRepository.create(context).getPost(params.slug as string);
  if (!post) {
    throw new Response(null, {
      status: 404,
      statusText: 'Not Found',
    });
  }

  const [previousPost, nextPost] = await Promise.all([
    PostRepository.create(context).getPreviousPost(post.slug, post.date),
    PostRepository.create(context).getNextPost(post.slug, post.date),
  ]);

  const content = post.content.value as unknown as StructuredTextDocument;
  const containsCodeBlocks = content.document.children.some(isCode);

  return { url: baseUrl, post, containsCodeBlocks, previousPost, nextPost };
};

export const meta: MetaFunction<typeof loader> = ({ data, location }) => {
  const url = data?.url;
  const post = data?.post;
  const title = post?.title;
  const description = post?.content ? excerptFromContent(post.content, 160) : '';
  const text = post?.content ? plainTextFromContent(post.content) : '';
  const words = text?.split(' ')?.length || 0;
  const averageWordsPerMinuteReadingSpeed = 160;
  const readingTime = Math.ceil(words / averageWordsPerMinuteReadingSpeed);

  const params = new URLSearchParams(location.search);
  const images = imagesFromContent(post?.content);
  const image = images.find((image) => image.id === params.get('image'));

  const ogImage = image?.url
    ? `/1024${new URL(image.url).pathname}`
    : post?.poster?.url
      ? new URL(post.poster.url).pathname
      : '';

  return [
    { title },
    { name: 'description', content: description },
    { name: 'og:title', content: title },
    { name: 'og:description', content: description },
    { name: 'og:type', content: 'article' },
    { name: 'article:published_time', content: post?.date },
    {
      name: 'og:image',
      content: ogImage ? `${url}/images${ogImage}` : '',
    },
    { name: 'og:url', content: `${url}/blog/${post?.slug}` },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:card', content: 'summary_large_image' },
    {
      name: 'twitter:image',
      content: post?.poster ? `${url}/images${new URL(post?.poster.url).pathname}` : '',
    },
    { name: 'twitter:label1', content: 'Written by' },
    { name: 'twitter:data1', content: 'Wouter De Schuyter' },
    { name: 'twitter:label2', content: 'Est. reading time' },
    { name: 'twitter:data2', content: `${readingTime} minute${readingTime > 1 ? 's' : ''}` },
  ];
};

export default function BlogSlug() {
  const { post, nextPost, previousPost, containsCodeBlocks } = useLoaderData<typeof loader>();

  const isDarkMode = useIsDarkMode();
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!containsCodeBlocks || !ref?.current) {
      return;
    }

    const elements = ref?.current?.querySelectorAll<HTMLElement>('pre code') || [];
    for (const element of elements) {
      const pre = element.parentElement;
      const code = element.textContent;
      const lang = pre?.dataset.language || 'console';
      if (!pre || !code) {
        continue;
      }

      // @ts-expect-error: import from esm.sh to avoid a too large bundle size for CF Workers
      import('https://esm.sh/shiki@1.5.2').then(async ({ codeToHtml }) => {
        pre.outerHTML = await codeToHtml(code, { lang, theme: 'dracula' });
      });
    }
  }, [isDarkMode, containsCodeBlocks]);

  return (
    <>
      <article
        ref={ref}
        className="prose prose-zinc dark:prose-dark dark:prose-invert prose-sm max-w-none text-xs leading-relaxed">
        <header className="mb-4">
          <time
            className="text-xs text-zinc-400 dark:text-zinc-500 mb-2 block"
            dateTime={post.date}>
            {format(post.date, 'MMMM do, yyyy')}
          </time>
          <h1 className="text-xl font-medium my-0">{post.title}</h1>
        </header>

        <StructuredText
          data={post.content as unknown as StructuredTextDocument}
          renderBlock={renderBlock}
        />
      </article>
      <nav
        className={clsx('mt-8 flex', {
          'justify-between': previousPost && nextPost,
          'justify-end': previousPost && !nextPost,
        })}>
        {nextPost && (
          <a href={`/blog/${nextPost.slug}`} title={nextPost.title}>
            &laquo; next post
          </a>
        )}
        {previousPost && (
          <a href={`/blog/${previousPost.slug}`} title={previousPost.title}>
            previous post &raquo;
          </a>
        )}
      </nav>
    </>
  );
}

const renderBlock = ({
  record,
}: RenderBlockContext<(GalleryRecord | VideoRecord) & { __typename: string }>) => {
  if (record.__typename === 'GalleryRecord') {
    return (
      <ul className="not-prose flex flex-col gap-3 mt-6">
        {record.images.map((image) => (
          <li key={`post-gallery.image:${image.id}`}>
            <Image {...image} images={record.images} />
          </li>
        ))}
      </ul>
    );
  }

  if (record.__typename === 'VideoRecord') {
    if (record.video.provider === 'youtube') {
      return (
        <div className="not-prose mt-6">
          <div
            className="bg-zinc-50 dark:bg-zinc-800 dark:bg-opacity-25 relative overflow-hidden bg-center bg-cover aspect-video w-full rounded-sm"
            style={{ backgroundImage: `url(${record.video.thumbnailUrl})` }}>
            <iframe
              loading="lazy"
              src={`https://www.youtube.com/embed/${record.video.providerUid}`}
              title={record.video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full absolute inset-0"
            />
          </div>
        </div>
      );
    }
  }

  return null;
};
