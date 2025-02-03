import type { ReactNode } from 'react';

type Props = {
  title: string;
  children: ReactNode;
};

export const ExperimentCard = ({ title, children }: Props) => {
  return (
    <div className="flex items-center min-w-fit border-r border-zinc-200 dark:border-zinc-800 px-3 pr-0 last:border-r-0 last:pr-0">
      <div className="px-3 py-1 bg-lime-600 group-hover:bg-lime-600/90 transition-colors duration-300 rounded-tl-full rounded-r-full text-xs leading-tight uppercase font-medium text-white">
        {title}
      </div>
      <div className="flex items-center gap-4 px-3">{children}</div>
    </div>
  );
};
