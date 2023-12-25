import { MetaFunction } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';

import { Posts } from '~/components/Posts';
import { PostRecord } from '~/graphql';
import { PostRepository } from '~/repositories/post.server';

export const loader = async (args: LoaderFunctionArgs) => {
  const repository = new PostRepository(
    args.context.env.DATOCMS_API_URL,
    args.context.env.DATOCMS_API_KEY,
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
