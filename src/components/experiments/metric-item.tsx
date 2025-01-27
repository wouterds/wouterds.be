import type { MetricProps } from './types';

export const MetricItem = ({ icon: Icon, value, unit = '', href }: MetricProps) => {
  const content = (
    <>
      <Icon size={16} />
      <span>
        {value}
        {unit}
      </span>
    </>
  );

  return (
    <div className="flex items-center gap-1.5 tabular-nums">
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
