import clsx from 'clsx';
import { useMemo } from 'react';
import { Bar, BarChart as Chart, ResponsiveContainer, YAxis } from 'recharts';

import { useIsDarkMode } from '~/hooks/use-is-dark-mode';

type Props = {
  data: Array<Record<string, unknown>>;
  dataKey: string;
  label: string;
  header?: string;
  unit: string;
  className?: string;
};

export const BarChart = ({ data, dataKey, unit, label, header, className }: Props) => {
  const isDarkMode = useIsDarkMode();
  const chartColor = useMemo(() => (isDarkMode ? '#fff' : '#000'), [isDarkMode]);

  return (
    <div className={clsx('border border-black dark:border-white text-center', className)}>
      <div className="py-2">
        <span className="font-semibold">
          {header || `${((data?.[data.length - 1]?.[dataKey] as number) || 0)?.toFixed(2)} ${unit}`}
        </span>
      </div>
      <div className="relative aspect-[8/1] sm:aspect-[10/1] -mt-1">
        <ResponsiveContainer>
          <Chart data={data}>
            <YAxis hide />
            <Bar dataKey={dataKey} fill={chartColor} minPointSize={1} />
          </Chart>
        </ResponsiveContainer>
      </div>
      <div
        className="font-medium bg-black dark:bg-white text-white dark:text-black py-0.5"
        style={{ margin: 1 }}>
        {label}
      </div>
    </div>
  );
};
