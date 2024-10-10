import { useLoaderData } from '@remix-run/react';
import { formatDistanceToNowStrict } from 'date-fns';

import { LineChart } from '~/components/charts/line-chart';
import { useTick } from '~/hooks/use-tick';

import { loader } from './route';

export const AranetCharts = () => {
  useTick('1 second');

  const { aranetAveragesLast24h, lastAranetReading } = useLoaderData<typeof loader>();

  return (
    <div>
      <h2 className="text-lg font-medium mb-3">Aranet readings</h2>
      {!!aranetAveragesLast24h?.length && (
        <div className="gap-1.5 grid grid-cols-2 sm:grid-cols-4 text-center">
          <LineChart
            syncId="aranet"
            data={aranetAveragesLast24h}
            dataKey="co2"
            unit=" ppm"
            rounding={0}
            header={`${aranetAveragesLast24h[aranetAveragesLast24h.length - 1].co2} ppm`}
            label="co2"
            scale={{ min: 0.8, max: 1 }}
            compact
          />
          <LineChart
            syncId="aranet"
            data={aranetAveragesLast24h}
            dataKey="temperature"
            unit=" ºC"
            rounding={1}
            header={`${aranetAveragesLast24h[aranetAveragesLast24h.length - 1].temperature} ºC`}
            label="temperature"
            scale={{ min: 0.9, max: 1 }}
            compact
          />
          <LineChart
            syncId="aranet"
            data={aranetAveragesLast24h}
            dataKey="humidity"
            unit="%"
            rounding={0}
            header={`${aranetAveragesLast24h[aranetAveragesLast24h.length - 1].humidity}%`}
            label="humidity"
            scale={{ min: 0.8, max: 1 }}
            compact
          />
          <LineChart
            syncId="aranet"
            data={aranetAveragesLast24h}
            dataKey="pressure"
            unit=" hPa"
            rounding={1}
            header={`${aranetAveragesLast24h[aranetAveragesLast24h.length - 1].pressure} hPa`}
            label="pressure"
            scale={{ min: 0.999, max: 1 }}
            compact
          />
        </div>
      )}
      {!!lastAranetReading && (
        <p className="flex flex-col sm:flex-row gap-1 justify-start sm:justify-between mt-2">
          <span>
            last updated:{' '}
            {formatDistanceToNowStrict(lastAranetReading.createdAt, { addSuffix: true })}
          </span>
          <span>battery: {lastAranetReading?.battery}%</span>
        </p>
      )}
    </div>
  );
};
