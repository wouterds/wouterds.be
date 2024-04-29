import { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { format } from 'date-fns';
import { isCode } from 'datocms-structured-text-utils';
import { useCallback, useEffect, useState } from 'react';
import { RenderBlockContext, StructuredText, StructuredTextDocument } from 'react-datocms';
import { useMedia } from 'react-use';
import { ExternalScriptsFunction } from 'remix-utils/external-scripts';

import { Image } from '~/components/Image';
import { GalleryRecord, PostRecord, VideoRecord } from '~/graphql';
import { excerptFromContent, plainTextFromContent } from '~/lib/datocms/structured-text-utils';
import { PostRepository } from '~/lib/repositories/post.server';

export const loader = async ({ context, params }: LoaderFunctionArgs) => {
  const repository = new PostRepository(context.env.DATOCMS_API_KEY);

  const post = await repository.getPostBySlug(params.slug as string);
  if (!post) {
    throw new Response(null, {
      status: 404,
      statusText: 'Not Found',
    });
  }

  const content = post.content.value as unknown as StructuredTextDocument;
  const containsCodeBlocks = content.document.children.some(isCode);

  return { url: context.url, post, containsCodeBlocks };
};

export const handle: {
  scripts: ExternalScriptsFunction<{ containsCodeBlocks: boolean }>;
} = {
  scripts: ({ data }) => {
    if (data.containsCodeBlocks) {
      return [{ src: 'https://cdn.jsdelivr.net/npm/shiki@v0.14.6' }];
    }

    return [];
  },
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const url = data?.url as string;
  const post = data?.post as PostRecord;
  const title = post.title;
  const description = excerptFromContent(post.content);
  const text = plainTextFromContent(post.content);
  const words = text?.split(' ')?.length || 0;
  const averageWordsPerMinuteReadingSpeed = 160;
  const readingTime = Math.ceil(words / averageWordsPerMinuteReadingSpeed);

  return [
    { title },
    { name: 'description', content: description },
    { name: 'og:title', content: title },
    { name: 'og:description', content: description },
    { name: 'og:type', content: 'article' },
    { name: 'article:published_time', content: post.date },
    {
      name: 'og:image',
      content: `${url}/images${new URL(post.poster.url).pathname}`,
    },
    {
      name: 'og:url',
      content: `${url}/blog/${post.slug}`,
    },
    {
      name: 'twitter:title',
      content: title,
    },
    {
      name: 'twitter:description',
      content: description,
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      name: 'twitter:image',
      content: `${url}/images${new URL(post.poster.url).pathname}`,
    },
    {
      name: 'twitter:label1',
      content: 'Written by',
    },
    {
      name: 'twitter:data1',
      content: 'Wouter De Schuyter',
    },
    {
      name: 'twitter:label2',
      content: 'Est. reading time',
    },
    {
      name: 'twitter:data2',
      content: `${readingTime} minute${readingTime > 1 ? 's' : ''}`,
    },
  ];
};

export default function BlogSlug() {
  const { post, containsCodeBlocks } = useLoaderData<typeof loader>();

  const isDarkMode = useMedia('(prefers-color-scheme: dark)', false);
  const [shikiLoaded, setShikiLoaded] = useState(false);
  const awaitShiki = useCallback(() => {
    if (!containsCodeBlocks) {
      return;
    }

    if (window.shiki) {
      setShikiLoaded(true);
      return;
    }

    setTimeout(awaitShiki, 10);
  }, [containsCodeBlocks]);

  useEffect(() => {
    if (containsCodeBlocks) {
      awaitShiki();
    }
  }, [containsCodeBlocks, awaitShiki]);

  const [ref, setRef] = useState<HTMLElement | null>(null);
  useEffect(() => {
    if (!shikiLoaded) {
      return;
    }

    if (!ref) {
      return;
    }

    const elements = ref.querySelectorAll<HTMLElement>('pre code');
    const langs = Array.from(
      new Set(
        Array.from(elements)
          .map(
            (code) =>
              code.parentElement?.attributes?.getNamedItem?.('data-language')?.value as string,
          )
          .filter((lang) => lang !== 'text')
          .filter(Boolean),
      ),
    );

    if (!langs.length) {
      return;
    }

    window.shiki
      .getHighlighter({
        theme: isDarkMode ? 'github-dark' : 'github-light',
        langs,
      })
      .then((highlighter) => {
        for (const code of elements) {
          const pre = code.parentElement;
          if (pre) {
            const lang = pre.attributes?.getNamedItem?.('data-language')?.value;
            pre.outerHTML = highlighter.codeToHtml(code.textContent!, { lang });
          }
        }
      });
  }, [shikiLoaded, ref, isDarkMode]);

  return (
    <article
      className="prose prose-zinc dark:prose-dark dark:prose-invert prose-sm max-w-none text-xs leading-relaxed"
      ref={setRef}>
      <header className="mb-4">
        <time className="text-xs text-zinc-400 dark:text-zinc-500 mb-2 block" dateTime={post.date}>
          {format(post.date, 'MMMM do, yyyy')}
        </time>
        <h1 className="text-2xl font-medium my-0">{post.title}</h1>
      </header>

      <StructuredText
        data={post.content as unknown as StructuredTextDocument}
        renderBlock={renderBlock}
      />
    </article>
  );
}

const renderBlock = ({
  record,
}: RenderBlockContext<(GalleryRecord | VideoRecord) & { __typename: string }>) => {
  if (record.__typename === 'GalleryRecord') {
    return (
      <ul className="not-prose flex flex-col gap-3">
        {record.images.map((image) => (
          <li key={`post-gallery.image:${image.id}`}>
            <Image {...image} />
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
