import { json, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { format, fromUnixTime, getUnixTime } from 'date-fns';
import { useMemo } from 'react';

import { BarChart } from '~/components/charts/bar-chart';
import { LineChart } from '~/components/charts/line-chart';
import { P1Repository } from '~/data/repositories/p1-repository';
import { TeslaRepository } from '~/data/repositories/tesla-repository';
import { AranetReadings } from '~/database/aranet-readings/repository';
import { useTimeAgo } from '~/hooks/use-time-ago';

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const p1Repository = P1Repository.create(context);
  const teslaRepository = TeslaRepository.create(context);

  await Promise.all([p1Repository.getAll(), teslaRepository.getAll()]);

  return json({
    aranet: await AranetReadings.getAll(),
    p1: await p1Repository.getAll(),
    p1History: await p1Repository.getHistory({ days: 90 }),
    teslaBatteryConsumedToday: await teslaRepository.batteryConsumedToday(),
    teslaBatteryChargedToday: await teslaRepository.batteryChargedToday(),
    teslaLastCharged: await teslaRepository.lastCharged(),
    teslaLast24h: await teslaRepository.getAll({ days: 1 }),
    teslaDistance: await teslaRepository.distancePerDay({ days: 90 }),
    teslaChargedPerDay: await teslaRepository.chargedPerDay({ days: 90 }),
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
    teslaChargedPerDay,
    teslaBatteryConsumptionPerDay,
    teslaBatteryConsumedToday,
    teslaBatteryChargedToday,
    teslaLastCharged,
  } = useLoaderData<typeof loader>();

  const lastAranetUpdate = useTimeAgo(
    getUnixTime(new Date(aranet[aranet.length - 1]?.created_at || 0)),
  );
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

  const mostChargedDay = useMemo(() => {
    return teslaChargedPerDay?.reduce(
      (acc, record) => {
        if (record.battery > acc.battery) {
          return record;
        }

        return acc;
      },
      { battery: 0 } as { date: string; battery: number },
    );
  }, [teslaChargedPerDay]);

  const p1Peak = useMemo(() => {
    return p1.reduce(
      (acc, record) => {
        if (record.active > acc.active) {
          return record;
        }

        return acc;
      },
      { active: 0 } as { time: number; active: number },
    );
  }, [p1]);

  const p1HistoryPeak = useMemo(() => {
    return p1History.reduce(
      (acc, record) => {
        if (record.usage > acc.usage) {
          return record;
        }

        return acc;
      },
      { usage: 0 } as { time: number; usage: number },
    );
  }, [p1History]);

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
            rounding={0}
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
            rounding={1}
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
            rounding={1}
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
          footer={[
            lastP1Update && <span>last updated: {lastP1Update}</span>,
            p1Peak && (
              <span>
                peak usage: {p1Peak.active} Wh @ {format(fromUnixTime(p1Peak.time), 'HH:mm')}
              </span>
            ),
          ]}
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
          footer={[
            lastP1HistoryUpdate && <span>last updated: {lastP1HistoryUpdate}</span>,
            p1HistoryPeak && (
              <span>
                peak usage: {p1HistoryPeak.usage.toFixed(2)} kWh @{' '}
                {format(fromUnixTime(p1HistoryPeak.time), 'dd.MM.yyyy')}
              </span>
            ),
          ]}
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
                consumed last 24h: {teslaBatteryConsumedToday.toFixed(0)}%
                {teslaBatteryChargedToday > 1
                  ? `, charged last 24h: ${teslaBatteryChargedToday.toFixed(0)}%`
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
      {teslaChargedPerDay.length > 0 && (
        <BarChart
          syncId="tesla"
          data={teslaChargedPerDay}
          dataKey="battery"
          unit="%"
          rounding={0}
          label="battery charging (last 90 days)"
          className="mt-4"
          footer={[
            lastTeslaUpdate && <span>last updated: {lastTeslaUpdate}</span>,
            mostChargedDay && (
              <span>
                most charging: {mostChargedDay.battery.toFixed(0)}% @{' '}
                {format(mostChargedDay?.date, 'dd.MM.yyyy')}
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
