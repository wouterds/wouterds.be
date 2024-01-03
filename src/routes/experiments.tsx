import { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { useLoaderData, useRevalidator } from '@remix-run/react';
import { format, formatDistanceToNowStrict, fromUnixTime } from 'date-fns';
import { useState } from 'react';
import { useInterval, useMedia } from 'react-use';
import { Line, LineChart, ResponsiveContainer, YAxis } from 'recharts';

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const env = (context as Context).env;

  const aranetRecords = await env.WOUTERDSBE.get('aranet').then((value) => {
    return JSON.parse(value || '') as AranetRecord[];
  });

  const P1Records = await env.WOUTERDSBE.get('p1').then((value) => {
    return JSON.parse(value || '') as P1Record[];
  });

  return { aranetRecords, P1Records };
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
  const { aranetRecords, P1Records } = useLoaderData<typeof loader>();
  const aranetRecord = aranetRecords[aranetRecords.length - 1];
  const P1Record = P1Records[P1Records.length - 1];
  const { revalidate } = useRevalidator();
  const isDarkMode = useMedia('(prefers-color-scheme: dark)', false);
  const [lastAranetUpdate, setLastAranetUpdate] = useState(
    formatDistanceToNowStrict(fromUnixTime(aranetRecord.time), {
      addSuffix: true,
    }),
  );
  const [lastP1Update, setLastP1Update] = useState(
    formatDistanceToNowStrict(fromUnixTime(P1Record.time), {
      addSuffix: true,
    }),
  );

  useInterval(revalidate, 1000 * 30);

  useInterval(() => {
    setLastAranetUpdate(
      formatDistanceToNowStrict(fromUnixTime(aranetRecord.time), {
        addSuffix: true,
      }),
    );

    setLastP1Update(
      formatDistanceToNowStrict(fromUnixTime(P1Record.time), {
        addSuffix: true,
      }),
    );
  }, 1000);

  return (
    <>
      <h1 className="text-xl font-medium mb-2">Experiments</h1>
      <p className="mb-6">
        This page is just a playground for random experiments. Not much to see
        here!
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
                    Math.min(...aranetRecords.map((record) => record.co2)) *
                      0.7,
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
                    Math.min(
                      ...aranetRecords.map((record) => record.temperature),
                    ) * 0.85,
                    Math.max(
                      ...aranetRecords.map((record) => record.temperature),
                    ),
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
                    Math.min(
                      ...aranetRecords.map((record) => record.humidity),
                    ) * 0.9,
                    Math.max(
                      ...aranetRecords.map((record) => record.humidity),
                    ) * 0.8,
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
                    Math.min(
                      ...aranetRecords.map((record) => record.pressure),
                    ) * 0.995,
                    Math.max(
                      ...aranetRecords.map((record) => record.pressure),
                    ) * 1.001,
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
      {lastAranetUpdate && (
        <p
          className="flex justify-between mt-3"
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

      <ul className="gap-1.5 text-center">
        <li className="border border-black dark:border-white">
          <div className="py-2">
            <span className="font-semibold">{P1Record.active}</span> W
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
            power draw
          </div>
        </li>
      </ul>
      {lastP1Update && (
        <p
          className="flex justify-between mt-3"
          title={format(fromUnixTime(P1Record.time), 'HH:mm')}>
          <span>last updated: {lastP1Update}</span>
        </p>
      )}
    </>
  );
}
