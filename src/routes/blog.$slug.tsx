import { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { isCode } from 'datocms-structured-text-utils';
import { useCallback, useEffect, useState } from 'react';
import {
  RenderBlockContext,
  StructuredText,
  StructuredTextDocument,
} from 'react-datocms';
import { ExternalScriptsFunction } from 'remix-utils/external-scripts';

import { Image } from '~/components/Image';
import { PostGalleryRecord, PostRecord } from '~/graphql';
import {
  excerptFromContent,
  plainTextFromContent,
} from '~/lib/datocms/structured-text-utils';
import { PostRepository } from '~/lib/repositories/post.server';

export const loader = async (args: LoaderFunctionArgs) => {
  const context = args.context as Context;
  const repository = new PostRepository(
    context.env.DATOCMS_API_URL,
    context.env.DATOCMS_API_KEY,
  );

  const post = await repository.getBySlug(args.params.slug as string);
  if (!post) {
    throw new Response(null, {
      status: 404,
      statusText: 'Not Found',
    });
  }

  const content = post.content.value as unknown as StructuredTextDocument;
  const containsCodeBlocks = content.document.children.some(isCode);

  return { post, containsCodeBlocks };
};

export const handle: {
  scripts: ExternalScriptsFunction<{ containsCodeBlocks: boolean }>;
} = {
  scripts: ({ data }) => {
    if (data.containsCodeBlocks) {
      return [{ src: 'https://cdn.jsdelivr.net/npm/shiki' }];
    }

    return [];
  },
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const post = data?.post as PostRecord;
  const title = post.title;
  const description = excerptFromContent(post.content);
  const text = plainTextFromContent(post.content);
  const words = text?.split(' ')?.length || 0;
  const averageWordsPerMinuteReadingSpeed = 160;
  const readingTime = Math.ceil(words / averageWordsPerMinuteReadingSpeed);

  return [
    { title },
    {
      name: 'description',
      description: description,
    },
    {
      name: 'og:title',
      content: title,
    },
    {
      name: 'og:description',
      content: description,
    },
    {
      name: 'og:image',
      content: `https://wouterds.be/images${new URL(post.poster.url).pathname}`,
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
      content: `https://wouterds.be/images${new URL(post.poster.url).pathname}`,
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
              code.parentElement!.attributes.getNamedItem('data-language')
                ?.value as string,
          )
          .filter(Boolean),
      ),
    );

    if (!langs.length) {
      return;
    }

    window.shiki
      .getHighlighter({ theme: 'nord', langs })
      .then((highlighter) => {
        for (const code of elements) {
          const pre = code.parentElement!;
          const lang = pre.attributes.getNamedItem('data-language')?.value;
          pre.outerHTML = highlighter.codeToHtml(code.textContent!, { lang });
        }
      });
  }, [shikiLoaded, ref]);

  return (
    <article
      className="prose prose-zinc dark:prose-invert prose-sm max-w-none text-xs leading-relaxed"
      ref={setRef}>
      <h1 className="text-2xl">{post.title}</h1>

      <StructuredText
        data={post.content as unknown as StructuredTextDocument}
        renderBlock={renderBlock}
      />
    </article>
  );
}

const renderBlock = ({
  record,
}: RenderBlockContext<PostGalleryRecord & { __typename: string }>) => {
  if (record.__typename === 'PostGalleryRecord') {
    return (
      <ul className="not-prose flex flex-col gap-4 mt-6">
        {record.images.map((image) => (
          <li
            key={`post-gallery.image:${image.id}`}
            className="bg-zinc-50 dark:bg-zinc-800 dark:bg-opacity-25 relative overflow-hidden"
            style={{
              aspectRatio: `${
                (image.width as number) / (image.height as number)
              }`,
            }}>
            <Image {...image} />
          </li>
        ))}
      </ul>
    );
  }

  return null;
};
