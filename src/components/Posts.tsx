import { PostRecord } from '~/graphql';

export interface PostsProps {
  posts: Partial<PostRecord>[];
}

export const Posts = ({ posts }: PostsProps) => {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <h3 className="text-base font-medium">
            <a href={`/blog/${post.slug}`}>{post.title}</a>
          </h3>
        </li>
      ))}
    </ul>
  );
};
