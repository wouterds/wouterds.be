import { useCallback, useEffect, useState } from 'react';

import { Skeleton } from '../../ui/skeleton';
import { BarChart } from './bar-chart';

type DataPoint = {
  date: string;
  [key: string]: string | number;
};

type ChartData = {
  hourly: DataPoint[];
  daily: DataPoint[];
};

type DataConfig = {
  dataKey: string;
  unit: string;
  label: string;
};

type BaseChartsProps = {
  dataConfigs: DataConfig[];
  apiEndpoint: string;
};

export const BaseCharts = ({ dataConfigs, apiEndpoint }: BaseChartsProps) => {
  const [data, setData] = useState<ChartData | null>(null);

  const fetchData = useCallback(async () => {
    const [response] = await Promise.all([
      fetch(apiEndpoint),
      new Promise((resolve) => setTimeout(resolve, 600)),
    ]);

    if (!response.ok) {
      return;
    }

    setData(await response.json());
  }, [apiEndpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="border-t border-gray-200 bg-white min-w-full px-6 sm:px-8 py-4 absolute left-0 right-0 bottom-12 z-10 overflow-x-scroll">
      <div className="space-y-4 flex-shrink-0">
        {!data?.hourly ? (
          <>
            <SkeletonSection title="24 hour data" dataConfigs={dataConfigs} />
            <SkeletonSection title="30 day data" dataConfigs={dataConfigs} />
          </>
        ) : (
          <>
            <ChartSection
              title="24 hour data"
              dataConfigs={dataConfigs}
              data={data.hourly}
              syncId="hourly"
            />
            <ChartSection
              title="30 day data"
              dataConfigs={dataConfigs}
              data={data.daily}
              syncId="daily"
            />
          </>
        )}
      </div>
    </div>
  );
};

const ChartSection = ({
  dataConfigs,
  title,
  data,
  syncId,
}: {
  dataConfigs: DataConfig[];
  title: string;
  data: DataPoint[];
  syncId: string;
}) => (
  <div>
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-xs font-medium text-gray-700">{title}</h3>
      <span className="text-xs font-medium text-lime-700" />
    </div>
    <div className="flex gap-4 overflow-x-auto">
      {dataConfigs.map((config, index) => (
        <BarChart
          key={index}
          data={data}
          dataKey={config.dataKey}
          unit={config.unit}
          label={config.label}
          syncId={syncId}
        />
      ))}
    </div>
  </div>
);

const SkeletonSection = ({ title, dataConfigs }: { title: string; dataConfigs: DataConfig[] }) => (
  <div>
    <h3 className="text-xs font-medium text-gray-700 mb-2">{title}</h3>
    <div className="flex gap-4 overflow-x-auto">
      {dataConfigs.map((_, index) => (
        <Skeleton key={index} className="w-full max-w-52 h-[80px] flex-shrink-0" />
      ))}
    </div>
  </div>
);
