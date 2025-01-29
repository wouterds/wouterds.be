import type { ReactNode } from 'react';

type Props = {
  title: string;
  children: ReactNode;
  onHoverIn?: () => void;
  onHoverOut?: () => void;
};

export const ExperimentCard = ({ title, children, onHoverIn, onHoverOut }: Props) => {
  return (
    <div
      className="flex items-center min-w-fit border-r border-gray-200 px-3 pr-0 last:border-r-0 last:pr-0"
      onMouseEnter={onHoverIn}
      onMouseLeave={onHoverOut}>
      <div className="px-3 py-1 bg-lime-600 rounded-tl-full rounded-r-full text-xs leading-tight uppercase font-medium text-white">
        {title}
      </div>
      <div className="flex items-center gap-4 px-3">{children}</div>
    </div>
  );
};
