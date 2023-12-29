import { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';

import { Posts } from '~/components/Posts';
import { PostRepository } from '~/lib/repositories/post.server';

export const loader = async (args: LoaderFunctionArgs) => {
  const context = args.context as Context;
  const repository = new PostRepository(
    context.env.DATOCMS_API_URL,
    context.env.DATOCMS_API_KEY,
  );

  const posts = await repository.getPosts(100);

  return { posts };
};

export const meta: MetaFunction = () => {
  return [{ title: 'Blog' }];
};

export default function Blog() {
  const { posts } = useLoaderData<typeof loader>();

  return <Posts posts={posts} />;
}
