import { useEffect, useState } from 'react';

import { useIsDarkMode } from '~/hooks/use-is-dark-mode';

export interface CodeProps {
  children?: string;
  lang: string;
}

export const Code = (props: CodeProps) => {
  const { children: code, lang } = props;
  const isDarkMode = useIsDarkMode();

  const [highlightedCode, setHighlightedCode] = useState<string>();
  useEffect(() => {
    if (!code) {
      return;
    }

    // @ts-expect-error: import from esm.sh to avoid large worker bundle
    import('https://esm.sh/shiki@1.5.2').then(async ({ codeToHtml }) => {
      setHighlightedCode(
        await codeToHtml(code, { lang, theme: isDarkMode ? 'github-dark' : 'github-light' }),
      );
    });
  }, [code, isDarkMode, lang]);

  if (!code) {
    return null;
  }

  return (
    <pre className="text-slate-700 dark:text-slate-300 rounded overflow-x-auto">
      {highlightedCode ? (
        <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
      ) : (
        <code>{code}</code>
      )}
    </pre>
  );
};
