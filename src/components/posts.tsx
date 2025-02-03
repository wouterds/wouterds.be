import { format } from 'date-fns';
import { Link } from 'react-router';

import type { Post } from '~/graphql';

export interface PostsProps {
  posts: Post[];
}

export const Posts = ({ posts }: PostsProps) => {
  return (
    <ul className="flex flex-col w-full gap-8 sm:gap-12">
      {posts.map((post) => (
        <li key={post.id}>
          <Link to={`/blog/${post.slug}`} prefetch="intent" className="block group no-underline">
            <time
              className="text-xs uppercase font-medium text-zinc-400 dark:text-zinc-500 mb-1 block"
              dateTime={post.date}>
              {format(post.date, 'MMMM do, yyyy')}
            </time>
            <h3 className="text-xl font-semibold mb-0.5 text-zinc-600 group-hover:text-black dark:text-zinc-300 dark:group-hover:text-white transition-colors duration-500 sm:truncate">
              {post.title}
            </h3>
            <p className="leading-relaxed line-clamp-3 sm:line-clamp-2 text-zinc-500 dark:text-zinc-400">
              {post.excerpt}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
};
