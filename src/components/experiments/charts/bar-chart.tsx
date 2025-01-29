import clsx from 'clsx';
import { type ReactNode, useState } from 'react';
import { Bar, BarChart as Chart, ResponsiveContainer, Tooltip, YAxis } from 'recharts';
import colors from 'tailwindcss/colors';

type Props = {
  data: Array<Record<string, unknown>>;
  dataKey: string;
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
  className,
  footer,
  syncId,
}: Props) => {
  const chartColor = colors.lime[500];
  const activeColor = colors.lime[600];
  const filteredComponents = footer?.filter(Boolean);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const value = ((data?.[activeIndex || data.length - 1]?.[dataKey] as number) || 0)?.toFixed(
    rounding,
  );

  return (
    <>
      <div className={clsx('w-full', className)}>
        <div className="h-[60px]">
          <ResponsiveContainer>
            <Chart data={data} syncId={syncId} margin={{ right: 1, left: 2, bottom: 3 }}>
              <YAxis hide />
              <Bar
                dataKey={dataKey}
                fill={chartColor}
                minPointSize={1}
                activeBar={{ fill: activeColor, strokeWidth: 0 }}
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
        <div className="font-medium bg-gray-100 text-gray-500 py-0.5 text-xs text-center">
          {value}
          {unit}
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
