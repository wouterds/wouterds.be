import {
  PostsGetAllDocument,
  PostsGetAllQuery,
  PostsGetBySlugDocument,
  PostsGetBySlugQuery,
  PostsGetBySlugQueryVariables,
} from '~/graphql';
import { fetchFromDato } from '~/lib/datocms/client.server';
import { excerptFromContent } from '~/lib/datocms/structured-text-utils';

export type Post = PostsGetAllQuery['allPosts'][0] & { excerpt: string };

export class PostRepository {
  private _apiEndpoint: string;
  private _apiKey: string;

  public constructor(apiEndpoint: string, apiKey: string) {
    this._apiEndpoint = apiEndpoint;
    this._apiKey = apiKey;
  }

  public getAll = async () => {
    const data = await fetchFromDato<PostsGetAllQuery>(PostsGetAllDocument, {
      apiEndpoint: this._apiEndpoint,
      apiKey: this._apiKey,
    });

    const posts = data.allPosts.map(
      (post) =>
        ({
          ...post,
          excerpt: excerptFromContent(post.content),
        }) as Post,
    );

    return posts;
  };

  public getBySlug = async (slug: string) => {
    const data = await fetchFromDato<
      PostsGetBySlugQuery,
      PostsGetBySlugQueryVariables
    >(PostsGetBySlugDocument, {
      apiEndpoint: this._apiEndpoint,
      apiKey: this._apiKey,
      variables: { slug },
    });

    return data.post;
  };
}
