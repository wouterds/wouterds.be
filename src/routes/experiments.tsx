import { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const env = (context as Context).env;

  const raw = await env.WOUTERDSBE.get('aranet');
  const records = JSON.parse(raw || '') as AranetRecord[];

  return {
    records,
  };
};

export const meta: MetaFunction = () => {
  return [
    { title: 'Experiments' },
    {
      name: 'description',
      content: 'Just a page with random experiments.',
    },
  ];
};

export default function Experiments() {
  const data = useLoaderData<typeof loader>();
  const lastRecord = data.records[data.records.length - 1];

  return (
    <>
      <h1 className="text-xl font-medium mb-2">Experiments</h1>
      <p className="mb-6">
        This page is just a playground for random experiments. Not much to see
        here!
      </p>
      <h2 className="text-lg font-medium mb-2">Aranet readings</h2>
      <p className="mb-4">
        Once a minute a Raspberry Pi pushes{' '}
        <a className="underline" href="https://aranet.com/products/aranet4">
          aranet4
        </a>{' '}
        readings to{' '}
        <a className="underline" href="https://developers.cloudflare.com/kv/">
          Cloudflare Workers KV
        </a>{' '}
        which you can view here.
      </p>
      <ul className="gap-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 text-center">
        <li className="border border-black dark:border-white">
          <div className="text-sm font-semibold py-2">{lastRecord.co2}</div>
          <div
            className="font-medium bg-black dark:bg-white text-white dark:text-black py-0.5"
            style={{ margin: 1 }}>
            co2
          </div>
        </li>
        <li className="border border-black dark:border-white">
          <div className="text-sm font-semibold py-2">
            {lastRecord.temperature}
          </div>
          <div
            className="font-medium bg-black dark:bg-white text-white dark:text-black py-0.5"
            style={{ margin: 1 }}>
            temperature
          </div>
        </li>
        <li className="border border-black dark:border-white">
          <div className="text-sm font-semibold py-2">
            {lastRecord.humidity}
          </div>
          <div
            className="font-medium bg-black dark:bg-white text-white dark:text-black py-0.5"
            style={{ margin: 1 }}>
            humidity
          </div>
        </li>
        <li className="border border-black dark:border-white">
          <div className="text-sm font-semibold py-2">
            {lastRecord.pressure}
          </div>
          <div
            className="font-medium bg-black dark:bg-white text-white dark:text-black py-0.5"
            style={{ margin: 1 }}>
            pressure
          </div>
        </li>
        <li className="border border-black dark:border-white">
          <div className="text-sm font-semibold py-2">{lastRecord.battery}</div>
          <div
            className="font-medium bg-black dark:bg-white text-white dark:text-black py-0.5"
            style={{ margin: 1 }}>
            battery
          </div>
        </li>
        <li className="border border-black dark:border-white">
          <div className="text-sm font-semibold py-2">{lastRecord.time}</div>
          <div
            className="font-medium bg-black dark:bg-white text-white dark:text-black py-0.5"
            style={{ margin: 1 }}>
            time
          </div>
        </li>
      </ul>
    </>
  );
}
