import { ASTNode, print } from 'graphql';

export abstract class DatoCMSRepository {
  private _apiKey: string;

  public constructor(key: string) {
    this._apiKey = key;
  }

  protected fetch = async <TData, TVariables = Record<string, string>>(
    query: ASTNode,
    options: {
      variables?: TVariables;
    },
  ) => {
    const response = await fetch('https://graphql.datocms.com', {
      method: 'POST',
      headers: { Authorization: `Bearer ${this._apiKey}` },
      body: JSON.stringify({ query: print(query), variables: options.variables }),
    });

    return response.json<{ data: TData }>().then(({ data }) => data);
  };
}
