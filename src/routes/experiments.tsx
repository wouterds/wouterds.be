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
      <h2 className="text-lg font-medium mb-2">Lastest Aranet readings</h2>
      <ul className="gap-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
        <li className="border border-black dark:border-white text-center py-2 px-4 flex-1">
          <div className="text-sm font-semibold mb-1">{lastRecord.co2}</div>
          <div className="font-medium">co2</div>
        </li>
        <li className="border border-black dark:border-white text-center py-2 px-4 flex-1">
          <div className="text-sm font-semibold mb-1">
            {lastRecord.temperature}
          </div>
          <div className="font-medium">temperature</div>
        </li>
        <li className="border border-black dark:border-white text-center py-2 px-4 flex-1">
          <div className="text-sm font-semibold mb-1">
            {lastRecord.humidity}
          </div>
          <div className="font-medium">humidity</div>
        </li>
        <li className="border border-black dark:border-white text-center py-2 px-4 flex-1">
          <div className="text-sm font-semibold mb-1">
            {lastRecord.pressure}
          </div>
          <div className="font-medium">pressure</div>
        </li>
        <li className="border border-black dark:border-white text-center py-2 px-4 flex-1">
          <div className="text-sm font-semibold mb-1">{lastRecord.battery}</div>
          <div className="font-medium">battery</div>
        </li>
        <li className="border border-black dark:border-white text-center py-2 px-4 flex-1">
          <div className="text-sm font-semibold mb-1">{lastRecord.time}</div>
          <div className="font-medium">time</div>
        </li>
      </ul>
    </>
  );
}
