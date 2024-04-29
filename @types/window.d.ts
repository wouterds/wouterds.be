export declare global {
  interface Window {
    shiki: {
      getHighlighter: (options: { theme?: string; langs?: string[] }) => Promise<{
        codeToHtml: (code: string, options?: { lang?: string }) => string;
      }>;
    };
  }
}
