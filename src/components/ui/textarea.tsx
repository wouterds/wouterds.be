import { type ComponentProps, forwardRef } from 'react';

import { cn } from '~/lib/utils';

const Textarea = forwardRef<HTMLTextAreaElement, ComponentProps<'textarea'>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-32 w-full rounded-md border border-zinc-300 bg-zinc-50 px-3 py-2 text-base placeholder:text-muted-foreground transition-colors focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-400 dark:focus:ring-blue-600 dark:focus:border-blue-600',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = 'Textarea';

export { Textarea };
