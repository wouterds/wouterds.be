import { Link, useLoaderData } from '@remix-run/react';

import { Posts } from '~/components/posts';
import { Post, PostRepository } from '~/data/graphql/posts/repository';

export const loader = async () => {
  const posts = await new PostRepository().getPosts(3);

  return { posts };
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const posts = data.posts as Post[]; // Remix single fetch typing issues

  return (
    <>
      <header className="text-center mb-12 pt-2">
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

      <div className="mt-6">
        <Link to="/blog">read more &raquo;</Link>
      </div>
    </>
  );
}
