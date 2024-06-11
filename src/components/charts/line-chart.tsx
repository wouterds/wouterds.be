import clsx from 'clsx';
import { ReactNode, useMemo } from 'react';
import { Line, LineChart as Chart, ResponsiveContainer, YAxis } from 'recharts';

import { useIsDarkMode } from '~/hooks/use-is-dark-mode';

type Props = {
  data: Array<Record<string, unknown>>;
  dataKey: string;
  label: string;
  header?: string;
  unit: string;
  className?: string;
  compact?: boolean;
  footer?: ReactNode[];
  scale?: { min: number; max: number };
  syncId?: string;
};

export const LineChart = ({
  data,
  scale,
  dataKey,
  unit,
  compact,
  label,
  header,
  className,
  footer,
  syncId,
}: Props) => {
  const isDarkMode = useIsDarkMode();
  const chartColor = useMemo(() => (isDarkMode ? '#fff' : '#000'), [isDarkMode]);
  const filteredComponents = footer?.filter(Boolean);

  return (
    <>
      <div className={clsx('border border-black dark:border-white text-center', className)}>
        <div className="py-2">
          <span className="font-semibold">
            {header ||
              `${((data?.[data.length - 1]?.[dataKey] as number) || 0)?.toFixed(2)} ${unit}`}
          </span>
        </div>
        <div
          className={clsx('relative', {
            'aspect-[8/1] sm:aspect-[10/1] -mt-1': !compact,
            'aspect-[4/1] -my-1': compact,
          })}>
          <ResponsiveContainer>
            <Chart data={data} syncId={syncId}>
              <Line dataKey={dataKey} stroke={chartColor} strokeWidth={1.5} dot={false} />
              <YAxis
                hide
                domain={
                  scale
                    ? [
                        Math.min(...data.map((record) => record[dataKey] as number)) * scale.min,
                        Math.max(...data.map((record) => record[dataKey] as number)) * scale.max,
                      ]
                    : undefined
                }
              />
            </Chart>
          </ResponsiveContainer>
        </div>
        <div
          className="font-medium bg-black dark:bg-white text-white dark:text-black py-0.5"
          style={{ margin: 1 }}>
          {label}
        </div>
      </div>
      {filteredComponents && (
        <p className="flex flex-col sm:flex-row gap-1 justify-start sm:justify-between mt-2">
          {filteredComponents}
        </p>
      )}
    </>
  );
};
