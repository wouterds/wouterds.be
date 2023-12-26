import { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import {
  RenderBlockContext,
  StructuredText,
  StructuredTextDocument,
} from 'react-datocms';

import { Context } from '~/@types';
import { PostGalleryRecord } from '~/graphql';
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
  return [{ title: data?.post?.title }];
};

export default function BlogSlug() {
  const { post } = useLoaderData<typeof loader>();

  return (
    <article className="prose prose-sm max-w-none text-xs">
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
      <ul className="not-prose flex flex-col gap-2 mt-4">
        {record.images.map((image) => (
          <li key={`post-gallery.image:${image.id}`}>
            <img src={image.url} alt={image.alt || undefined} />
          </li>
        ))}
      </ul>
    );
  }

  return null;
};
