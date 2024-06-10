import { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { format, fromUnixTime } from 'date-fns';
import { useMemo } from 'react';

import { BarChart } from '~/components/charts/bar-chart';
import { LineChart } from '~/components/charts/line-chart';
import { AranetRepository } from '~/data/repositories/aranet-repository';
import { P1Repository } from '~/data/repositories/p1-repository';
import { TeslaRepository } from '~/data/repositories/tesla-repository';
import { useTimeAgo } from '~/hooks/use-time-ago';

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const p1Repository = P1Repository.create(context);
  const aranetRepository = AranetRepository.create(context);
  const teslaRepository = TeslaRepository.create(context);

  const [aranet, p1, p1History, teslaLast24h, teslaLast90d, teslaDistance] = await Promise.all([
    aranetRepository.getAll(),
    p1Repository.getAll(),
    p1Repository.getHistory({ days: 90 }),
    teslaRepository.getAll({ days: 1 }),
    teslaRepository.getAll({ days: 90 }),
    teslaRepository.distancePerDay({ days: 90 }),
  ]);

  return {
    aranet,
    p1,
    p1History,
    teslaLast24h,
    teslaLast90d,
    teslaDistance,
  };
};

export const meta: MetaFunction = () => {
  return [
    { title: 'Experiments' },
    { name: 'description', content: 'Playground with random experiments, not much to see here!' },
  ];
};

export default function Experiments() {
  const { aranet, p1, p1History, teslaLast24h, teslaLast90d, teslaDistance } =
    useLoaderData<typeof loader>();

  const aranetRecord = aranet[aranet.length - 1];
  const p1Record = p1[p1.length - 1];
  const p1HistoryRecord = p1History[p1History.length - 1];
  const teslaRecord = teslaLast24h[teslaLast24h.length - 1];

  const lastAranetUpdate = useTimeAgo(aranetRecord?.time);
  const lastP1Update = useTimeAgo(p1Record?.time);
  const lastP1HistoryUpdate = useTimeAgo(p1HistoryRecord?.time);
  const lastTeslaUpdate = useTimeAgo(teslaRecord?.time);

  const teslaLastCharged = useMemo(() => {
    let last = teslaLast90d.pop();
    let previous = teslaLast90d.pop();

    while (previous && last && previous?.battery >= last?.battery) {
      last = previous;
      previous = teslaLast90d.pop();
    }

    return last || null;
  }, [teslaLast90d]);

  const teslaLongestDistanceDay = useMemo(() => {
    return teslaDistance?.reduce(
      (acc, record) => {
        if (record.distance > acc.distance) {
          return record;
        }

        return acc;
      },
      { distance: 0 } as { date: Date; distance: number },
    );
  }, [teslaDistance]);

  return (
    <>
      <h1 className="text-xl font-medium mb-4">Experiments</h1>
      <h2 className="text-lg font-medium mb-4">Aranet readings</h2>
      {aranetRecord && (
        <div className="gap-1.5 grid grid-cols-2 sm:grid-cols-4 text-center">
          <LineChart
            data={aranet}
            dataKey="co2"
            unit=" ppm"
            header={`${aranetRecord.co2} ppm`}
            label="co2"
            scale={{ min: 0.8, max: 1 }}
            compact
          />
          <LineChart
            data={aranet}
            dataKey="temperature"
            unit=" ºC"
            header={`${aranetRecord.temperature} ºC`}
            label="temperature"
            scale={{ min: 0.9, max: 1 }}
            compact
          />
          <LineChart
            data={aranet}
            dataKey="humidity"
            unit="%"
            header={`${aranetRecord.humidity}%`}
            label="humidity"
            scale={{ min: 0.8, max: 1 }}
            compact
          />
          <LineChart
            data={aranet}
            dataKey="pressure"
            unit=" hPa"
            header={`${aranetRecord.pressure} hPa`}
            label="pressure"
            scale={{ min: 0.999, max: 1 }}
            compact
          />
        </div>
      )}
      {lastAranetUpdate && (
        <p className="flex flex-col sm:flex-row gap-1 justify-start sm:justify-between mt-2">
          <span>last updated: {lastAranetUpdate}</span>
          <span>battery: {aranetRecord?.battery}%</span>
        </p>
      )}

      <h2 className="text-lg font-medium mb-4 mt-4">Energy usage</h2>
      {p1Record && (
        <LineChart
          data={p1}
          dataKey="active"
          unit=" Wh"
          header={`${p1Record.active} Wh`}
          label="power usage (last 24 hours)"
          footer={[lastP1Update && <span>last updated: {lastP1Update}</span>]}
        />
      )}
      {p1HistoryRecord && (
        <BarChart
          data={p1History}
          dataKey="usage"
          unit=" kWh"
          header={`${p1HistoryRecord.usage.toFixed(2)} kWh`}
          label="power usage (last 90 days)"
          className="mt-4"
          footer={[lastP1HistoryUpdate && <span>last updated: {lastP1HistoryUpdate}</span>]}
        />
      )}

      <h2 className="text-lg font-medium mb-2 mt-4">Tesla data</h2>
      {teslaRecord && (
        <LineChart
          data={teslaLast24h}
          dataKey="battery"
          unit=" %"
          header={`${teslaRecord.battery.toFixed(0)}%`}
          label="battery capacity (last 24 hours)"
          footer={[
            lastTeslaUpdate && <span>last updated: {lastTeslaUpdate}</span>,
            teslaLastCharged && (
              <span>
                last charged: {teslaLastCharged?.battery?.toFixed(0)}% @{' '}
                {format(fromUnixTime(teslaLastCharged?.time || 0), 'dd.MM.yyyy, HH:mm')}
              </span>
            ),
          ]}
        />
      )}
      {teslaDistance.length > 0 && (
        <BarChart
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
