import clsx from 'clsx';
import { type ReactNode, useState } from 'react';
import { Line, LineChart as Chart, ResponsiveContainer, Tooltip, YAxis } from 'recharts';
import colors from 'tailwindcss/colors';

type Props = {
  data: Array<Record<string, unknown>>;
  dataKey: string;
  label: string;
  header?: string;
  unit: string;
  rounding?: number;
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
  rounding = 2,
  compact,
  label,
  header,
  className,
  footer,
  syncId,
}: Props) => {
  const filteredComponents = footer?.filter(Boolean);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <>
      <div className={clsx('border border-black text-center', className)}>
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
        <div
          className={clsx('relative -mt-2', {
            'aspect-[8/1] sm:aspect-[10/1]': !compact,
            'aspect-[4/1] -my-1': compact,
          })}>
          <ResponsiveContainer>
            <Chart data={data} syncId={syncId}>
              <Line
                dataKey={dataKey}
                stroke="#000"
                strokeWidth={1.5}
                dot={false}
                activeDot={{
                  fill: colors.rose['500'],
                  r: 2.5,
                  strokeWidth: 0,
                }}
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
        <div className="font-medium bg-black text-white py-0.5" style={{ margin: 1 }}>
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
