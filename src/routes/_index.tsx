import { LoaderFunctionArgs } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';

import { fetchPosts } from '~/lib/datocms.server';
import { extractDatocmsApiKey } from '~/lib/env.server';

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const DATOCMS_API_KEY = extractDatocmsApiKey(context);

  const posts = await fetchPosts(DATOCMS_API_KEY);

  return { posts };
};

export default function Index() {
  const { posts } = useLoaderData<typeof loader>();

  return (
    <div>
      <header className="text-center">
        <img
          src="/images/wouterds.2024.jpg"
          alt="Headshot of Wouter De Schuyter"
          className="rounded-full w-32 h-32 mx-auto mb-4"
        />
        <h1 className="text-2xl font-medium mb-2">Wouter De Schuyter</h1>
        <h2 className="text-black dark:text-white text-opacity-50 dark:text-opacity-50">
          Digital Creative & Developer
        </h2>
      </header>
      <section>
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <a href={`/posts/${post.slug}`}>{post.title}</a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
