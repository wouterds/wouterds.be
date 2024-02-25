import { Link } from '@remix-run/react';
import { format } from 'date-fns';

import { type Post } from '~/lib/repositories/post.server';

export interface PostsProps {
  posts: Post[];
}

export const Posts = ({ posts }: PostsProps) => {
  return (
    <ul className="flex flex-col w-full gap-6 sm:gap-10">
      {posts.map((post) => {
        return (
          <li key={post.id}>
            <time
              className="text-xs text-zinc-400 dark:text-zinc-500 mb-1 block"
              dateTime={post.date}>
              {format(post.date, 'MMMM do, yyyy')}
            </time>
            <h3 className="text-base font-medium mb-2">
              <Link to={`/blog/${post.slug}`} prefetch="intent" className="inline">
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
