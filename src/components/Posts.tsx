import { Link } from '@remix-run/react';

import { type Post } from '~/lib/repositories/post.server';

export interface PostsProps {
  posts: Post[];
}

export const Posts = ({ posts }: PostsProps) => {
  return (
    <ul className="flex flex-col w-full gap-6 sm:gap-12">
      {posts.map((post) => {
        return (
          <li key={post.id}>
            <h3 className="text-base font-medium mb-2">
              <Link to={`/blog/${post.slug}`} prefetch="intent">
                {post.title}
              </Link>
            </h3>
            <p className="leading-relaxed line-clamp-3 sm:line-clamp-2 text-zinc-700 dark:text-zinc-300">
              {post.excerpt}
            </p>
          </li>
        );
      })}
    </ul>
  );
};
