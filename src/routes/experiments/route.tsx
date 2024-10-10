import { MetaFunction } from '@remix-run/node';
import { useRevalidator } from '@remix-run/react';
import ms from 'ms';
import { useEffect } from 'react';

import { AranetReadings } from '~/database/aranet-readings/repository';
import { P1Readings } from '~/database/p1-readings/repository';

import { AranetCharts } from './aranet-charts';
import { EnergyCharts } from './energy-charts';

export const loader = async () => {
  return {
    aranetAveragesLast24h: await AranetReadings.getLast24h({ sort: 'asc' }),
    lastAranetReading: await AranetReadings.getLast(),
    p1AveragesLast24h: await P1Readings.getLast24h({ sort: 'asc' }),
    lastP1Reading: await P1Readings.getLast(),
  };
};

export const meta: MetaFunction = () => {
  return [
    { title: 'Experiments' },
    { name: 'description', content: 'Playground with random experiments, not much to see here!' },
  ];
};

export default function Experiments() {
  const { revalidate } = useRevalidator();

  useEffect(() => {
    const interval = setInterval(() => {
      revalidate();
    }, ms('30 seconds'));

    return () => clearInterval(interval);
  }, [revalidate]);

  return (
    <>
      <h1 className="text-xl font-medium mb-6">Experiments</h1>
      <div className="flex flex-col w-full gap-6">
        <AranetCharts />
        <EnergyCharts />
      </div>
    </>
  );
}
