import { Await, useLoaderData } from '@remix-run/react';
import { formatDistanceToNowStrict } from 'date-fns';
import { Suspense } from 'react';

import { LineChart } from '~/components/charts/line-chart';

import { loader } from './route';

export const AranetCharts = () => {
  const { aranetAveragesLast24h, lastAranetReading } = useLoaderData<typeof loader>();

  return (
    <>
      <h2 className="text-lg font-medium mb-4">Aranet readings</h2>
      <Suspense fallback={<div>Loading Aranet data...</div>}>
        <Await resolve={aranetAveragesLast24h}>
          {(resolvedAranetAverages) => (
            <>
              {!!resolvedAranetAverages?.length && (
                <div className="gap-1.5 grid grid-cols-2 sm:grid-cols-4 text-center">
                  <LineChart
                    syncId="aranet"
                    data={resolvedAranetAverages}
                    dataKey="co2"
                    unit=" ppm"
                    rounding={0}
                    header={`${resolvedAranetAverages[resolvedAranetAverages.length - 1].co2} ppm`}
                    label="co2"
                    scale={{ min: 0.8, max: 1 }}
                    compact
                  />
                  <LineChart
                    syncId="aranet"
                    data={resolvedAranetAverages}
                    dataKey="temperature"
                    unit=" ºC"
                    rounding={1}
                    header={`${resolvedAranetAverages[resolvedAranetAverages.length - 1].temperature} ºC`}
                    label="temperature"
                    scale={{ min: 0.9, max: 1 }}
                    compact
                  />
                  <LineChart
                    syncId="aranet"
                    data={resolvedAranetAverages}
                    dataKey="humidity"
                    unit="%"
                    rounding={0}
                    header={`${resolvedAranetAverages[resolvedAranetAverages.length - 1].humidity}%`}
                    label="humidity"
                    scale={{ min: 0.8, max: 1 }}
                    compact
                  />
                  <LineChart
                    syncId="aranet"
                    data={resolvedAranetAverages}
                    dataKey="pressure"
                    unit=" hPa"
                    rounding={1}
                    header={`${resolvedAranetAverages[resolvedAranetAverages.length - 1].pressure} hPa`}
                    label="pressure"
                    scale={{ min: 0.999, max: 1 }}
                    compact
                  />
                </div>
              )}
            </>
          )}
        </Await>
      </Suspense>

      <Suspense fallback={<div>Loading Aranet data...</div>}>
        <Await resolve={lastAranetReading}>
          {(resolvedLastReading) => (
            <>
              {!!resolvedLastReading && (
                <p className="flex flex-col sm:flex-row gap-1 justify-start sm:justify-between mt-2">
                  <span>
                    last updated:{' '}
                    {formatDistanceToNowStrict(resolvedLastReading.createdAt, { addSuffix: true })}
                  </span>
                  <span>battery: {resolvedLastReading?.battery}%</span>
                </p>
              )}
            </>
          )}
        </Await>
      </Suspense>
    </>
  );
};
