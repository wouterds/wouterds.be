import { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';

import { Posts } from '~/components/Posts';
import { PostRecord } from '~/graphql';
import { PostRepository } from '~/repositories/post.server';
import { Context } from '~/types';

export const loader = async (args: LoaderFunctionArgs) => {
  const context = args.context as Context;
  const repository = new PostRepository(
    context.env.DATOCMS_API_URL,
    context.env.DATOCMS_API_KEY,
  );

  const posts = await repository.getAll();

  return { posts };
};

export const meta: MetaFunction = () => {
  return [{ title: 'Blog - Wouter De Schuyter' }];
};

export default function Blog() {
  const data = useLoaderData<typeof loader>();
  const posts = data.posts as Partial<PostRecord>[];

  return (
    <section>
      <Posts posts={posts} />
    </section>
  );
}
