import { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';

import { Posts } from '~/components/Posts';
import { PostRepository } from '~/lib/repositories/post.server';

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const repository = new PostRepository(context.cloudflare.env.DATOCMS_API_KEY);

  const posts = await repository.getPosts(3);

  return { posts };
};

export default function Index() {
  const { posts } = useLoaderData<typeof loader>();

  return (
    <>
      <header className="text-center mb-12">
        <div className="relative overflow-hidden rounded-full w-32 h-32 mx-auto mb-4 bg-zinc-100 dark:bg-zinc-800 dark:bg-opacity-50">
          <img
            src="/images/wouterds-2024-spectrum.jpg"
            alt="Headshot of Wouter De Schuyter"
            className="position absolute inset-0 w-full h-full"
          />
          <img
            src="/images/wouterds-2024.jpg"
            alt="Headshot of Wouter De Schuyter"
            className="position absolute inset-0 w-full h-full opacity-0 hover:opacity-100"
          />
        </div>
        <h1 className="text-2xl font-medium mb-2">Wouter De Schuyter</h1>
        <h2 className="text-black dark:text-white text-opacity-50 dark:text-opacity-50">
          Digital Creative & Developer
        </h2>
      </header>

      <Posts posts={posts} />
    </>
  );
}
