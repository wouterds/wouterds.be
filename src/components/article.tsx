import { forwardRef, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export const Article = forwardRef<HTMLElement, Props>(({ children }, ref) => (
  <article
    ref={ref}
    className="prose prose-gray max-w-none [&_a]:no-underline [&_a]:font-normal [&_a]:border-b [&_a]:border-gray-300 [&_a:hover]:border-gray-600 [&_a]:transition-colors [&_a]:duration-500 [&_a]:pb-[1px]">
    {children}
  </article>
));

Article.displayName = 'Article';
