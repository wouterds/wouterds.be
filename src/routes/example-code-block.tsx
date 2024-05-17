import { MetaFunction } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';

import { Code } from '~/components/code';

export const loader = async () => {
  // source of useIsDarkMode hook as example code
  const code = (await import('~/hooks/use-is-dark-mode?raw')).default;

  return { code };
};

export const meta: MetaFunction = () => {
  return [{ title: 'Example code block' }];
};

export default function ExampleCodeBlock() {
  const { code } = useLoaderData<typeof loader>();

  return (
    <>
      <h1 className="text-lg font-semibold mb-4">Example code block with Shiki.js</h1>
      <p className="mb-2">
        Below is a simple code block with the source of a hook to detect dark mode changes.
      </p>
      <Code lang="typescript">{code}</Code>
    </>
  );
}
