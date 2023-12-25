import { GetAllPostsDocument, GetAllPostsQuery } from '~/graphql';
import { fetchFromDato } from '~/services/datocms.server';

export class PostRepository {
  private static _apiEndpoint: string;
  private static _apiKey: string;

  public static set apiEndpoint(value: string) {
    this._apiEndpoint = value;
  }

  public static set apiKey(value: string) {
    this._apiKey = value;
  }

  public static getAll = async () => {
    const data = await fetchFromDato<GetAllPostsQuery>(GetAllPostsDocument, {
      apiEndpoint: this._apiEndpoint,
      apiKey: this._apiKey,
    });

    return data.allPosts;
  };
}
