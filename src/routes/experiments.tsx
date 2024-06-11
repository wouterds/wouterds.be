import { json, LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { useLoaderData, useRevalidator } from '@remix-run/react';
import { format, fromUnixTime } from 'date-fns';
import ms from 'ms';
import { useMemo } from 'react';

import { BarChart } from '~/components/charts/bar-chart';
import { LineChart } from '~/components/charts/line-chart';
import { AranetRepository } from '~/data/repositories/aranet-repository';
import { P1Repository } from '~/data/repositories/p1-repository';
import { TeslaRepository } from '~/data/repositories/tesla-repository';
import { useInterval } from '~/hooks/use-interval';
import { useTimeAgo } from '~/hooks/use-time-ago';

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const p1Repository = P1Repository.create(context);
  const aranetRepository = AranetRepository.create(context);
  const teslaRepository = TeslaRepository.create(context);

  await Promise.all([p1Repository.getAll(), aranetRepository.getAll(), teslaRepository.getAll()]);

  return json({
    aranet: await aranetRepository.getAll(),
    p1: await p1Repository.getAll(),
    p1History: await p1Repository.getHistory({ days: 90 }),
    teslaBatteryConsumedToday: await teslaRepository.batteryConsumedToday(),
    teslaBatteryChargedToday: await teslaRepository.batteryChargedToday(),
    teslaLastCharged: await teslaRepository.lastCharged(),
    teslaLast24h: await teslaRepository.getAll({ days: 1 }),
    teslaDistance: await teslaRepository.distancePerDay({ days: 90 }),
    teslaBatteryConsumptionPerDay: await teslaRepository.batteryConsumptionPerDay({ days: 90 }),
  });
};

export const meta: MetaFunction = () => {
  return [
    { title: 'Experiments' },
    { name: 'description', content: 'Playground with random experiments, not much to see here!' },
  ];
};

