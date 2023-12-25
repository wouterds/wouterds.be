import { ASTNode, print } from 'graphql';

export const fetchFromDato = async <TData, TVariables = Record<string, string>>(
  query: ASTNode,
  options: {
    apiEndpoint: string;
    apiKey: string;
    variables?: TVariables;
  },
) => {
  const response = await fetch(options.apiEndpoint, {
    method: 'POST',
    headers: { Authorization: `Bearer ${options.apiKey}` },
    body: JSON.stringify({ query: print(query), variables: options.variables }),
  });

  const { data } = await response.json<{ data: TData }>();

  return data;
};
