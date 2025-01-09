import { addHours } from 'date-fns';
import { type ASTNode, print } from 'graphql';

import { Cache } from '~/lib/cache.server';
import { md5 } from '~/lib/crypto.server';

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
    const request = JSON.stringify({ query: print(query), variables: options.variables });
    const hash = md5(request);

    const cached = await Cache.get(hash);
    if (cached) {
      return cached as TData;
    }

    const response = await fetch('https://graphql.datocms.com', {
      method: 'POST',
      headers: this.headers,
      body: request,
    });

    const data = await response.json().then(({ data }) => data as TData);
    await Cache.set(hash, data, addHours(new Date(), 4));

    return data;
  };
}
