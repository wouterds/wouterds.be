import { AppLoadContext } from '@remix-run/cloudflare';

import {
  GetPostDocument,
  GetPostQuery,
  GetPostQueryVariables,
  GetPostsDocument,
  GetPostsQuery,
  GetPostsQueryVariables,
} from '~/graphql';
import { excerptFromContent } from '~/lib/datocms/structured-text-utils';

import { DatoCMSRepository } from './abstract/datocms-repository.server';

type _Post = NonNullable<GetPostsQuery['allPosts'][number]>;

export type Post = _Post & { excerpt: string };

export class PostRepository extends DatoCMSRepository {
  public static create = (context: AppLoadContext) => new PostRepository(context);

  public getPosts = async (limit: number = 100) => {
    const data = await this.fetch<GetPostsQuery, GetPostsQueryVariables>(GetPostsDocument, {
      variables: { limit },
    });

    return data.allPosts.map(this.mapPost);
  };

  public getPost = async (slug: string) => {
    const data = await this.fetch<GetPostQuery, GetPostQueryVariables>(GetPostDocument, {
      variables: { slug },
    });

    return data.post;
  };

  private mapPost = (post: _Post): Post => ({
    ...post,
    excerpt: excerptFromContent(post.content),
  });
}
