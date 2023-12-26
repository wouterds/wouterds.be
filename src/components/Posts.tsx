import { PostRecord } from '~/graphql';

export interface PostsProps {
  posts: Partial<PostRecord & { excerpt: string }>[];
}

export const Posts = ({ posts }: PostsProps) => {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <h3 className="text-base font-medium mb-2">
            <a href={`/blog/${post.slug}`}>{post.title}</a>
          </h3>
          <p className="leading-relaxed line-clamp-2">{post.excerpt}</p>
        </li>
      ))}
    </ul>
  );
};
