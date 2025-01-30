import clsx from 'clsx';
import { type ReactNode, useState } from 'react';
import { Bar, BarChart as Chart, ResponsiveContainer, Tooltip, YAxis } from 'recharts';
import colors from 'tailwindcss/colors';

type Props = {
  data: Array<Record<string, unknown>>;
  dataKey: string;
  unit: string;
  label: string;
  rounding?: number;
  className?: string;
  footer?: ReactNode[];
  syncId?: string;
};

export const BarChart = ({
  data,
  dataKey,
  unit,
  label,
  rounding = 2,
  className,
  footer,
  syncId,
}: Props) => {
  const chartColor = colors.lime[600];
  const activeColor = colors.lime[700];
  const filteredComponents = footer?.filter(Boolean);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const value = ((data?.[activeIndex || data.length - 1]?.[dataKey] as number) || 0)?.toFixed(
    rounding,
  );

  return (
    <>
      <div className={clsx('w-full max-w-52 shrink-0', className)}>
        <div className="h-[60px]">
          <ResponsiveContainer>
            <Chart data={data} syncId={syncId} margin={{ right: 3, left: 3, bottom: 6 }}>
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
        <div className="font-medium bg-gray-200/50 text-gray-600 py-0.5 text-xs text-center rounded-tl-full rounded-r-full">
          {activeIndex !== null ? `${value}${unit}` : label}
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
