import { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { useLoaderData, useRevalidator } from '@remix-run/react';
import { format, fromUnixTime } from 'date-fns';
import ms from 'ms';

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

  const [
    aranet,
    p1Records,
    p1HistoryRecords,
    tesla,
    teslaLastCharged,
    teslaDistanceLast90Days,
    teslaLongestDistanceDay,
  ] = await Promise.all([
    aranetRepository.getAll(),
    p1Repository.getAll(),
    p1Repository.getHistory(),
    teslaRepository.getAll(),
    teslaRepository.getLastCharge(),
    teslaRepository.distancePerDay(90),
    teslaRepository.longestDayDistanceInRange(90),
  ]);

  return {
    aranet,
    p1Records,
    p1HistoryRecords,
    tesla,
    teslaLongestDistanceDay,
    teslaLastCharged,
    teslaDistanceLast90Days,
  };
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
    p1Records,
    p1HistoryRecords,
    tesla,
    teslaDistanceLast90Days,
    teslaLongestDistanceDay,
    teslaLastCharged,
  } = useLoaderData<typeof loader>();
  const aranetRecord = aranet[aranet.length - 1];
  const p1Record = p1Records[p1Records.length - 1];
  const p1HistoryRecord = p1HistoryRecords[p1HistoryRecords.length - 1];
  const teslaRecord = tesla[tesla.length - 1];

  const lastAranetUpdate = useTimeAgo(aranetRecord?.time);
  const lastP1Update = useTimeAgo(p1Record?.time);
  const lastP1HistoryUpdate = useTimeAgo(p1HistoryRecord?.time);
  const lastTeslaUpdate = useTimeAgo(teslaRecord?.time);

  const { revalidate } = useRevalidator();
  useInterval(revalidate, ms('30 seconds'));

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
            scale={{ min: 0.95, max: 1.05 }}
            compact
          />
          <LineChart
            data={aranet}
            dataKey="temperature"
            unit=" ºC"
            header={`${aranetRecord.temperature} ºC`}
            label="temperature"
            scale={{ min: 0.9, max: 1.1 }}
            compact
          />
          <LineChart
            data={aranet}
            dataKey="humidity"
            unit="%"
            header={`${aranetRecord.humidity}%`}
            label="humidity"
            scale={{ min: 0.9, max: 1.1 }}
            compact
          />
          <LineChart
            data={aranet}
            dataKey="pressure"
            unit=" hPa"
            header={`${aranetRecord.pressure} hPa`}
            label="pressure"
            scale={{ min: 0.995, max: 1.005 }}
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
          data={p1Records}
          dataKey="active"
          unit=" Wh"
          header={`${p1Record.active} Wh`}
          label="power usage (last 24 hours)"
          footer={[lastP1Update && <span>last updated: {lastP1Update}</span>]}
        />
      )}
      {p1HistoryRecord && (
        <BarChart
          data={p1HistoryRecords}
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
          data={tesla}
          dataKey="battery"
          unit=" %"
          header={`${teslaRecord.battery.toFixed(0)}%`}
          label="battery capacity (last 7 days)"
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
      {teslaDistanceLast90Days.length > 0 && (
        <BarChart
          data={teslaDistanceLast90Days}
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
