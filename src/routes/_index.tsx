import { useLoaderData } from '@remix-run/react';

import { Posts } from '~/components/Posts';
import { PostRecord } from '~/graphql';
import { PostRepository } from '~/repositories/post.server';

export const loader = async () => {
  const posts = await PostRepository.getAll();

  return { posts };
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const posts = data.posts as Partial<PostRecord>[];

  return (
    <>
      <header className="text-center mb-12">
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
      <section>
        <Posts posts={posts} />
      </section>
    </>
  );
}
