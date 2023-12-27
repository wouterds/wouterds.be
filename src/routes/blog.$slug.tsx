import { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import {
  RenderBlockContext,
  StructuredText,
  StructuredTextDocument,
} from 'react-datocms';

import { Context } from '~/@types';
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

  return { post };
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
      content: `https://wouterds.com/images${
        new URL(post.poster.url).pathname
      }`,
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
      content: `https://wouterds.com/images${
        new URL(post.poster.url).pathname
      }`,
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
  const { post } = useLoaderData<typeof loader>();

  return (
    <article className="prose prose-zinc dark:prose-invert prose-sm max-w-none text-xs leading-relaxed">
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
            <img
              loading="lazy"
              src={`/images${new URL(image.url).pathname}`}
              alt={image.alt || undefined}
            />
          </li>
        ))}
      </ul>
    );
  }

  return null;
};
