import {
  PostsGetAllDocument,
  PostsGetAllQuery,
  PostsGetAllQueryVariables,
  PostsGetBySlugDocument,
  PostsGetBySlugQuery,
  PostsGetBySlugQueryVariables,
} from '~/graphql';
import { excerptFromContent } from '~/lib/datocms/structured-text-utils';

import { DatoCMSRepository } from './abstract/datocms-repository.server';

export type Post = PostsGetAllQuery['allPosts'][0] & { excerpt: string };

export class PostRepository extends DatoCMSRepository {
  public getPosts = async (limit: number = 100) => {
    const data = await this.fetch<PostsGetAllQuery, PostsGetAllQueryVariables>(
      PostsGetAllDocument,
      { variables: { limit } },
    );

    const posts = data.allPosts.map(
      (post) =>
        ({
          ...post,
          excerpt: excerptFromContent(post.content),
        }) as Post,
    );

    return posts;
  };

  public getPostBySlug = async (slug: string) => {
    const data = await this.fetch<PostsGetBySlugQuery, PostsGetBySlugQueryVariables>(
      PostsGetBySlugDocument,
      { variables: { slug } },
    );

    return data.post;
  };
}
