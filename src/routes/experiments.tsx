import { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { useLoaderData, useRevalidator } from '@remix-run/react';
import { format, formatDistanceToNowStrict, fromUnixTime } from 'date-fns';
import { useState } from 'react';
import { useInterval, useMedia } from 'react-use';
import { Line, LineChart, ResponsiveContainer, YAxis } from 'recharts';

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const env = (context as Context).env;

  const records = await env.WOUTERDSBE.get('aranet').then((value) => {
    return JSON.parse(value || '') as AranetRecord[];
  });

  return { records };
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
  const { records } = useLoaderData<typeof loader>();
  const record = records[records.length - 1];
  const { revalidate } = useRevalidator();
  const isDarkMode = useMedia('(prefers-color-scheme: dark)', false);
  const [lastUpdated, setLastUpdated] = useState(
    formatDistanceToNowStrict(fromUnixTime(record.time), {
      addSuffix: true,
    }),
  );

  useInterval(revalidate, 1000 * 30);

  useInterval(() => {
    setLastUpdated(
      formatDistanceToNowStrict(fromUnixTime(record.time), {
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
        bluetooth readings to{' '}
        <a className="underline" href="https://developers.cloudflare.com/kv/">
          Cloudflare Workers KV
        </a>
        .
      </p>
      <ul className="gap-2 grid grid-cols-2 sm:grid-cols-4 text-center">
        <li className="border border-black dark:border-white">
          <div className="py-2">
            <span className="font-semibold">{record.co2}</span> ppm
          </div>
          <div className="relative aspect-[3/1] -mb-2">
            <ResponsiveContainer>
              <LineChart data={records}>
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
                    Math.min(...records.map((record) => record.co2)) * 0.7,
                    Math.max(...records.map((record) => record.co2)),
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
            <span className="font-semibold">{record.temperature}</span>
            ºC
          </div>
          <div className="relative aspect-[3/1] -mb-2">
            <ResponsiveContainer>
              <LineChart data={records}>
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
                    Math.min(...records.map((record) => record.temperature)) *
                      0.85,
                    Math.max(...records.map((record) => record.temperature)),
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
            <span className="font-semibold">{record.humidity}</span>%
          </div>
          <div className="relative aspect-[3/1] -mb-2">
            <ResponsiveContainer>
              <LineChart data={records}>
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
                    Math.min(...records.map((record) => record.humidity)) * 0.9,
                    Math.max(...records.map((record) => record.humidity)) * 0.8,
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
            <span className="font-semibold">{record.pressure}</span> hPa
          </div>
          <div className="relative aspect-[3/1] -mb-2">
            <ResponsiveContainer>
              <LineChart data={records}>
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
                    Math.min(...records.map((record) => record.pressure)) *
                      0.995,
                    Math.max(...records.map((record) => record.pressure)) *
                      1.001,
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
      {lastUpdated && (
        <p
          className="flex justify-between mt-3"
          title={format(fromUnixTime(record.time), 'HH:mm')}>
          <span>last updated: {lastUpdated}</span>
          <span>battery: {record.battery}%</span>
        </p>
      )}
    </>
  );
}
