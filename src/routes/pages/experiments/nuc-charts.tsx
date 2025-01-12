import { formatDistanceToNowStrict } from 'date-fns';
import { useLoaderData } from 'react-router';

import { LineChart } from '~/components/charts/line-chart';
import { useTick } from '~/hooks/use-tick';

import { loader } from './index';

export const NUCCharts = () => {
  useTick('1 second');

  const { NUCAveragesLast24h, lastNUCReading } = useLoaderData<typeof loader>();

  return (
    <div>
      <h2 className="text-lg font-medium mb-3">NUC readings</h2>
      {!!NUCAveragesLast24h?.length && (
        <div className="gap-1.5 grid grid-cols-2 sm:grid-cols-4 text-center">
          <LineChart
            syncId="nuc"
            data={NUCAveragesLast24h}
            dataKey="cpuTemp"
            unit="ºC"
            rounding={1}
            header={`${NUCAveragesLast24h[NUCAveragesLast24h.length - 1].cpuTemp}ºC`}
            label="cpu temperature"
            scale={{ min: 0.8, max: 1.1 }}
            compact
          />
          <LineChart
            syncId="nuc"
            data={NUCAveragesLast24h}
            dataKey="cpuUsage"
            unit="%"
            rounding={1}
            header={`${NUCAveragesLast24h[NUCAveragesLast24h.length - 1].cpuUsage}%`}
            label="cpu"
            scale={{ min: 0.6, max: 1.4 }}
            compact
          />
          <LineChart
            syncId="nuc"
            data={NUCAveragesLast24h}
            dataKey="memoryUsage"
            unit="%"
            rounding={1}
            header={`${NUCAveragesLast24h[NUCAveragesLast24h.length - 1].memoryUsage}%`}
            label="memory"
            scale={{ min: 0.8, max: 1.1 }}
            compact
          />
          <LineChart
            syncId="nuc"
            data={NUCAveragesLast24h}
            dataKey="diskUsage"
            unit="%"
            rounding={1}
            header={`${NUCAveragesLast24h[NUCAveragesLast24h.length - 1].diskUsage}%`}
            label="disk"
            scale={{ min: 0.99, max: 1.01 }}
            compact
          />
        </div>
      )}
      {!!lastNUCReading && (
        <p className="flex flex-col sm:flex-row gap-1 justify-start sm:justify-between mt-2">
          <span>
            last updated: {formatDistanceToNowStrict(lastNUCReading.createdAt, { addSuffix: true })}
          </span>
        </p>
      )}
    </div>
  );
};
