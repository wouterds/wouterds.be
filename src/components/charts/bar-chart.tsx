import clsx from 'clsx';
import { ReactNode, useMemo, useState } from 'react';
import { Bar, BarChart as Chart, ResponsiveContainer, Tooltip, YAxis } from 'recharts';
import colors from 'tailwindcss/colors';

import { useIsDarkMode } from '~/hooks/use-is-dark-mode';

type Props = {
  data: Array<Record<string, unknown>>;
  dataKey: string;
  label: string;
  header?: string;
  unit: string;
  rounding?: number;
  className?: string;
  footer?: ReactNode[];
  syncId?: string;
};

export const BarChart = ({
  data,
  dataKey,
  unit,
  rounding = 2,
  label,
  header,
  className,
  footer,
  syncId,
}: Props) => {
  const isDarkMode = useIsDarkMode();
  const chartColor = useMemo(() => (isDarkMode ? '#fff' : '#000'), [isDarkMode]);
  const filteredComponents = footer?.filter(Boolean);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <>
      <div className={clsx('border border-black dark:border-white text-center', className)}>
        <div className="py-2">
          <span
            className={clsx('font-semibold', {
              'text-rose-500': typeof activeIndex === 'number',
            })}>
            {typeof activeIndex === 'number' || !header
              ? `${((data?.[activeIndex || data.length - 1]?.[dataKey] as number) || 0)?.toFixed(
                  rounding,
                )}${unit}`
              : header}
          </span>
        </div>
        <div className="relative aspect-[8/1] sm:aspect-[10/1] -mt-2">
          <ResponsiveContainer>
            <Chart data={data} syncId={syncId}>
              <YAxis hide />
              <Bar
                dataKey={dataKey}
                fill={chartColor}
                minPointSize={1}
                activeBar={{ fill: colors.rose['500'] }}
              />
              <Tooltip
                cursor={false}
                content={(args) => {
                  if (args.active) {
                    setActiveIndex(args.label);
                  } else {
                    setActiveIndex(null);
                  }
                  return null;
                }}
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
