import { AppLoadContext } from '@remix-run/cloudflare';

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

type _Post = NonNullable<PostsGetAllQuery['allPosts'][number]>;

export type Post = _Post & { excerpt: string };

export class PostRepository extends DatoCMSRepository {
  public static create = (context: AppLoadContext) => new PostRepository(context);

  public getPosts = async (limit: number = 100) => {
    const data = await this.fetch<PostsGetAllQuery, PostsGetAllQueryVariables>(
      PostsGetAllDocument,
      { variables: { limit } },
    );

    return data.allPosts.map(this.mapPost);
  };

  public getPostBySlug = async (slug: string) => {
    const data = await this.fetch<PostsGetBySlugQuery, PostsGetBySlugQueryVariables>(
      PostsGetBySlugDocument,
      { variables: { slug } },
    );

    return data.post;
  };

  private mapPost = (post: _Post): Post => ({
    ...post,
    excerpt: excerptFromContent(post.content),
  });
}
