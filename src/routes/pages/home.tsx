import { Link, useLoaderData } from 'react-router';

import { Posts } from '~/components/posts';
import { PostRepository } from '~/graphql/posts/repository.server';

export const loader = async () => {
  const posts = await new PostRepository().getPosts(3);

  return { posts };
};

export default function Home() {
  const { posts } = useLoaderData<typeof loader>();

  return (
    <>
      <header className="text-center mb-12 pt-2">
        <div className="relative overflow-hidden rounded-full w-32 h-32 mx-auto mb-4 bg-zinc-100">
          <img
            src="/images/wouterds-2024.jpg"
            alt="Headshot of Wouter De Schuyter"
            className="position absolute inset-0 w-full h-full"
          />
        </div>
        <h1 className="text-2xl font-medium mb-2">Wouter De Schuyter</h1>
        <h2 className="text-black text-opacity-50">Digital Creative & Developer</h2>
      </header>

      <Posts posts={posts} />

      <div className="mt-6">
        <Link to="/blog">read more &raquo;</Link>
      </div>
    </>
  );
}
