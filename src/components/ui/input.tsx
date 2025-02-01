import { type ComponentProps, forwardRef } from 'react';

import { cn } from '~/lib/utils';

const Input = forwardRef<HTMLInputElement, ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-1.5 text-base transition-colors focus:ring-blue-500 focus:border-blue-500 file:border-0 file:bg-gray-50 file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
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
