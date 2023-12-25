import { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';

import { PostRepository } from '~/repositories/post.server';
import { Context } from '~/types';

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
    <article>
      <h1 className="text-2xl">{post.title}</h1>
    </article>
  );
}
