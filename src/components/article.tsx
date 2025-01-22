import { forwardRef, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export const Article = forwardRef<HTMLElement, Props>(({ children }, ref) => (
  <article ref={ref} className="prose prose-gray max-w-none">
    {children}
  </article>
));

Article.displayName = 'Article';
