import { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { useLoaderData, useRevalidator } from '@remix-run/react';
import { format, fromUnixTime } from 'date-fns';
import { useMemo } from 'react';
import { Line, LineChart, ResponsiveContainer, YAxis } from 'recharts';

import { BarChart } from '~/components/charts/bar-chart';
import { AranetRepository } from '~/data/repositories/aranet-repository';
import { TeslaRepository } from '~/data/repositories/tesla-repository';
import { useInterval } from '~/hooks/use-interval';
import { useIsDarkMode } from '~/hooks/use-is-dark-mode';
import { useTimeDistance } from '~/hooks/use-time-distance';
import { P1HistoryRecord, P1Record } from '~/lib/kv';

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const env = context.cloudflare.env;

  const aranet = await AranetRepository.create(context).getAll();

  const P1Records: P1Record[] = [];
  try {
    P1Records.push(
      ...(await env.CACHE.get('p1').then((value) => {
        return JSON.parse(value || '');
      })),
    );
  } catch {
    // noop
  }

  const P1HistoryRecordsData: P1HistoryRecord[] = [];
  try {
    P1HistoryRecordsData.push(
      ...(await env.CACHE.get('p1-history').then((value) => {
        return JSON.parse(value || '');
      })),
    );
  } catch {
    // noop
  }

  const peakRecord = P1HistoryRecordsData.find(
    (record) => record.peak === Math.max(...P1HistoryRecordsData.map((r) => r.peak)),
  );
  const P1Peak = {
    usage: peakRecord?.peak || 0,
    time: peakRecord?.peakTime || 0,
  };

  const P1HistoryRecords: Array<{ usage: number; time: number }> = P1HistoryRecordsData.map(
    (record, index) => ({
      usage: index === 0 ? 0 : record.total - P1HistoryRecordsData[index - 1].total,
      time: record.time,
    }),
  ).slice(-90);

  const teslaRepository = TeslaRepository.create(context);
  const [tesla, teslaLastCharged, teslaDistanceLast90Days, teslaLongestDistanceDay] =
    await Promise.all([
      teslaRepository.getAll(),
      teslaRepository.getLastCharge(),
      teslaRepository.distancePerDay(90),
      teslaRepository.longestDayDistanceInRange(90),
    ]);

  return {
    aranet,
    P1Records,
    P1Peak,
    P1HistoryRecords,
    tesla,
    teslaLongestDistanceDay,
    teslaLastCharged,
    teslaDistanceLast90Days,
  };
};

export const meta: MetaFunction = () => {
  return [
    { title: 'Experiments' },
    {
      name: 'description',
      content: 'My playground with random experiments, not much to see here!',
    },
  ];
};

