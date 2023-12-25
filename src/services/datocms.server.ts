import { ASTNode, print } from 'graphql';

export const fetchFromDato = async <TData>(
  query: ASTNode,
  options: { apiEndpoint: string; apiKey: string },
): Promise<TData> => {
  const response = await fetch(options.apiEndpoint, {
    method: 'POST',
    headers: { Authorization: `Bearer ${options.apiKey}` },
    body: JSON.stringify({ query: print(query) }),
  });

  const { data } = await response.json<{ data: TData }>();

  return data;
};
