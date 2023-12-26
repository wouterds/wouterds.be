import { StructuredTextDocument } from 'datocms-structured-text-to-plain-text';

import { extractDescriptionFromContent } from '~/lib/datocms/extract-description-from-content';
import { Posts as PostsType } from '~/lib/repositories/post.server';

export interface PostsProps {
  posts: PostsType;
}

export const Posts = ({ posts }: PostsProps) => {
  return (
    <ul className="flex flex-col w-full gap-12">
      {posts.map((post) => {
        return (
          <li key={post.id}>
            <h3 className="text-base font-medium mb-2">
              <a href={`/blog/${post.slug}`}>{post.title}</a>
            </h3>
            <p className="leading-relaxed line-clamp-2 text-zinc-700 dark:text-zinc-300">
              {extractDescriptionFromContent(
                post.content as unknown as StructuredTextDocument,
              )}
            </p>
          </li>
        );
      })}
    </ul>
  );
};
