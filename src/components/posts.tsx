import { format } from 'date-fns';
import { Link } from 'react-router';

import type { Post } from '~/graphql';

export interface PostsProps {
  posts: Post[];
}

export const Posts = ({ posts }: PostsProps) => {
  return (
    <ul className="flex flex-col w-full gap-6 sm:gap-10">
      {posts.map((post) => (
        <li key={post.id}>
          <Link to={`/blog/${post.slug}`} prefetch="intent" className="block group">
            <time
              className="text-sm uppercase font-medium text-gray-400 mb-1 block"
              dateTime={post.date}>
              {format(post.date, 'MMMM do, yyyy')}
            </time>
            <h3 className="text-xl font-medium mb-0.5 text-gray-600 group-hover:text-black hover:text-black transition-colors duration-500 truncate">
              {post.title}
            </h3>
            <p className="leading-relaxed line-clamp-3 sm:line-clamp-2 text-gray-500">
              {post.excerpt}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
};