export default function Experiments() {
  const {
    aranet,
    P1Records,
    P1HistoryRecords,
    P1Peak,
    tesla,
    teslaDistanceLast90Days,
    teslaLongestDistanceDay,
    teslaLastCharged,
  } = useLoaderData<typeof loader>();
  const aranetRecord = aranet[aranet.length - 1];
  const P1Record = P1Records[P1Records.length - 1];
  const P1HistoryRecord = P1HistoryRecords[P1HistoryRecords.length - 1];
  const teslaRecord = tesla[tesla.length - 1];

  const lastAranetUpdate = useTimeDistance(aranetRecord?.time);
  const lastP1Update = useTimeDistance(P1Record?.time);
  const lastP1HistoryUpdate = useTimeDistance(P1HistoryRecord?.time);
  const lastTeslaUpdate = useTimeDistance(teslaRecord?.time);

  const isDarkMode = useIsDarkMode();
  const chartColor = useMemo(() => (isDarkMode ? '#fff' : '#000'), [isDarkMode]);

  const { revalidate } = useRevalidator();
  useInterval(revalidate, 1000 * 30);

  return (
    <>
      <h1 className="text-xl font-medium mb-2">Experiments</h1>
      <p className="mb-6">Playground with random experiments, not much to see here!</p>

      <h2 className="text-lg font-medium mb-4">Aranet readings</h2>
      {aranetRecord && (
        <ul className="gap-1.5 grid grid-cols-2 sm:grid-cols-4 text-center">
          <li className="border border-black dark:border-white">
            <div className="py-2">
              <span className="font-semibold">{aranetRecord.co2}</span> ppm
            </div>
            <div className="relative aspect-[4/1] -my-1">
              <ResponsiveContainer>
                <LineChart data={aranet}>
                  <Line
                    type="monotone"
                    dataKey="co2"
                    stroke={chartColor}
                    strokeWidth={1.5}
                    dot={false}
                  />
                  <YAxis
                    hide
                    domain={[
                      Math.min(...aranet.map((record) => record.co2)) * 0.7,
                      Math.max(...aranet.map((record) => record.co2)),
                    ]}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div
              className="font-medium bg-black dark:bg-white text-white dark:text-black py-0.5"
              style={{ margin: 1 }}>
              co2
            </div>
          </li>
          <li className="border border-black dark:border-white">
            <div className="py-2">
              <span className="font-semibold">{aranetRecord.temperature}</span>
              ºC
            </div>
            <div className="relative aspect-[4/1] -my-1">
              <ResponsiveContainer>
                <LineChart data={aranet}>
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke={chartColor}
                    strokeWidth={1.5}
                    dot={false}
                  />
                  <YAxis
                    hide
                    domain={[
                      Math.min(...aranet.map((record) => record.temperature)) * 0.85,
                      Math.max(...aranet.map((record) => record.temperature)),
                    ]}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div
              className="font-medium bg-black dark:bg-white text-white dark:text-black py-0.5"
              style={{ margin: 1 }}>
              temperature
            </div>
          </li>
          <li className="border border-black dark:border-white">
            <div className="py-2">
              <span className="font-semibold">{aranetRecord.humidity}</span>%
            </div>
            <div className="relative aspect-[4/1] -my-1">
              <ResponsiveContainer>
                <LineChart data={aranet}>
                  <Line
                    type="monotone"
                    dataKey="humidity"
                    stroke={chartColor}
                    strokeWidth={1.5}
                    dot={false}
                  />
                  <YAxis
                    hide
                    domain={[
                      Math.min(...aranet.map((record) => record.humidity)) * 0.9,
                      Math.max(...aranet.map((record) => record.humidity)) * 0.8,
                    ]}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div
              className="font-medium bg-black dark:bg-white text-white dark:text-black py-0.5"
              style={{ margin: 1 }}>
              humidity
            </div>
          </li>
          <li className="border border-black dark:border-white">
            <div className="py-2">
              <span className="font-semibold">{aranetRecord.pressure}</span> hPa
            </div>
            <div className="relative aspect-[4/1] -my-1">
              <ResponsiveContainer>
                <LineChart data={aranet}>
                  <Line
                    type="monotone"
                    dataKey="pressure"
                    stroke={chartColor}
                    strokeWidth={1.5}
                    dot={false}
                  />
                  <YAxis
                    hide
                    domain={[
                      Math.min(...aranet.map((record) => record.pressure)) * 0.995,
                      Math.max(...aranet.map((record) => record.pressure)) * 1.001,
                    ]}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div
              className="font-medium bg-black dark:bg-white text-white dark:text-black py-0.5"
              style={{ margin: 1 }}>
              pressure
            </div>
          </li>
        </ul>
      )}
      {lastAranetUpdate && (
        <p
          className="flex justify-between mt-2"
          title={format(fromUnixTime(aranetRecord?.time), 'HH:mm')}>
          <span>last updated: {lastAranetUpdate}</span>
          <span>battery: {aranetRecord?.battery}%</span>
        </p>
      )}

      <h2 className="text-lg font-medium mb-4 mt-6">Energy usage</h2>
      {P1Record && (
        <ul className="gap-1.5 text-center">
          <li className="border border-black dark:border-white">
            <div className="py-2">
              <span className="font-semibold">{P1Record.active}</span> Wh
            </div>
            <div className="relative aspect-[8/1] sm:aspect-[10/1] -mt-1">
              <ResponsiveContainer>
                <LineChart data={P1Records}>
                  <Line
                    type="monotone"
                    dataKey="active"
                    stroke={chartColor}
                    strokeWidth={1.5}
                    dot={false}
                  />
                  <YAxis
                    hide
                    domain={[
                      Math.min(...P1Records.map((record) => record.active)) * 1.3,
                      Math.max(...P1Records.map((record) => record.active)) * 0.7,
                    ]}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div
              className="font-medium bg-black dark:bg-white text-white dark:text-black py-0.5"
              style={{ margin: 1 }}>
              power usage (last 24 hours)
            </div>
          </li>
        </ul>
      )}
      {lastP1Update && (
        <p
          className="flex justify-between mt-2"
          title={format(fromUnixTime(P1Record.time), 'HH:mm')}>
          <span>last updated: {lastP1Update}</span>
        </p>
      )}

      {P1HistoryRecord && (
        <BarChart
          data={P1HistoryRecords}
          dataKey="usage"
          unit=" kWh"
          header={`${P1HistoryRecord.usage.toFixed(2)} kWh`}
          label="power usage (last 90 days)"
          className="mt-4"
        />
      )}
      <p className="flex flex-col sm:flex-row gap-1 justify-start sm:justify-between mt-2">
        {lastP1HistoryUpdate && <span>last updated: {lastP1HistoryUpdate}</span>}
        {!!P1Peak?.usage && (
          <span>
            peak: {(P1Peak.usage / 1000).toFixed(2)} kWh @{' '}
            {format(fromUnixTime(P1Peak.time), 'dd.MM.yyyy, HH:mm')}
          </span>
        )}
      </p>

      <h2 className="text-lg font-medium mb-2 mt-4">Tesla data</h2>
      {teslaRecord && (
        <ul className="gap-1.5 text-center">
          <li className="border border-black dark:border-white">
            <div className="py-2">
              <span className="font-semibold">{teslaRecord.battery?.toFixed(0)}</span>%
            </div>
            <div className="relative aspect-[8/1] sm:aspect-[10/1] -mt-1">
              <ResponsiveContainer>
                <LineChart data={tesla}>
                  <Line
                    type="monotone"
                    dataKey="battery"
                    stroke={chartColor}
                    strokeWidth={1.5}
                    dot={false}
                  />
                  <YAxis
                    hide
                    domain={[
                      Math.min(...tesla.map((record) => record.battery!)) * 1.3,
                      Math.max(...tesla.map((record) => record.battery!)) * 0.7,
                    ]}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div
              className="font-medium bg-black dark:bg-white text-white dark:text-black py-0.5"
              style={{ margin: 1 }}>
              battery capacity (last 7 days)
            </div>
          </li>
        </ul>
      )}

      {teslaRecord && (
        <p
          className="flex flex-col sm:flex-row gap-1 justify-start sm:justify-between mt-2"
          title={format(fromUnixTime(teslaRecord.time), 'HH:mm')}>
          <span>last updated: {lastTeslaUpdate}</span>
          <span>
            last charged: {teslaLastCharged?.battery?.toFixed(0)}% @{' '}
            {format(fromUnixTime(teslaLastCharged?.time || 0), 'dd.MM.yyyy, HH:mm')}
          </span>
        </p>
      )}

      {teslaDistanceLast90Days.length > 0 && (
        <BarChart
          data={teslaDistanceLast90Days}
          dataKey="distance"
          unit=" km"
          label="distance driven (last 90 days)"
          className="mt-4"
        />
      )}
      {teslaRecord && teslaLongestDistanceDay && (
        <p
          className="flex flex-col sm:flex-row gap-1 justify-start sm:justify-between mt-2"
          title={format(fromUnixTime(teslaRecord.time), 'HH:mm')}>
          <span>last updated: {lastTeslaUpdate}</span>
          <span>
            longest distance: {teslaLongestDistanceDay.distance?.toFixed(2)} km @{' '}
            {format(teslaLongestDistanceDay.date, 'dd.MM.yyyy')}
          </span>
        </p>
      )}
    </>
  );
}
