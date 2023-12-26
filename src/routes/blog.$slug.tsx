import { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { render as renderToPlainText } from 'datocms-structured-text-to-plain-text';
import {
  RenderBlockContext,
  StructuredText,
  StructuredTextDocument,
} from 'react-datocms';

import { Context } from '~/@types';
import { PostGalleryRecord, PostRecord } from '~/graphql';
import { extractDescriptionFromContent } from '~/lib/datocms/extract-description-from-content';
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
  const description = extractDescriptionFromContent(
    post.content as unknown as StructuredTextDocument,
  );
  const text = renderToPlainText(
    post.content as unknown as StructuredTextDocument,
  );
  const readingTime = Math.ceil((text?.split(' ')?.length || 0) / 140);

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
      name: 'twitter:title',
      content: title,
    },
    {
      name: 'twitter:description',
      content: description,
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
      content: `${readingTime} minutes`,
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

export const renderBlock = ({
  record,
}: RenderBlockContext<PostGalleryRecord & { __typename: string }>) => {
  if (record.__typename === 'PostGalleryRecord') {
    return (
      <ul className="not-prose flex flex-col gap-3 mt-6">
        {record.images.map((image) => (
          <li key={`post-gallery.image:${image.id}`}>
            <img
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
