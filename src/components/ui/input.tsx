import { type ComponentProps, forwardRef } from 'react';

import { cn } from '~/lib/utils';

const Input = forwardRef<HTMLInputElement, ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-md border border-zinc-300 bg-zinc-50 px-3 py-1.5 text-base transition-colors file:border-0 file:bg-zinc-50 file:text-sm file:font-medium placeholder:text-muted-foreground focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-400 dark:focus:ring-blue-600 dark:focus:border-blue-600 dark:file:bg-zinc-800 dark:file:text-zinc-100',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
