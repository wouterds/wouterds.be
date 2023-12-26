import { StructuredTextDocument } from 'datocms-structured-text-to-plain-text';

import {
  PostsGetAllDocument,
  PostsGetAllQuery,
  PostsGetBySlugDocument,
  PostsGetBySlugQuery,
  PostsGetBySlugQueryVariables,
} from '~/graphql';
import { fetchFromDato } from '~/lib/datocms/client.server';

import { extractDescriptionFromContent } from '../datocms/extract-description-from-content';

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

    return data.allPosts.map((post) => {
      const content = post.content as unknown as StructuredTextDocument;

      return {
        ...post,
        content,
        excerpt: extractDescriptionFromContent(content),
      };
    });
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
