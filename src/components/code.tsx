import { useEffect, useState } from 'react';

export interface CodeProps {
  children?: string;
  lang: string;
}

export const Code = (props: CodeProps) => {
  const { children: code, lang } = props;

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
    <pre className="text-slate-600 rounded overflow-x-auto">
      {highlightedCode ? (
        <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
      ) : (
        <code>{code}</code>
      )}
    </pre>
  );
};
