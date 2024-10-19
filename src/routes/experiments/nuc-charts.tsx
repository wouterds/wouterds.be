import { useLoaderData } from '@remix-run/react';
import { formatDistanceToNowStrict } from 'date-fns';

import { LineChart } from '~/components/charts/line-chart';
import { useTick } from '~/hooks/use-tick';

import { loader } from './route';

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
            compact
          />
          <LineChart
            syncId="nuc"
            data={NUCAveragesLast24h}
            dataKey="memoryUsage"
            unit="%"
            rounding={0}
            header={`${NUCAveragesLast24h[NUCAveragesLast24h.length - 1].memoryUsage}%`}
            label="memory"
            compact
          />
          <LineChart
            syncId="nuc"
            data={NUCAveragesLast24h}
            dataKey="diskUsage"
            unit="%"
            rounding={0}
            header={`${NUCAveragesLast24h[NUCAveragesLast24h.length - 1].diskUsage}%`}
            label="disk"
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
