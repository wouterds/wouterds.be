import {
  GetNextPostDocument,
  type GetNextPostQuery,
  type GetNextPostQueryVariables,
  GetPostDocument,
  type GetPostQuery,
  type GetPostQueryVariables,
  GetPostsDocument,
  type GetPostsQuery,
  type GetPostsQueryVariables,
  GetPreviousPostDocument,
  type GetPreviousPostQuery,
  type GetPreviousPostQueryVariables,
} from '~/graphql';
import { excerptFromContent } from '~/lib/datocms.server';

import { DatoCMSRepository } from '../abstract-datocms-repository';

export type Posts = NonNullable<Awaited<ReturnType<PostRepository['getPosts']>>>;

export class PostRepository extends DatoCMSRepository {
  public getPosts = async (limit: number = 100) => {
    const data = await this.fetch<GetPostsQuery, GetPostsQueryVariables>(GetPostsDocument, {
      variables: { limit },
    });

    return data.allPosts.map((post) => ({
      ...post,
      excerpt: excerptFromContent(post.content),
    }));
  };

  public getPost = async (slug: string) => {
    const data = await this.fetch<GetPostQuery, GetPostQueryVariables>(GetPostDocument, {
      variables: { slug },
    });

    return data.post;
  };

  public getPreviousPost = async (slug: string, date: string) => {
    const data = await this.fetch<GetPreviousPostQuery, GetPreviousPostQueryVariables>(
      GetPreviousPostDocument,
      { variables: { slug, date } },
    );

    return data.post || null;
  };

  public getNextPost = async (slug: string, date: string) => {
    const data = await this.fetch<GetNextPostQuery, GetNextPostQueryVariables>(
      GetNextPostDocument,
      { variables: { slug, date } },
    );

    return data.post || null;
  };
}
