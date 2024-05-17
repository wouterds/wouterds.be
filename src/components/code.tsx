import { useEffect, useState } from 'react';
import { BundledLanguage, LanguageInput, ThemeInput } from 'shiki';

export interface CodeProps {
  children?: string;
  lang: BundledLanguage;
}

export const Code = (props: CodeProps) => {
  const { children: code, lang } = props;

  const [highlightedCode, setHighlightedCode] = useState<string>();
  useEffect(() => {
    if (!code) {
      return;
    }

    // https://shiki.style/guide/install#fine-grained-bundle
    import('shiki/core').then(async ({ getHighlighterCore }) => {
      const langs: LanguageInput[] = [];
      switch (lang) {
        case 'javascript':
          langs.push(import('shiki/langs/javascript.mjs'));
          break;
        case 'typescript':
          langs.push(import('shiki/langs/typescript.mjs'));
          break;
        case 'json':
          langs.push(import('shiki/langs/json.mjs'));
          break;
        case 'bash':
          langs.push(import('shiki/langs/bash.mjs'));
          break;
        default:
          langs.push(import('shiki/langs/console.mjs'));
          break;
      }

      const themes: ThemeInput[] = [import('shiki/themes/dracula.mjs')];

      const highlighter = await getHighlighterCore({
        themes,
        langs,
        loadWasm: await import('shiki/wasm'),
      });

      setHighlightedCode(highlighter.codeToHtml(code, { lang, theme: 'dracula' }));
    });
  }, [code, lang]);

  if (!code) {
    return null;
  }

  return (
    <pre className="bg-slate-800 text-slate-400 p-4 rounded overflow-x-auto">
      {highlightedCode ? (
        <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
      ) : (
        <code>{code}</code>
      )}
    </pre>
  );
};
