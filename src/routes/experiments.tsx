import { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { useLoaderData, useRevalidator } from '@remix-run/react';
import { format, formatDistanceToNowStrict, fromUnixTime } from 'date-fns';
import { useState } from 'react';
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, YAxis } from 'recharts';

import { useInterval } from '~/hooks/use-interval';
import { useIsDarkMode } from '~/hooks/use-is-dark-mode';
import { AranetRecord, P1HistoryRecord, P1Record } from '~/lib/kv';

export const loader = async ({
  context: {
    cloudflare: { env },
  },
}: LoaderFunctionArgs) => {
  const aranetRecords: AranetRecord[] = [];
  try {
    aranetRecords.push(
      ...(await env.CACHE.get('aranet').then((value) => {
        return JSON.parse(value || '');
      })),
    );
  } catch {
    // noop
  }

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
  const peak = {
    usage: peakRecord?.peak || 0,
    time: peakRecord?.peakTime || 0,
  };

  const P1HistoryRecords: Array<{ usage: number; time: number }> = P1HistoryRecordsData.map(
    (record, index) => ({
      usage: index === 0 ? 0 : record.total - P1HistoryRecordsData[index - 1].total,
      time: record.time,
    }),
  ).slice(-90);

  return { aranetRecords, P1Records, peak, P1HistoryRecords };
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
  const { aranetRecords, P1Records, P1HistoryRecords, peak } = useLoaderData<typeof loader>();
  const aranetRecord = aranetRecords[aranetRecords.length - 1];
  const P1Record = P1Records[P1Records.length - 1];
  const P1HistoryRecord = P1HistoryRecords[P1HistoryRecords.length - 1];
  const { revalidate } = useRevalidator();
  const isDarkMode = useIsDarkMode();

  const [lastAranetUpdate, setLastAranetUpdate] = useState(
    aranetRecord?.time
      ? formatDistanceToNowStrict(fromUnixTime(aranetRecord?.time), {
          addSuffix: true,
        })
      : null,
  );
  const [lastP1Update, setLastP1Update] = useState(
    P1Record?.time
      ? formatDistanceToNowStrict(fromUnixTime(P1Record?.time), {
          addSuffix: true,
        })
      : null,
  );
  const [lastP1HistoryUpdate, setLastP1HistoryUpdate] = useState(
    P1HistoryRecord?.time
      ? formatDistanceToNowStrict(fromUnixTime(P1HistoryRecord?.time), {
          addSuffix: true,
        })
      : null,
  );

  useInterval(revalidate, 1000 * 30);

  useInterval(() => {
    if (aranetRecord) {
      setLastAranetUpdate(
        formatDistanceToNowStrict(fromUnixTime(aranetRecord.time), {
          addSuffix: true,
        }),
      );
    }

    if (P1Record) {
      setLastP1Update(
        formatDistanceToNowStrict(fromUnixTime(P1Record.time), {
          addSuffix: true,
        }),
      );
    }

    if (P1HistoryRecord) {
      setLastP1HistoryUpdate(
        formatDistanceToNowStrict(fromUnixTime(P1HistoryRecord.time), {
          addSuffix: true,
        }),
      );
    }
  }, 1000);

  return (
    <>
      <h1 className="text-xl font-medium mb-2">Experiments</h1>
      <p className="mb-6">
        This page is just a playground for random experiments. Not much to see here!
      </p>
      <h2 className="text-lg font-medium mb-2">Aranet readings</h2>
      <p className="mb-4">
        Every 5 minutes a Raspberry Pi pushes{' '}
        <a className="underline" href="https://aranet.com/products/aranet4">
          Aranet4
        </a>{' '}
        readings to{' '}
        <a className="underline" href="https://developers.cloudflare.com/kv/">
          Cloudflare Workers KV
        </a>
        .
      </p>
      {aranetRecord && (
        <ul className="gap-1.5 grid grid-cols-2 sm:grid-cols-4 text-center">
          <li className="border border-black dark:border-white">
            <div className="py-2">
              <span className="font-semibold">{aranetRecord.co2}</span> ppm
            </div>
            <div className="relative aspect-[4/1] -my-1">
              <ResponsiveContainer>
                <LineChart data={aranetRecords}>
                  <Line
                    type="monotone"
                    dataKey="co2"
                    stroke={isDarkMode ? '#fff' : '#000'}
                    strokeWidth={1.5}
                    dot={false}
                  />
                  <YAxis
                    hide
                    domain={[
                      Math.min(...aranetRecords.map((record) => record.co2)) * 0.7,
                      Math.max(...aranetRecords.map((record) => record.co2)),
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
                <LineChart data={aranetRecords}>
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke={isDarkMode ? '#fff' : '#000'}
                    strokeWidth={1.5}
                    dot={false}
                  />
                  <YAxis
                    hide
                    domain={[
                      Math.min(...aranetRecords.map((record) => record.temperature)) * 0.85,
                      Math.max(...aranetRecords.map((record) => record.temperature)),
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
                <LineChart data={aranetRecords}>
                  <Line
                    type="monotone"
                    dataKey="humidity"
                    stroke={isDarkMode ? '#fff' : '#000'}
                    strokeWidth={1.5}
                    dot={false}
                  />
                  <YAxis
                    hide
                    domain={[
                      Math.min(...aranetRecords.map((record) => record.humidity)) * 0.9,
                      Math.max(...aranetRecords.map((record) => record.humidity)) * 0.8,
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
                <LineChart data={aranetRecords}>
                  <Line
                    type="monotone"
                    dataKey="pressure"
                    stroke={isDarkMode ? '#fff' : '#000'}
                    strokeWidth={1.5}
                    dot={false}
                  />
                  <YAxis
                    hide
                    domain={[
                      Math.min(...aranetRecords.map((record) => record.pressure)) * 0.995,
                      Math.max(...aranetRecords.map((record) => record.pressure)) * 1.001,
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
          title={format(fromUnixTime(aranetRecord.time), 'HH:mm')}>
          <span>last updated: {lastAranetUpdate}</span>
          <span>battery: {aranetRecord.battery}%</span>
        </p>
      )}

      <h2 className="text-lg font-medium mb-2 mt-6">Energy usage</h2>
      <p className="mb-4">
        Every 10 minutes a Raspberry Pi pushes{' '}
        <a className="underline" href="https://www.homewizard.com/p1-meter/">
          P1 meter
        </a>{' '}
        readings to{' '}
        <a className="underline" href="https://developers.cloudflare.com/kv/">
          Cloudflare Workers KV
        </a>
        .
      </p>

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
                    stroke={isDarkMode ? '#fff' : '#000'}
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
              power usage
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
        <ul className="gap-1.5 text-center mt-4">
          <li className="border border-black dark:border-white">
            <div className="py-2">
              <span className="font-semibold">{P1HistoryRecord.usage.toFixed(2)}</span> kWh
            </div>
            <div className="relative aspect-[8/1] sm:aspect-[10/1] -mt-1">
              <ResponsiveContainer>
                <BarChart data={P1HistoryRecords}>
                  <YAxis hide />
                  <Bar dataKey="usage" fill={isDarkMode ? '#fff' : '#000'} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div
              className="font-medium bg-black dark:bg-white text-white dark:text-black py-0.5"
              style={{ margin: 1 }}>
              power usage (daily total)
            </div>
          </li>
        </ul>
      )}

      <p className="flex flex-col sm:flex-row gap-1 justify-start sm:justify-between mt-2">
        {lastP1HistoryUpdate && <span>last updated: {lastP1HistoryUpdate}</span>}
        {!!peak?.usage && (
          <span>
            peak: {(peak.usage / 1000).toFixed(2)} kWh @{' '}
            {format(fromUnixTime(peak.time), 'dd.MM.yyyy, HH:mm')}
          </span>
        )}
      </p>
    </>
  );
}
