import { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';

import { Context } from '~/@types';
import { Posts } from '~/components/Posts';
import { PostRepository } from '~/lib/repositories/post.server';

export const loader = async (args: LoaderFunctionArgs) => {
  const context = args.context as Context;
  const repository = new PostRepository(
    context.env.DATOCMS_API_URL,
    context.env.DATOCMS_API_KEY,
  );

  const posts = await repository.getAll();

  return { posts };
};

export default function Index() {
  const { posts } = useLoaderData<typeof loader>();

  return (
    <>
      <header className="text-center mb-14">
        <img
          src="/images/wouterds.2024.jpg"
          alt="Headshot of Wouter De Schuyter"
          className="rounded-full w-32 h-32 mx-auto mb-4 bg-zinc-100 dark:bg-zinc-800 dark:bg-opacity-50"
        />
        <h1 className="text-2xl font-medium mb-2">Wouter De Schuyter</h1>
        <h2 className="text-black dark:text-white text-opacity-50 dark:text-opacity-50">
          Digital Creative & Developer
        </h2>
      </header>

      <Posts posts={posts} />
    </>
  );
}
