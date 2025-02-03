import type { LucideIcon } from 'lucide-react';

import { Skeleton } from '~/components/ui/skeleton';

export type MetricProps = {
  icon: LucideIcon;
  value?: string | number;
  unit?: string;
  href?: string;
};

export const MetricItem = ({ icon: Icon, value, unit = '', href }: MetricProps) => {
  const content = (
    <>
      <Icon size={16} className="text-zinc-600 dark:text-zinc-400" />
      {typeof value === 'undefined' ? (
        <Skeleton className="w-7 h-4" />
      ) : (
        <span className="text-zinc-700 dark:text-zinc-300">
          {value}
          {unit}
        </span>
      )}
    </>
  );

  return (
    <div className="flex items-center gap-1.5">
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 flex-nowrap">
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  );
};