export default function Experiments() {
  const {
    aranet,
    p1,
    p1History,
    teslaLast24h,
    teslaDistance,
    teslaBatteryConsumptionPerDay,
    teslaBatteryConsumedToday,
    teslaBatteryChargedToday,
    teslaLastCharged,
  } = useLoaderData<typeof loader>();

  const lastAranetUpdate = useTimeAgo(aranet[aranet.length - 1]?.time);
  const lastP1Update = useTimeAgo(p1[p1.length - 1]?.time);
  const lastP1HistoryUpdate = useTimeAgo(p1History[p1History.length - 1]?.time);
  const lastTeslaUpdate = useTimeAgo(teslaLast24h[teslaLast24h.length - 1]?.time);

  const teslaLongestDistanceDay = useMemo(() => {
    return teslaDistance?.reduce(
      (acc, record) => {
        if (record.distance > acc.distance) {
          return record;
        }

        return acc;
      },
      { distance: 0 } as { date: string; distance: number },
    );
  }, [teslaDistance]);

  const { revalidate } = useRevalidator();
  useInterval(revalidate, ms('1.5 minutes'));

  return (
    <>
      <h1 className="text-xl font-medium mb-4">Experiments</h1>
      <h2 className="text-lg font-medium mb-4">Aranet readings</h2>
      {aranet[aranet.length - 1] && (
        <div className="gap-1.5 grid grid-cols-2 sm:grid-cols-4 text-center">
          <LineChart
            syncId="aranet"
            data={aranet}
            dataKey="co2"
            unit=" ppm"
            header={`${aranet[aranet.length - 1].co2} ppm`}
            label="co2"
            scale={{ min: 0.8, max: 1 }}
            compact
          />
          <LineChart
            syncId="aranet"
            data={aranet}
            dataKey="temperature"
            unit=" ºC"
            header={`${aranet[aranet.length - 1].temperature} ºC`}
            label="temperature"
            scale={{ min: 0.9, max: 1 }}
            compact
          />
          <LineChart
            syncId="aranet"
            data={aranet}
            dataKey="humidity"
            unit="%"
            rounding={0}
            header={`${aranet[aranet.length - 1].humidity}%`}
            label="humidity"
            scale={{ min: 0.8, max: 1 }}
            compact
          />
          <LineChart
            syncId="aranet"
            data={aranet}
            dataKey="pressure"
            unit=" hPa"
            header={`${aranet[aranet.length - 1].pressure} hPa`}
            label="pressure"
            scale={{ min: 0.999, max: 1 }}
            compact
          />
        </div>
      )}
      {lastAranetUpdate && (
        <p className="flex flex-col sm:flex-row gap-1 justify-start sm:justify-between mt-2">
          <span>last updated: {lastAranetUpdate}</span>
          <span>battery: {aranet[aranet.length - 1]?.battery}%</span>
        </p>
      )}

      <h2 className="text-lg font-medium mb-4 mt-4">Energy usage</h2>
      {p1[p1.length - 1] && (
        <LineChart
          data={p1}
          dataKey="active"
          unit=" Wh"
          rounding={0}
          header={`${p1[p1.length - 1].active} Wh`}
          label="power usage (last 24 hours)"
          footer={[lastP1Update && <span>last updated: {lastP1Update}</span>]}
        />
      )}
      {p1History[p1History.length - 1] && (
        <BarChart
          data={p1History}
          dataKey="usage"
          unit=" kWh"
          header={`${p1History[p1History.length - 1].usage.toFixed(2)} kWh`}
          label="power usage (last 90 days)"
          className="mt-4"
          footer={[lastP1HistoryUpdate && <span>last updated: {lastP1HistoryUpdate}</span>]}
        />
      )}

      <h2 className="text-lg font-medium mb-2 mt-4">Tesla data</h2>
      {teslaLast24h[teslaLast24h.length - 1] && (
        <LineChart
          data={teslaLast24h}
          dataKey="battery"
          unit="%"
          rounding={0}
          header={`${teslaLast24h[teslaLast24h.length - 1].battery.toFixed(0)}%`}
          label="battery capacity (last 24 hours)"
          scale={{ min: 0.99, max: 1.01 }}
          footer={[
            lastTeslaUpdate && <span>last updated: {lastTeslaUpdate}</span>,
            teslaLastCharged && (
              <span>
                consumed today: {teslaBatteryConsumedToday.toFixed(0)}%
                {teslaBatteryChargedToday
                  ? `, charged today: ${teslaBatteryChargedToday.toFixed(0)}%`
                  : ''}
              </span>
            ),
          ]}
        />
      )}
      {teslaBatteryConsumptionPerDay.length > 0 && (
        <BarChart
          syncId="tesla"
          data={teslaBatteryConsumptionPerDay}
          dataKey="battery"
          unit="%"
          rounding={0}
          label="battery consumption (last 90 days)"
          className="mt-4"
          footer={[
            lastTeslaUpdate && <span>last updated: {lastTeslaUpdate}</span>,
            teslaLastCharged && (
              <span>
                last charged to: {teslaLastCharged?.battery?.toFixed(0)}% @{' '}
                {format(fromUnixTime(teslaLastCharged?.time || 0), 'dd.MM.yyyy, HH:mm')}
              </span>
            ),
          ]}
        />
      )}
      {teslaDistance.length > 0 && (
        <BarChart
          syncId="tesla"
          data={teslaDistance}
          dataKey="distance"
          unit=" km"
          label="distance driven (last 90 days)"
          className="mt-4"
          footer={[
            lastTeslaUpdate && <span>last updated: {lastTeslaUpdate}</span>,
            teslaLongestDistanceDay?.distance && teslaLongestDistanceDay?.date && (
              <span>
                longest distance: {teslaLongestDistanceDay.distance.toFixed(2)} km @{' '}
                {format(teslaLongestDistanceDay.date, 'dd.MM.yyyy')}
              </span>
            ),
          ]}
        />
      )}
    </>
  );
}
