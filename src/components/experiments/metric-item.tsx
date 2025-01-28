import { Skeleton } from '~/components/ui/skeleton';

import type { MetricProps } from './types';

export const MetricItem = ({ icon: Icon, value, unit = '', href }: MetricProps) => {
  const content = (
    <>
      <Icon size={16} />
      {typeof value === 'undefined' ? (
        <Skeleton className="w-7 h-4" />
      ) : (
        <span>
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
