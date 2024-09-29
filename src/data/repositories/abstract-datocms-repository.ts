import { ASTNode, print } from 'graphql';

export abstract class DatoCMSRepository {
  private get apiKey() {
    return process.env.DATOCMS_API_KEY;
  }

  private get headers() {
    const headers = new Headers();

    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${this.apiKey}`);

    // if (this.inPreviewMode) {
    //   headers.append('X-Include-Drafts', 'true');
    // }

    return headers;
  }

  protected fetch = async <TData, TVariables = Record<string, string>>(
    query: ASTNode,
    options: {
      variables?: TVariables;
    },
  ) => {
    const response = await fetch('https://graphql.datocms.com', {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ query: print(query), variables: options.variables }),
    });

    return response.json().then(({ data }) => data as TData);
  };
}
