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

const dataConfigs = [
  { dataKey: 'battery', unit: '%' },
  { dataKey: 'temperatureInside', unit: '°C' },
];

export const TeslaCharts = () => {
  const [data, setData] = useState<ChartData | null>(null);

  const fetchData = useCallback(async () => {
    const response = await fetch('/api/experiments?timeseries=tesla');
    if (!response.ok) {
      return;
    }

    setData(await response.json());
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="border-t border-gray-200 bg-white min-w-full px-6 sm:px-8 py-4 absolute left-0 right-0 bottom-12 z-10">
      <div className="space-y-4">
        {!data?.hourly ? (
          <>
            <div>
              <h3 className="text-xs font-medium text-gray-700 mb-2">24 hour data</h3>
              <div className="flex gap-4 overflow-x-auto">
                {dataConfigs.map((config, index) => (
                  <Skeleton key={index} className="w-full max-w-52 h-[80px]" />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-medium text-gray-700 mb-2">30 day data</h3>
              <div className="flex gap-4 overflow-x-auto">
                {dataConfigs.map((config, index) => (
                  <Skeleton key={index} className="w-full max-w-52 h-[80px]" />
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-medium text-gray-700">24 hour data</h3>
                <span className="text-xs font-medium text-lime-700" />
              </div>
              <div className="flex gap-4 overflow-x-auto">
                {dataConfigs.map((config, index) => (
                  <BarChart
                    key={index}
                    data={data.hourly}
                    dataKey={config.dataKey}
                    unit={config.unit}
                    syncId="hourly"
                    className="w-full max-w-52"
                  />
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-medium text-gray-700">30 day data</h3>
                <span className="text-xs font-medium text-lime-700" />
              </div>
              <div className="flex gap-4 overflow-x-auto">
                {dataConfigs.map((config, index) => (
                  <BarChart
                    key={index}
                    data={data.daily}
                    dataKey={config.dataKey}
                    unit={config.unit}
                    syncId="daily"
                    className="w-full max-w-52"
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
