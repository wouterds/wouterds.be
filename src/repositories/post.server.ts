import { GetAllPostsDocument, GetAllPostsQuery } from '~/graphql';
import { fetchFromDato } from '~/services/datocms.server';

export class PostRepository {
  private _apiEndpoint: string;
  private _apiKey: string;

  public constructor(apiEndpoint: string, apiKey: string) {
    this._apiEndpoint = apiEndpoint;
    this._apiKey = apiKey;
  }

  public getAll = async () => {
    const data = await fetchFromDato<GetAllPostsQuery>(GetAllPostsDocument, {
      apiEndpoint: this._apiEndpoint,
      apiKey: this._apiKey,
    });

    return data.allPosts;
  };
}
