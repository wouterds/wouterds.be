import clsx from 'clsx';
import { useEffect, useState } from 'react';

export interface CodeProps {
  className?: string;
  children?: string;
  lang: string;
}

export const Code = ({ children: code, lang, className }: CodeProps) => {
  const [highlightedCode, setHighlightedCode] = useState<string>();

  useEffect(() => {
    if (!code) {
      return;
    }

    // @ts-expect-error: import from esm.sh to avoid large worker bundle
    import('https://esm.sh/shiki@1.5.2').then(async ({ codeToHtml }) => {
      setHighlightedCode(await codeToHtml(code, { lang, theme: 'github-light' }));
    });
  }, [code, lang]);

  if (!code) {
    return null;
  }

  return (
    <pre className={clsx('text-slate-700 rounded overflow-x-auto', className)}>
      {highlightedCode ? (
        <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
      ) : (
        <code>{code}</code>
      )}
    </pre>
  );
};
